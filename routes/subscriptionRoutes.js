import express from 'express'
import {
    createSubscription,
}  from '../utils/subscriptionUtils.js';

const router = express.Router();

// Input validation middleware
const validateUserInput = async(req, res, next) => {
    const { userId, planId } = req.body;
    
    // Validate required fields
    if (!userId || !planId) {
      return res.status(400).json({
        success: false,
        message: "userId and planId are required"
      });
    }
    next();
  };
  // Create a new subscription
  router.post('/create', validateUserInput, async (req, res) => {
    const result = await createSubscription(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  });


export default router;