import mongoose from 'mongoose';

const brokerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    domain: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'People Search',
        'Marketing & AdTech',
        'Financial & Credit',
        'B2B & Sales Intelligence',
        'Background Check & Public Records',
        'Health & Lifestyle',
        'General Data Aggregator',
      ],
      default: 'People Search',
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    optOutUrl: {
      type: String,
      default: '',
      trim: true,
    },
    privacyPolicyUrl: {
      type: String,
      default: '',
      trim: true,
    },
    caRegistryId: {
      type: String,
      default: '',
      trim: true,
    },
    privotronId: {
      type: String,
      default: '',
      trim: true,
    },
    removalDifficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    dataTypesCollected: [
      {
        type: String,
        trim: true,
      },
    ],
    jurisdictionsSupported: {
      type: [String],
      default: ['CCPA', 'GDPR'],
    },
    instructions: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    responseSlaDays: {
      type: Number,
      default: 45, // Statutory deadline under CCPA (45 days) / GDPR (30 days)
    },
  },
  {
    timestamps: true,
  }
);

export const Broker = mongoose.model('Broker', brokerSchema);
