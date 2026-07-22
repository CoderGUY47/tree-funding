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

    const betterAuthHash = 'e5d22a0c19014ec5436b233e1f85c7f0:2502a78451062109c04dd749ae85c510187d29a4c0bb6b7ea6308e87ffd725026ded404adea2a6d2ecdbd5021172d9c5ff9b160162bcc205ded9b5ad0d2cfbcc';
    const adminHashed = betterAuthHash;
    const creatorHashed = betterAuthHash;
    const supporterHashed = betterAuthHash;

    // 2. Seed Users (setting photoUrl to '' so they default to initials fallback)
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@gmail.com',
      password: adminHashed,
      photoUrl: '',
      role: 'Admin',
      credits: 99999
    });

    const creator = new User({
      name: 'Green Creator',
      email: 'creater@gmail.com',
      password: creatorHashed,
      photoUrl: '',
      role: 'Creator',
      credits: 500
    });

    const supporter = new User({
      name: 'S.M. Hasan',
      email: 'supporter@gmail.com',
      password: supporterHashed,
      photoUrl: '',
      role: 'Supporter',
      credits: 450
    });

    await admin.save();
    await creator.save();
    await supporter.save();
    console.log('Seeded Users: Admin, Creator, Supporter.');

    // 3. Seed Campaigns (28 items, 2 per category for all 14 categories)
    const campaignsData = [
      // 1. Forestry
      {
        title: 'Urban Micro-Forestry Initiative',
        story: 'Plant native tree species in micro-plots across urban residential zones to reduce neighborhood heat island effects.',
        category: 'Forestry',
        fundingGoal: 10000,
        amountRaised: 3500,
        imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Sundarbans Mangrove Restoration',
        story: 'Restore mangrove cover along critical saline estuaries to protect coastal soil structures from rising sea levels.',
        category: 'Forestry',
        fundingGoal: 20000,
        amountRaised: 12000,
        imageUrl: '/images/cause_3.jpg',
        status: 'approved'
      },
      // 2. Solar
      {
        title: 'Off-Grid Solar Panels for Rural Clinics',
        story: 'Equip remote health outposts with 24/7 solar storage grids to maintain vaccine refrigeration and backup light modules.',
        category: 'Solar',
        fundingGoal: 15000,
        amountRaised: 4000,
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Clean Energy Solar Water Pumps',
        story: 'Deploy low-cost solar-driven irrigation pumps for smallholder agricultural cooperatives struggling with fuel pricing.',
        category: 'Solar',
        fundingGoal: 8000,
        amountRaised: 5200,
        imageUrl: '/images/cause_2.jpg',
        status: 'approved'
      },
      // 3. Gardening
      {
        title: 'Community Rooftop Vegetable Gardens',
        story: 'Deploy modular raised growing spaces on urban rooftops to cultivate organic vegetables for nearby low-income residents.',
        category: 'Gardening',
        fundingGoal: 5000,
        amountRaised: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Pollinator Habitat & Wildflower Beds',
        story: 'Transform neglected roadside strips into vibrant pollinator corridors seeded with native wildflowers to feed honeybee swarms.',
        category: 'Gardening',
        fundingGoal: 3500,
        amountRaised: 1800,
        imageUrl: '/images/cause_1.jpg',
        status: 'approved'
      },
      // 4. Reforestation
      {
        title: 'Post-Wildfire Deciduous Reforestation',
        story: 'Re-establish native oak and maple saplings in public valleys heavily damaged by recent summer brushfires.',
        category: 'Reforestation',
        fundingGoal: 25000,
        amountRaised: 9000,
        imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Hillside Soil Erosion Mitigation Project',
        story: 'Secure sliding terrain slopes near mountain highways by planting dense lines of deep-rooted firs and ground conifers.',
        category: 'Reforestation',
        fundingGoal: 12000,
        amountRaised: 6700,
        imageUrl: '/images/event_1.jpg',
        status: 'approved'
      },
      // 5. Humanitarian
      {
        title: 'Restoring Comfort for Old Age Shelter Homes',
        story: 'Upgrade sanitization layouts and supply medical cot setups for elder citizens abandoned in regional neighborhoods.',
        category: 'Humanitarian',
        fundingGoal: 18000,
        amountRaised: 14000,
        imageUrl: '/images/humanitarian_about.jpg',
        status: 'approved'
      },
      {
        title: 'Clean Water Well Installations',
        story: 'Drill community deep-well systems to deliver reliable and safe drinking water to remote villages suffering from waterborne illnesses.',
        category: 'Humanitarian',
        fundingGoal: 9500,
        amountRaised: 7800,
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      // 6. Social Care
      {
        title: 'Mental Health Counseling for Youth',
        story: 'Fund weekly clinical therapy group sessions and peer counselors for high school and university students dealing with acute anxiety.',
        category: 'Social Care',
        fundingGoal: 7500,
        amountRaised: 3200,
        imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Mobile Food Pantries for Poor Families',
        story: 'Deploy vans carrying fresh vegetables, grain items, and milk products directly to under-resourced housing projects.',
        category: 'Social Care',
        fundingGoal: 6000,
        amountRaised: 4500,
        imageUrl: '/images/cause_2.jpg',
        status: 'approved'
      },
      // 7. Art & Creative
      {
        title: 'Underground Community Theater Gear',
        story: 'Purchase professional staging rigs, LED spots, and audio capture interfaces for neighborhood dramatic theater groups.',
        category: 'Art & Creative',
        fundingGoal: 11000,
        amountRaised: 4100,
        imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Urban Public Mural Painting Project',
        story: 'Commission youth street artists to repaint concrete highway dividers with murals conveying environmental unity and green futures.',
        category: 'Art & Creative',
        fundingGoal: 4500,
        amountRaised: 2200,
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      // 8. Science & Tech
      {
        title: 'Open Air Quality Sensor Networks',
        story: 'Assemble and deploy modular public air particle sensor nodes to collect real-time data on carbon exhaust levels.',
        category: 'Science & Tech',
        fundingGoal: 14000,
        amountRaised: 6100,
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Robotics Coding Kits for Schools',
        story: 'Distribute reusable microcontroller kits and basic sensor modules to secondary school classrooms to foster STEM skills.',
        category: 'Science & Tech',
        fundingGoal: 8500,
        amountRaised: 4900,
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      // 9. Sports & Health
      {
        title: 'Adaptive Wheelchair Racing Equipment',
        story: 'Provide custom-made sports wheelchairs and training gloves for para-athletes preparing for regional track tournaments.',
        category: 'Sports & Health',
        fundingGoal: 16000,
        amountRaised: 8000,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Youth Sports Pitch Drainage Fix',
        story: 'Upgrade turf irrigation and drainage blocks on public pitches to keep youth leagues training safely during rainy cycles.',
        category: 'Sports & Health',
        fundingGoal: 7000,
        amountRaised: 3450,
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      // 10. Education
      {
        title: 'Rural School Library Book Drive',
        story: 'Purchase modern science, history, and literature textbooks along with simple bookshelves for remote schools.',
        category: 'Education',
        fundingGoal: 9000,
        amountRaised: 5600,
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Coding & Design Bootcamps',
        story: 'Host free software development and digital design workshops to help low-income high school graduates enter technology careers.',
        category: 'Education',
        fundingGoal: 12500,
        amountRaised: 8200,
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      // 11. Music & Film
      {
        title: 'Indie Eco-Documentary Production Fund',
        story: 'Complete post-production audio mixing and color grading for a documentary charting local river restoration programs.',
        category: 'Music & Film',
        fundingGoal: 10000,
        amountRaised: 7500,
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Youth Orchestra Instrument Kits',
        story: 'Acquire violins, cellos, and brass horns to supply underfunded community music conservatories for student classes.',
        category: 'Music & Film',
        fundingGoal: 6500,
        amountRaised: 2900,
        imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      // 12. Food & Hunger
      {
        title: 'Shelter Soup Kitchen Renovations',
        story: 'Replace worn prep tables and install high-capacity stoves to feed larger cohorts of homeless individuals daily.',
        category: 'Food & Hunger',
        fundingGoal: 8000,
        amountRaised: 6200,
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Hydroponic Vertical Farm Modules',
        story: 'Assemble water-efficient vertical crop arrays inside city food banks to grow fresh leafy greens throughout the year.',
        category: 'Food & Hunger',
        fundingGoal: 15000,
        amountRaised: 3800,
        imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      // 13. Wildlife
      {
        title: 'Sea Turtle Nesting Shore Patrols',
        story: 'Train volunteers and construct protective cages over sea turtle nests to secure hatchlings from shore predators.',
        category: 'Wildlife',
        fundingGoal: 7500,
        amountRaised: 4900,
        imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Injured Raptor Veterinary Care',
        story: 'Fund medical treatments and large flight rehabilitation enclosures for orphaned or injured forest birds of prey.',
        category: 'Wildlife',
        fundingGoal: 5000,
        amountRaised: 3100,
        imageUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      // 14. Disaster Relief
      {
        title: 'Flood Emergency Action Packs',
        story: 'Assemble first-aid boxes containing solar torches, high-grade water purifiers, and warm blankets for immediate deployment.',
        category: 'Disaster Relief',
        fundingGoal: 20000,
        amountRaised: 11500,
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      },
      {
        title: 'Modular Temporary Emergency Domes',
        story: 'Fabricate lightweight, insulated fiberglass shelters to house families displaced by unexpected earthquakes or slides.',
        category: 'Disaster Relief',
        fundingGoal: 30000,
        amountRaised: 18200,
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
        status: 'approved'
      }
    ];

    const seededCampaignDocs = [];
    for (const c of campaignsData) {
      const camp = new Campaign({
        ...c,
        creatorEmail: creator.email,
        creatorName: creator.name,
        minimumContribution: 50,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        rewardInfo: 'General Supporter - Tagged project updates.'
      });
      await camp.save();
      seededCampaignDocs.push(camp);
    }

    const campaign1 = seededCampaignDocs[8]; // Restoring Comfort for Old Age
    const campaign2 = seededCampaignDocs[22]; // Shelter Soup Kitchen Renovations
    const campaign3 = seededCampaignDocs[9]; // Clean Water Well Installations
    const campaign4 = seededCampaignDocs[7]; // Hillside Soil Erosion Mitigation

    console.log('Seeded Campaigns: 28 items spanning 14 categories.');

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

    const contribution4 = new Contribution({
      campaignId: campaign4._id,
      campaignTitle: campaign4.title,
      contributionAmount: 120,
      supporterEmail: supporter.email,
      supporterName: supporter.name,
      creatorEmail: creator.email,
      creatorName: creator.name,
      status: 'approved'
    });

    const contribution5 = new Contribution({
      campaignId: campaign1._id,
      campaignTitle: campaign1.title,
      contributionAmount: 200,
      supporterEmail: supporter.email,
      supporterName: supporter.name,
      creatorEmail: creator.email,
      creatorName: creator.name,
      status: 'pending'
    });

    await contribution1.save();
    await contribution2.save();
    await contribution3.save();
    await contribution4.save();
    await contribution5.save();
    console.log('Seeded Contributions: 5 items (2 Approved, 2 Pending, 1 Rejected).');

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
