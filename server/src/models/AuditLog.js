import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      default: null,
      index: true,
    },
    exposureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exposure',
      default: null,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    actor: {
      type: String,
      enum: [
        'agent:discovery',
        'agent:risk_ranking',
        'agent:legal_drafting',
        'agent:executor',
        'agent:followup',
        'user',
        'system',
      ],
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
