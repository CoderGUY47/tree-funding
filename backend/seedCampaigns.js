const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');
const Campaign = require('./src/models/Campaign');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tree_funding';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for seeding campaigns.');

    // 1. Clear existing campaigns
    await Campaign.deleteMany({});
    console.log('Cleared existing campaigns.');

    // 2. Ensure default Creator user exists
    const creatorEmail = 'creator@treefunding.com';
    let creator = await User.findOne({ email: creatorEmail });

    if (!creator) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('creatorpassword123', salt);

      creator = new User({
        name: 'Green Creator',
        email: creatorEmail,
        password: hashedPassword,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'Creator',
        credits: 500
      });

      await creator.save();
      console.log('Default Creator user seeded successfully.');
    }

    // 3. Define campaigns using template images matching index.html
    const campaigns = [
      {
        creatorEmail: creator.email,
        creatorName: creator.name,
        title: 'Support Stray Children & Local Orphanages',
        story: 'This campaign is designed to support stray children and local orphanages who have no one. Contributions will provide fresh meals, warm clothes, textbooks, and shelter infrastructure to help kids build a safe, hopeful future.',
        category: 'Humanitarian',
        fundingGoal: 15000,
        minimumContribution: 100,
        amountRaised: 4200,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        rewardInfo: 'Ecosystem Protector - An official badge on your profile and quarterly updates on the kids progress.',
        imageUrl: '/images/cause_1.jpg',
        status: 'approved'
      },
      {
        creatorEmail: creator.email,
        creatorName: creator.name,
        title: 'Feed the Hungry: Community Food Shelter',
        story: 'Help us keep local food shelters and community kitchens stocked. This campaign supplies healthy ingredients, warm meals, and basic hygienic products directly to shelterless individuals and families in need.',
        category: 'Social Care',
        fundingGoal: 8000,
        minimumContribution: 50,
        amountRaised: 6000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        rewardInfo: 'Solar Supporter Plaque - Your name engraved on the main power station panel, plus a fresh basket of garden vegetables.',
        imageUrl: '/images/cause_2.jpg',
        status: 'approved'
      },
      {
        creatorEmail: creator.email,
        creatorName: creator.name,
        title: 'Care and Support for Shelterless Elderly',
        story: 'Empower our community workers to provide medical checkups, nutritious food packages, warm blankets, and housing support for abandoned elder citizens who have no families to look after them.',
        category: 'Humanitarian',
        fundingGoal: 12000,
        minimumContribution: 75,
        amountRaised: 8900,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        rewardInfo: 'Coastal Protector - An ecosystem badge on your user profile and quarterly updates on the growth and survival rates of the saplings.',
        imageUrl: '/images/cause_3.jpg',
        status: 'approved'
      }
    ];

    await Campaign.insertMany(campaigns);
    console.log('Successfully seeded 3 approved campaigns matching template images!');

    mongoose.connection.close();
    console.log('Mongoose connection closed.');
  } catch (err) {
    console.error('Error seeding campaigns:', err);
    process.exit(1);
  }
};

seedData();
