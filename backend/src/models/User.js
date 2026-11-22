const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['retail', 'ria', 'compliance_officer', 'admin'],
      default: 'retail',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    riskProfile: {
      type: String,
      enum: ['Conservative', 'Moderate', 'Aggressive'],
      default: 'Moderate',
    },
    portfolioBalance: {
      type: Number,
      default: 25000,
    },
    isKYCCompleted: {
      type: Boolean,
      default: true,
    },
    // Specific fields for Registered Investment Advisors (RIAs)
    riaProfile: {
      crdNumber: {
        type: String,
        trim: true,
      },
      firmName: {
        type: String,
        trim: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      aum: {
        type: Number, // Assets under management in USD
        default: 0,
      },
      experienceYears: {
        type: Number,
        default: 0,
      },
      bio: {
        type: String,
        default: '',
      },
      accreditations: {
        type: [String],
        default: [],
      },
      followerCount: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 4.8,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
