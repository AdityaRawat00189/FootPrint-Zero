import mongoose from 'mongoose';

const agentStepSchema = new mongoose.Schema(
  {
    step: {
      type: String,
      enum: [
        'discovery',
        'risk_ranking',
        'legal_drafting',
        'human_approval',
        'executor',
        'followup',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    agentName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'paused', 'failed'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const correspondenceSchema = new mongoose.Schema(
  {
    direction: {
      type: String,
      enum: ['inbound', 'outbound'],
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    statusExtracted: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const caseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exposureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exposure',
      required: true,
      index: true,
    },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broker',
      default: null,
    },
    caseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    targetEntityName: {
      type: String,
      required: true,
    },
    targetEntityEmail: {
      type: String,
      required: true,
    },
    legalFramework: {
      type: String,
      enum: ['CCPA', 'GDPR', 'VCDPA', 'CPA', 'OTHER'],
      default: 'CCPA',
    },
    status: {
      type: String,
      enum: [
        'discovery',
        'risk_ranked',
        'drafted',
        'pending_approval',
        'approved',
        'dispatched',
        'awaiting_response',
        'escalated',
        'resolved',
        'rejected',
      ],
      default: 'discovery',
      index: true,
    },
    threadId: {
      type: String,
      default: '',
      index: true, // LangGraph thread ID for durable checkpoint persistence
    },
    agentTrail: [agentStepSchema],
    draftedLetter: {
      subject: { type: String, default: '' },
      body: { type: String, default: '' },
      userEditedBody: { type: String, default: '' },
      legalClausesUsed: [String],
      generatedByModel: { type: String, default: '' },
      draftedAt: { type: Date, default: null },
      approvedAt: { type: Date, default: null },
      rejectionReason: { type: String, default: '' },
    },
    dispatchMetadata: {
      sentAt: { type: Date, default: null },
      messageId: { type: String, default: '' },
      recipientEmail: { type: String, default: '' },
      transport: { type: String, default: 'nodemailer-smtp' },
    },
    responseDeadline: {
      type: Date,
      default: null,
    },
    correspondence: [correspondenceSchema],
    followupCount: {
      type: Number,
      default: 0,
    },
    lastFollowupAt: {
      type: Date,
      default: null,
    },
    escalationLetter: {
      subject: { type: String, default: '' },
      body: { type: String, default: '' },
      draftedAt: { type: Date, default: null },
      sentAt: { type: Date, default: null },
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Case = mongoose.model('Case', caseSchema);
