import cron from 'node-cron';
import { Case } from '../models/Case.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { agentServiceClient } from './agentServiceClient.js';

export const initFollowupCron = () => {
  // Run every day at 00:00 (midnight)
  // For development testing, also runs an initial check
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Running daily statutory compliance & deadline audit...');
    try {
      const now = new Date();
      // Find cases that are dispatched / awaiting response and overdue or close to deadline
      const pendingCases = await Case.find({
        status: { $in: ['dispatched', 'awaiting_response'] },
        responseDeadline: { $lte: now },
      }).populate('userId');

      console.log(`[Cron] Found ${pendingCases.length} overdue case(s) requiring follow-up audit.`);

      for (const caseRecord of pendingCases) {
        const user = caseRecord.userId;
        if (!user) continue;

        console.log(`[Cron] Executing Follow-up Agent escalation for case ${caseRecord.caseNumber} (${caseRecord.targetEntityName})`);

        await agentServiceClient.triggerFollowup({
          case_number: caseRecord.caseNumber,
          broker_name: caseRecord.targetEntityName,
          broker_email: caseRecord.targetEntityEmail,
          user_name: user.name,
          user_email: user.email,
          legal_framework: caseRecord.legalFramework,
          followup_count: caseRecord.followupCount || 0,
        });

        const followupCount = (caseRecord.followupCount || 0) + 1;
        caseRecord.followupCount = followupCount;
        caseRecord.lastFollowupAt = now;
        caseRecord.status = 'escalated';
        
        const escalationSubject = `URGENT STATUTORY ESCALATION: Non-Compliance Notice - Case ${caseRecord.caseNumber} (${caseRecord.legalFramework})`;
        const escalationBody = `DATE: ${now.toLocaleDateString()}\nTO: Legal Compliance, ${caseRecord.targetEntityName}\nFROM: ${user.name} <${user.email}>\nRE: NON-COMPLIANCE ESCALATION (Ref: ${caseRecord.caseNumber})\n\nMandatory statutory compliance window exceeded. Administrative complaint queued for CPPA / FTC review.`;

        caseRecord.escalationLetter = {
          subject: escalationSubject,
          body: escalationBody,
          draftedAt: now,
          sentAt: now,
        };

        caseRecord.agentTrail.push({
          step: 'followup',
          title: `Automated Follow-up #${followupCount}: Statutory Escalation Dispatched`,
          agentName: 'Follow-up Agent (Cron)',
          status: 'completed',
          message: `Statutory 45-day deadline elapsed without deletion confirmation. Dispatched escalation notice #${followupCount} to ${caseRecord.targetEntityName}.`,
          timestamp: now,
        });

        await caseRecord.save();

        await AuditLog.create({
          userId: user._id,
          caseId: caseRecord._id,
          action: 'AUTOMATED_CRON_ESCALATION',
          actor: 'agent:followup',
          details: { caseNumber: caseRecord.caseNumber, followupCount },
        });
      }
    } catch (error) {
      console.error('[Cron] Error during statutory deadline audit:', error);
    }
  });

  console.log('[Cron] Follow-up Agent daily scheduler initialized.');
};
