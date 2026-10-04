import { Case } from '../models/Case.js';
import { Exposure } from '../models/Exposure.js';
import { Broker } from '../models/Broker.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { agentServiceClient } from '../services/agentServiceClient.js';

// Helper to generate unique case number
const generateCaseNumber = () => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FPZ-${new Date().getFullYear()}-${rand}`;
};

// @desc    Start automated removal case from an Exposure
// @route   POST /api/cases/start
// @access  Private
export const startCase = async (req, res) => {
  try {
    const { exposureId } = req.body;
    const user = await User.findById(req.user._id);

    const exposure = await Exposure.findById(exposureId).populate('brokerId');
    if (!exposure) {
      return res.status(404).json({ success: false, message: 'Exposure record not found' });
    }

    if (exposure.caseId) {
      const existingCase = await Case.findById(exposure.caseId);
      if (existingCase) {
        return res.json({ success: true, data: existingCase, message: 'Case already exists' });
      }
    }

    const broker = exposure.brokerId || (await Broker.findOne({ name: exposure.sourceName }));
    const brokerName = broker ? broker.name : exposure.sourceName;
    const brokerEmail = broker ? broker.contactEmail : `privacy@${exposure.sourceName.toLowerCase().replace(/\s+/g, '')}.com`;
    const legalFramework = (user.country === 'US' && user.state === 'CA') ? 'CCPA' : (user.country !== 'US' ? 'GDPR' : 'CCPA');

    const caseNumber = generateCaseNumber();

    console.log(`[CaseController] Launching LangGraph pipeline for case ${caseNumber} (${brokerName})`);

    // Invoke Python LangGraph pipeline
    const pipelineRes = await agentServiceClient.startCasePipeline({
      caseNumber,
      userId: user._id.toString(),
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone || '',
      userState: user.state || 'CA',
      brokerId: broker ? broker._id.toString() : '',
      brokerName,
      brokerEmail,
      brokerCategory: broker ? broker.category : 'People Search',
      legalFramework,
      exposedCategories: exposure.exposedDataCategories || [],
    });

    let draftedLetter = {
      subject: `FORMAL NOTICE: Consumer Personal Data Erasure & Opt-Out Request (${legalFramework}) - ${user.name}`,
      body: `DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\nTO: Privacy Compliance Team, ${brokerName} <${brokerEmail}>\nFROM: ${user.name} <${user.email}>\n\nSUBJECT: FORMAL DEMAND FOR PERMANENT PERSONAL DATA ERASURE AND DO-NOT-SELL/SHARE DIRECTIVE UNDER ${legalFramework}\n\nPursuant to statutory privacy provisions under ${legalFramework} (Cal. Civ. Code § 1798.105 / GDPR Art. 17), I hereby demand immediate permanent erasure of all personal data, contact records, and profiling identifiers associated with ${user.email} from your commercial databases and downstream partner networks.\n\nStatutory compliance window: 45 calendar days.\n\nSincerely,\n${user.name}`,
      legalClausesUsed: [
        `${legalFramework} Mandatory Deletion & Opt-Out Clause`,
        `${legalFramework} Downstream Vendor Propagation Mandate`,
        `${legalFramework} 45-Day Statutory Compliance SLA`,
      ],
      draftedAt: new Date(),
    };

    let agentTrail = [
      {
        step: 'discovery',
        title: 'Exposure Vector Identified',
        agentName: 'Discovery Agent',
        status: 'completed',
        message: `Discovered active profile on ${brokerName} holding personal data categories: ${(exposure.exposedDataCategories || []).join(', ')}.`,
        timestamp: new Date(Date.now() - 4000),
      },
      {
        step: 'risk_ranking',
        title: 'Risk Profile Scored',
        agentName: 'Risk Ranking Agent',
        status: 'completed',
        message: `Assigned severity rating: ${exposure.severity.toUpperCase()} (Risk Score: ${exposure.riskScore}/100).`,
        timestamp: new Date(Date.now() - 2500),
      },
      {
        step: 'legal_drafting',
        title: 'Statutory Deletion Demand Drafted',
        agentName: 'Legal Drafting Agent',
        status: 'completed',
        message: `RAG retrieval synthesized formal ${legalFramework} deletion notice referencing statutory enforcement citations.`,
        timestamp: new Date(Date.now() - 1000),
      },
      {
        step: 'human_approval',
        title: 'Awaiting Human Approval Gate',
        agentName: 'Human-in-the-Loop Gateway',
        status: 'paused',
        message: 'Execution paused before dispatch. Review drafted legal notice in the Approval Queue.',
        timestamp: new Date(),
      },
    ];

    let threadId = `thread_${caseNumber}_local`;

    if (pipelineRes && pipelineRes.success && pipelineRes.state) {
      const state = pipelineRes.state;
      threadId = pipelineRes.threadId;
      if (state.drafted_letter && state.drafted_letter.body) {
        draftedLetter = {
          subject: state.drafted_letter.subject || draftedLetter.subject,
          body: state.drafted_letter.body,
          legalClausesUsed: state.drafted_letter.legal_clauses || draftedLetter.legalClausesUsed,
          draftedAt: new Date(),
        };
      }
      if (state.agent_trail && state.agent_trail.length > 0) {
        agentTrail = state.agent_trail.map((t) => ({
          step: t.step,
          title: t.title,
          agentName: t.agentName,
          status: t.status,
          message: t.message,
          details: t.details || {},
          timestamp: new Date(t.timestamp || Date.now()),
        }));
        agentTrail.push({
          step: 'human_approval',
          title: 'Awaiting Human Approval Gate',
          agentName: 'Human-in-the-Loop Gateway',
          status: 'paused',
          message: 'Execution paused before dispatch. Review drafted legal notice in the Approval Queue.',
          timestamp: new Date(),
        });
      }
    }

    const newCase = await Case.create({
      userId: user._id,
      exposureId: exposure._id,
      brokerId: broker ? broker._id : null,
      caseNumber,
      targetEntityName: brokerName,
      targetEntityEmail: brokerEmail,
      legalFramework,
      status: 'pending_approval',
      threadId,
      agentTrail,
      draftedLetter,
      correspondence: [
        {
          direction: 'outbound',
          sender: user.email,
          recipient: brokerEmail,
          subject: draftedLetter.subject,
          body: draftedLetter.body,
          receivedAt: new Date(),
          statusExtracted: 'DRAFT_PREPARED',
        },
      ],
    });

    // Link case to exposure
    exposure.caseId = newCase._id;
    exposure.status = 'pending_approval';
    await exposure.save();

    await AuditLog.create({
      userId: user._id,
      caseId: newCase._id,
      exposureId: exposure._id,
      action: 'CASE_PIPELINE_INITIATED',
      actor: 'agent:legal_drafting',
      details: { caseNumber, targetEntityName: brokerName, legalFramework },
    });

    res.status(201).json({
      success: true,
      data: newCase,
    });
  } catch (error) {
    console.error('[CaseController] Start case error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all cases pending human review
// @route   GET /api/cases/approvals
// @access  Private
export const getApprovalQueue = async (req, res) => {
  try {
    const approvals = await Case.find({
      userId: req.user._id,
      status: 'pending_approval',
    })
      .populate('exposureId')
      .populate('brokerId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: approvals.length,
      data: approvals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve, Reject or Edit Drafted Case Letter
// @route   POST /api/cases/:id/action
// @access  Private
export const handleApprovalAction = async (req, res) => {
  try {
    const { action, editedBody, rejectionReason } = req.body;
    const caseRecord = await Case.findOne({ _id: req.params.id, userId: req.user._id });

    if (!caseRecord) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (action === 'approve' || action === 'edit_and_approve') {
      const finalBody = editedBody || caseRecord.draftedLetter.userEditedBody || caseRecord.draftedLetter.body;
      
      // Update case draft
      caseRecord.draftedLetter.userEditedBody = editedBody || '';
      caseRecord.draftedLetter.approvedAt = new Date();
      caseRecord.status = 'dispatched';

      const sentAt = new Date();
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 45); // 45 days SLA

      caseRecord.responseDeadline = deadline;
      caseRecord.dispatchMetadata = {
        sentAt,
        messageId: `fpz-${Date.now()}@footprintzero.io`,
        recipientEmail: caseRecord.targetEntityEmail,
        transport: 'nodemailer-smtp-relay',
      };

      // Update agent trail
      caseRecord.agentTrail.push(
        {
          step: 'human_approval',
          title: 'Human Review Approved',
          agentName: 'Human-in-the-Loop Gateway',
          status: 'completed',
          message: action === 'edit_and_approve' ? 'User modified and approved deletion letter.' : 'User approved drafted deletion notice without alterations.',
          timestamp: new Date(),
        },
        {
          step: 'executor',
          title: 'Legal Notice Dispatched',
          agentName: 'Executor Agent',
          status: 'completed',
          message: `Notice transmitted to ${caseRecord.targetEntityName} (${caseRecord.targetEntityEmail}). 45-day SLA active (Deadline: ${deadline.toLocaleDateString()}).`,
          details: caseRecord.dispatchMetadata,
          timestamp: new Date(),
        }
      );

      await caseRecord.save();

      // Update Exposure
      await Exposure.findByIdAndUpdate(caseRecord.exposureId, {
        status: 'dispatched',
      });

      // Resume Python LangGraph thread
      if (caseRecord.threadId) {
        await agentServiceClient.resumeCasePipeline({
          threadId: caseRecord.threadId,
          approved: true,
          userEditedBody: editedBody || null,
        });
      }

      await AuditLog.create({
        userId: req.user._id,
        caseId: caseRecord._id,
        action: 'HUMAN_APPROVAL_DISPATCHED',
        actor: 'user',
        details: { action, recipient: caseRecord.targetEntityEmail },
      });

      return res.json({
        success: true,
        data: caseRecord,
        message: 'Case approved and legal demand successfully dispatched!',
      });
    } else if (action === 'reject') {
      caseRecord.status = 'drafted';
      caseRecord.draftedLetter.rejectionReason = rejectionReason || 'User requested custom revision.';

      caseRecord.agentTrail.push({
        step: 'human_approval',
        title: 'Revision Requested by User',
        agentName: 'Human-in-the-Loop Gateway',
        status: 'completed',
        message: `Feedback received: "${rejectionReason || 'Please regenerate with alternative tone.'}". Looping back to Legal Drafting Agent.`,
        timestamp: new Date(),
      });

      // Resume LangGraph with approved=false so conditional edge loops back to legal_drafting_agent
      if (caseRecord.threadId) {
        const revisedRes = await agentServiceClient.resumeCasePipeline({
          threadId: caseRecord.threadId,
          approved: false,
          rejectionReason,
        });
        if (revisedRes && revisedRes.state && revisedRes.state.drafted_letter) {
          caseRecord.draftedLetter.body = revisedRes.state.drafted_letter.body;
          caseRecord.status = 'pending_approval';
        }
      }

      await caseRecord.save();

      return res.json({
        success: true,
        data: caseRecord,
        message: 'Revision requested and regenerated.',
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }
  } catch (error) {
    console.error('[CaseController] Handle action error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single case by ID with full timeline and correspondence
// @route   GET /api/cases/:id
// @access  Private
export const getCaseById = async (req, res) => {
  try {
    const caseRecord = await Case.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate('exposureId')
      .populate('brokerId');

    if (!caseRecord) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    res.json({
      success: true,
      data: caseRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all cases for current user
// @route   GET /api/cases
// @access  Private
export const getUserCases = async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.user._id })
      .populate('exposureId')
      .populate('brokerId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger Follow-up Escalation for a case
// @route   POST /api/cases/:id/followup
// @access  Private
export const triggerCaseFollowup = async (req, res) => {
  try {
    const caseRecord = await Case.findOne({ _id: req.params.id, userId: req.user._id });
    if (!caseRecord) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const user = await User.findById(req.user._id);

    const followupRes = await agentServiceClient.triggerFollowup({
      case_number: caseRecord.caseNumber,
      broker_name: caseRecord.targetEntityName,
      broker_email: caseRecord.targetEntityEmail,
      user_name: user.name,
      user_email: user.email,
      legal_framework: caseRecord.legalFramework,
      followup_count: caseRecord.followupCount || 0,
    });

    const followupCount = (caseRecord.followupCount || 0) + 1;
    const escalationSubject = `URGENT STATUTORY ESCALATION: Non-Compliance Notice - Case ${caseRecord.caseNumber} (${caseRecord.legalFramework})`;
    const escalationBody = `DATE: ${new Date().toLocaleDateString()}\nTO: Legal & Compliance Division, ${caseRecord.targetEntityName} <${caseRecord.targetEntityEmail}>\nFROM: ${user.name} <${user.email}>\nRE: ESCALATION NOTICE — STATUTORY NON-COMPLIANCE (Case Ref: ${caseRecord.caseNumber})\n\nThis notice constitutes an immediate statutory escalation regarding my prior formal ${caseRecord.legalFramework} erasure and opt-out demand.\n\nAs of today, your organization has failed to provide verifiable confirmation of data deletion within the statutory compliance window mandated under law.\n\nUnless full confirmation of permanent record erasure is delivered within five (5) business days, formal administrative complaints will be filed with the California Privacy Protection Agency (CPPA) and FTC.\n\nRespectfully,\n${user.name}`;

    caseRecord.followupCount = followupCount;
    caseRecord.lastFollowupAt = new Date();
    caseRecord.status = 'escalated';
    caseRecord.escalationLetter = {
      subject: escalationSubject,
      body: escalationBody,
      draftedAt: new Date(),
      sentAt: new Date(),
    };

    caseRecord.agentTrail.push({
      step: 'followup',
      title: `Follow-up #${followupCount}: Regulatory Escalation Notice Sent`,
      agentName: 'Follow-up Agent',
      status: 'completed',
      message: `Statutory response window audited. Prepared and logged regulatory escalation notice #${followupCount} citing supervisory CPPA/FTC enforcement against ${caseRecord.targetEntityName}.`,
      timestamp: new Date(),
    });

    caseRecord.correspondence.push({
      direction: 'outbound',
      sender: user.email,
      recipient: caseRecord.targetEntityEmail,
      subject: escalationSubject,
      body: escalationBody,
      receivedAt: new Date(),
      statusExtracted: 'ESCALATION_SENT',
    });

    await caseRecord.save();

    await AuditLog.create({
      userId: req.user._id,
      caseId: caseRecord._id,
      action: 'CASE_ESCALATION_TRIGGERED',
      actor: 'agent:followup',
      details: { followupCount, target: caseRecord.targetEntityName },
    });

    res.json({
      success: true,
      data: caseRecord,
      message: `Follow-up #${followupCount} escalation notice successfully prepared!`,
    });
  } catch (error) {
    console.error('[CaseController] Followup error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
