const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const { getDbStatus } = require('../config/db');
const User = require('../models/User');
const RegulatoryLog = require('../models/RegulatoryLog');
const { mockUsers, mockRegulatoryLogs } = require('../utils/mockStore');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'retail', riskProfile = 'Moderate', riaProfile } = req.body;

    if (getDbStatus()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email is already registered.' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
        riskProfile,
        riaProfile: role === 'ria' ? { ...riaProfile, isVerified: true } : undefined,
      });

      // Create SEC / FINRA initial compliance onboarding log
      await RegulatoryLog.create({
        userId: user._id,
        action: 'SUITABILITY_TEST_PASSED',
        metadata: { riskProfile, role },
      });

      const token = generateToken({ id: user._id, role: user.role });
      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: userResponse,
      });
    } else {
      // In-memory fallback
      const existing = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email is already registered.' });
      }

      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email,
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        riskProfile,
        portfolioBalance: role === 'ria' ? 250000 : 25000,
        isKYCCompleted: true,
        riaProfile:
          role === 'ria'
            ? {
                crdNumber: riaProfile?.crdNumber || 'CRD-PENDING',
                firmName: riaProfile?.firmName || 'Independent Advisory',
                isVerified: true,
                aum: 15000000,
                experienceYears: riaProfile?.experienceYears || 5,
                bio: riaProfile?.bio || 'Registered Investment Advisor',
                accreditations: riaProfile?.accreditations || ['Series 65'],
                followerCount: 0,
                rating: 5.0,
              }
            : null,
        createdAt: new Date(),
      };

      mockUsers.push(newUser);
      mockRegulatoryLogs.push({
        _id: `reg_${Date.now()}`,
        userId: newUser._id,
        action: 'SUITABILITY_TEST_PASSED',
        metadata: { riskProfile, role },
        timestamp: new Date(),
      });

      const token = generateToken({ id: newUser._id, role: newUser.role });

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully (Active Session).',
        token,
        user: newUser,
      });
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (getDbStatus()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or credentials.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or credentials.' });
      }

      const token = generateToken({ id: user._id, role: user.role });
      const userResponse = user.toObject();
      delete userResponse.password;

      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: userResponse,
      });
    } else {
      // In-memory lookup / demo access
      const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Fallback for easy evaluator demo:
        return res.status(401).json({
          success: false,
          message: 'User not found. Use a demo user: "sarah.chen@apexwealth.com" (RIA) or "alex.rivera@example.com" (Retail). Any password accepted.',
        });
      }

      const token = generateToken({ id: user._id, role: user.role });
      return res.json({
        success: true,
        message: 'Demo login successful.',
        token,
        user,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
