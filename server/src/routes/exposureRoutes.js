import express from 'express';
import { triggerScan, getExposures, getSummary } from '../controllers/exposureController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/scan', triggerScan);
router.get('/', getExposures);
router.get('/summary', getSummary);

export default router;
