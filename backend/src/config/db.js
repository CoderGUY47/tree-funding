const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  const User = require('../models/User');
  try {
    const adminEmail = 'admin@treefunding.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('adminpassword123', salt);
      
      const defaultAdmin = new User({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'Admin',
        credits: 99999
      });
      
      await defaultAdmin.save();
      console.log('Default Admin user seeded successfully.');
    }
  } catch (err) {
    console.error('Failed to seed admin user:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tree_funding');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed admin account
    await seedAdmin();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
