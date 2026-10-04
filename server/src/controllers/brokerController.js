import { Broker } from '../models/Broker.js';

// @desc    Get all verified brokers
// @route   GET /api/brokers
// @access  Private
export const getBrokers = async (req, res) => {
  try {
    const brokers = await Broker.find({ verified: true }).sort({ name: 1 });
    res.json({
      success: true,
      count: brokers.length,
      data: brokers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
