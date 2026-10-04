import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      default: 'CA', // Default jurisdiction reference (e.g., CA for CCPA, or other state / EU for GDPR)
      trim: true,
    },
    country: {
      type: String,
      default: 'US',
      trim: true,
    },
    preferences: {
      autoScanFrequency: {
        type: String,
        enum: ['manual', 'weekly', 'monthly'],
        default: 'weekly',
      },
      requireApprovalForLowRisk: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
    lastScannedAt: {
      type: Date,
      default: null,
    },
    overallRiskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Password comparison helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
