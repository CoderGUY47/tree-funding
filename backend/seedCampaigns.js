const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');
const Campaign = require('./src/models/Campaign');
const Contribution = require('./src/models/Contribution');
const Withdrawal = require('./src/models/Withdrawal');
const Notification = require('./src/models/Notification');
const Report = require('./src/models/Report');
const Payment = require('./src/models/Payment');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tree_funding';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for seeding sandbox data.');

    // 1. Clear existing collections
    await User.deleteMany({});
    await Campaign.deleteMany({});
    await Contribution.deleteMany({});
    await Withdrawal.deleteMany({});
    await Notification.deleteMany({});
    await Report.deleteMany({});
    await Payment.deleteMany({});
    console.log('Cleared all collections (Users, Campaigns, Contributions, Withdrawals, Notifications, Reports, Payments).');

    const salt = await bcrypt.genSalt(10);
    const adminHashed = await bcrypt.hash('adminpassword123', salt);
    const creatorHashed = await bcrypt.hash('creatorpassword123', salt);
    const supporterHashed = await bcrypt.hash('supporterpassword123', salt);

    // 2. Seed Users (setting photoUrl to '' so they default to initials fallback)
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@treefunding.com',
      password: adminHashed,
      photoUrl: '',
      role: 'Admin',
      credits: 99999
    });

    const creator = new User({
      name: 'Green Creator',
      email: 'creator@treefunding.com',
      password: creatorHashed,
      photoUrl: '',
      role: 'Creator',
      credits: 500
    });

    const supporter = new User({
      name: 'S.M. Hasan',
      email: 'supporter@treefunding.com',
      password: supporterHashed,
      photoUrl: '',
      role: 'Supporter',
      credits: 450
    });

    await admin.save();
    await creator.save();
    await supporter.save();
    console.log('Seeded Users: Admin, Creator, Supporter.');

    // 3. Seed Campaigns (including Oldage Home, Old People, Old School, Food Issue)
    const campaign1 = new Campaign({
      creatorEmail: creator.email,
      creatorName: creator.name,
      title: 'Restoring Comfort: Shelter and Care for Old Age Homes',
      story: 'Support local old age homes by improving living conditions, providing warm bedding, and upgrading sanitation blocks for abandoned elder citizens.',
      category: 'Humanitarian',
      fundingGoal: 15000,
      minimumContribution: 100,
      amountRaised: 4200,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      rewardInfo: 'Elder Shield badge - Profile badge and quarterly updates.',
      imageUrl: '/images/cause_3.jpg',
      status: 'approved'
    });

    const campaign2 = new Campaign({
      creatorEmail: creator.email,
      creatorName: creator.name,
      title: 'Hunger Relief: Food Distribution Campaign',
      story: 'Provide essential dry rations (rice, grains, lentils, oil) and nutritious hot meals to low-income families suffering from food security issues.',
      category: 'Social Care',
      fundingGoal: 8000,
      minimumContribution: 50,
      amountRaised: 6000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      rewardInfo: 'Food Supporter Plaque - Engraved name on community center wall.',
      imageUrl: '/images/cause_2.jpg',
      status: 'approved'
    });

    const campaign3 = new Campaign({
      creatorEmail: creator.email,
      creatorName: creator.name,
      title: 'Companion and Medical Aid for Abandoned Old People',
      story: 'Deploy medical health checkup teams and companions to provide daily health monitoring and basic medicines for elderly folks living alone in rural areas.',
      category: 'Humanitarian',
      fundingGoal: 12000,
      minimumContribution: 75,
      amountRaised: 8900,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      rewardInfo: 'Health Guardian badge - Profile certificate and quarterly report.',
      imageUrl: '/images/cause_1.jpg',
      status: 'approved'
    });

    const campaign4 = new Campaign({
      creatorEmail: creator.email,
      creatorName: creator.name,
      title: 'Eco-Revival: Reforesting and Greenifying the Old School Grounds',
      story: 'Plant 2,000 native shade-bearing and fruit saplings in the old school campus to rebuild clean green spaces for student learning and recreational activities.',
      category: 'Reforestation',
      fundingGoal: 10000,
      minimumContribution: 80,
      amountRaised: 2500,
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      rewardInfo: 'Green Alumnus badge - Plant tagged with your name.',
      imageUrl: '/images/event_1.jpg',
      status: 'approved'
    });

    const pendingCampaign = new Campaign({
      creatorEmail: creator.email,
      creatorName: creator.name,
      title: 'Reforest the Coastal Mangroves of Sundarbans',
      story: 'Help us plant 5,000 mangrove saplings to protect vulnerable coastal villages from cyclone surges and restore marine biodiversity.',
      category: 'Environment',
      fundingGoal: 20000,
      minimumContribution: 150,
      amountRaised: 0,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      rewardInfo: 'Mangrove Guardian - Planting coordinates and drone shot of trees.',
      imageUrl: '/images/cause_mangrove_1783708491831.png',
      status: 'pending'
    });

    await campaign1.save();
    await campaign2.save();
    await campaign3.save();
    await campaign4.save();
    await pendingCampaign.save();
    console.log('Seeded Campaigns: 4 Approved (including Oldage, Food, and School themes), 1 Pending.');

    // 4. Seed Contributions
    const contribution1 = new Contribution({
      campaignId: campaign1._id,
      campaignTitle: campaign1.title,
      contributionAmount: 150,
      supporterEmail: supporter.email,
      supporterName: supporter.name,
      creatorEmail: creator.email,
      creatorName: creator.name,
      status: 'approved'
    });

    const contribution2 = new Contribution({
      campaignId: campaign2._id,
      campaignTitle: campaign2.title,
      contributionAmount: 100,
      supporterEmail: supporter.email,
      supporterName: supporter.name,
      creatorEmail: creator.email,
      creatorName: creator.name,
      status: 'pending'
    });

    const contribution3 = new Contribution({
      campaignId: campaign3._id,
      campaignTitle: campaign3.title,
      contributionAmount: 50,
      supporterEmail: supporter.email,
      supporterName: supporter.name,
      creatorEmail: creator.email,
      creatorName: creator.name,
      status: 'rejected'
    });

    await contribution1.save();
    await contribution2.save();
    await contribution3.save();
    console.log('Seeded Contributions: 1 Approved, 1 Pending, 1 Rejected.');

    // 5. Seed Withdrawals
    const withdrawal1 = new Withdrawal({
      creatorEmail: creator.email,
      creatorName: creator.name,
      withdrawalCredit: 300,
      withdrawalAmount: 15,
      paymentSystem: 'Bkash',
      accountNumber: '01712345678',
      status: 'pending'
    });

    const withdrawal2 = new Withdrawal({
      creatorEmail: creator.email,
      creatorName: creator.name,
      withdrawalCredit: 200,
      withdrawalAmount: 10,
      paymentSystem: 'Stripe',
      accountNumber: 'pm_card_visa',
      status: 'approved',
      withdrawDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    await withdrawal1.save();
    await withdrawal2.save();
    console.log('Seeded Withdrawals: 1 Pending, 1 Approved.');

    // 6. Seed Reports
    const report = new Report({
      campaignId: campaign2._id,
      campaignTitle: campaign2.title,
      reporterEmail: supporter.email,
      reporterName: supporter.name,
      reason: 'The campaign progress tracker contains duplicate image files and hasn\'t uploaded invoice statements.'
    });

    await report.save();
    console.log('Seeded 1 Campaign Report.');

    // 7. Seed Notifications
    const notification1 = new Notification({
      message: 'Your contribution of 150 credits to Restoring Comfort: Shelter and Care for Old Age Homes was approved by Green Creator.',
      toEmail: supporter.email,
      actionRoute: '/dashboard/supporter/contributions'
    });

    const notification2 = new Notification({
      message: 'S.M. Hasan has contributed 100 credits to Hunger Relief: Food Campaign.',
      toEmail: creator.email,
      actionRoute: '/dashboard'
    });

    const notification3 = new Notification({
      message: 'Withdrawal payout of $10 was approved by System Administrator.',
      toEmail: creator.email,
      actionRoute: '/dashboard/creator/payments'
    });

    await notification1.save();
    await notification2.save();
    await notification3.save();
    console.log('Seeded Notifications.');

    mongoose.connection.close();
    console.log('Database seeding finished successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
