const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const SocialPost = require('../models/SocialPost');
const CopyTrade = require('../models/CopyTrade');
const RegulatoryLog = require('../models/RegulatoryLog');
const { mockUsers, mockPortfolios, mockSocialPosts, mockCopyTrades, mockRegulatoryLogs } = require('./mockStore');

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thematic_copy_trading';
  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri);
    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Portfolio.deleteMany({}),
      SocialPost.deleteMany({}),
      CopyTrade.deleteMany({}),
      RegulatoryLog.deleteMany({}),
    ]);

    console.log('Inserting seed users...');
    const createdUsers = await User.insertMany(
      mockUsers.map((u) => ({
        ...u,
        _id: new mongoose.Types.ObjectId(),
        password: 'password123', // Will be hashed by User pre-save if saved individually or handled by model
      }))
    );

    console.log('Inserting seed portfolios...');
    const createdPortfolios = await Portfolio.insertMany(
      mockPortfolios.map((p, idx) => ({
        ...p,
        _id: new mongoose.Types.ObjectId(),
        advisor: createdUsers[idx % 2]._id,
      }))
    );

    console.log('Inserting seed social posts...');
    await SocialPost.insertMany(
      mockSocialPosts.map((s, idx) => ({
        ...s,
        _id: new mongoose.Types.ObjectId(),
        author: createdUsers[idx % 2]._id,
        portfolio: createdPortfolios[idx % createdPortfolios.length]._id,
      }))
    );

    console.log('Database successfully seeded with realistic RIA & Thematic portfolios!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;
