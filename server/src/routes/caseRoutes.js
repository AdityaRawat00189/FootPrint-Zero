import express from 'express';
import {
  startCase,
  getApprovalQueue,
  handleApprovalAction,
  getCaseById,
  getUserCases,
  triggerCaseFollowup,
} from '../controllers/caseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/start', startCase);
router.get('/approvals', getApprovalQueue);
router.post('/:id/action', handleApprovalAction);
router.get('/:id', getCaseById);
router.get('/', getUserCases);
router.post('/:id/followup', triggerCaseFollowup);

export default router;
