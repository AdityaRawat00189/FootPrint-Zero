import axios from 'axios';

const AGENT_BASE_URL = process.env.AGENT_SERVICE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: AGENT_BASE_URL,
  timeout: 15000,
});

export const agentServiceClient = {
  // Discovery scan
  scanFootprint: async (userData) => {
    try {
      const response = await client.post('/api/scan', {
        user_id: userData.userId,
        user_name: userData.name,
        user_email: userData.email,
        user_phone: userData.phone || '',
        user_state: userData.state || 'CA',
        user_country: userData.country || 'US',
      });
      return response.data;
    } catch (error) {
      console.warn(`[AgentClient] FastAPI unavailable (${error.message}). Falling back to internal engine.`);
      return null;
    }
  },

  // Start a LangGraph case pipeline run
  startCasePipeline: async (caseData) => {
    try {
      const response = await client.post('/api/pipeline/start-case', {
        case_number: caseData.caseNumber,
        user_id: caseData.userId,
        user_name: caseData.userName,
        user_email: caseData.userEmail,
        user_phone: caseData.userPhone || '',
        user_state: caseData.userState || 'CA',
        broker_id: caseData.brokerId || '',
        broker_name: caseData.brokerName,
        broker_email: caseData.brokerEmail,
        broker_category: caseData.brokerCategory || 'People Search',
        legal_framework: caseData.legalFramework || 'CCPA',
        exposed_data_categories: caseData.exposedCategories || [],
      });
      return response.data;
    } catch (error) {
      console.warn(`[AgentClient] Pipeline start fallback (${error.message})`);
      return null;
    }
  },

  // Resume paused LangGraph thread with human approval
  resumeCasePipeline: async ({ threadId, approved, userEditedBody, rejectionReason }) => {
    try {
      const response = await client.post('/api/pipeline/resume', {
        thread_id: threadId,
        approved,
        user_edited_body: userEditedBody,
        rejection_reason: rejectionReason,
      });
      return response.data;
    } catch (error) {
      console.warn(`[AgentClient] Pipeline resume fallback (${error.message})`);
      return null;
    }
  },

  // Trigger Follow-up agent escalation
  triggerFollowup: async (followupData) => {
    try {
      const response = await client.post('/api/pipeline/followup', followupData);
      return response.data;
    } catch (error) {
      console.warn(`[AgentClient] Followup fallback (${error.message})`);
      return null;
    }
  },
};
