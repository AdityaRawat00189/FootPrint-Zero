import mongoose from 'mongoose';

const exposureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sourceType: {
      type: String,
      enum: ['broker', 'breach'],
      required: true,
    },
    sourceName: {
      type: String,
      required: true,
      trim: true,
    },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broker',
      default: null,
    },
    exposedDataCategories: [
      {
        type: String,
        trim: true,
      },
    ],
    rawBreachDetails: {
      breachDate: String,
      pwnCount: Number,
      description: String,
      isVerified: Boolean,
      isFabricated: Boolean,
      isSensitive: Boolean,
      dataClasses: [String],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    status: {
      type: String,
      enum: [
        'discovered',
        'drafted',
        'pending_approval',
        'dispatched',
        'opted_out',
        'resolved',
        'ignored',
      ],
      default: 'discovered',
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      default: null,
    },
    discoveredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Exposure = mongoose.model('Exposure', exposureSchema);
