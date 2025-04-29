import express from 'express'
import {
    createPlan,getAllPlans,updatePlan,deletePlan
}  from '../utils/planUtil.js';

const router = express.Router();

// Input validation middleware
const validateUserInput = (req, res, next) => {
    const { name, price, duration } = req.body;
    
    if (!name || !price === undefined || !duration === undefined) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, price, and duration are required' 
      });
    }
    next();
  };

  // Create a new plan
  router.post('/create', validateUserInput, async (req, res) => {
    const result = await createPlan(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  });

   // Get all plans
 router.get('/get/all', async (req, res) => {
    const result = await getAllPlans();
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    res.json(result);
  });

//update a plan
router.put('/update/:id', async (req, res) => {
    const result = await updatePlan(req.params.id, req.body);
    if (!result.success) {
      return res.status(result.error === 'Plan not found' ? 404 : 400).json(result);
    }
    res.json(result);
  });

  //delete a plan
  router.delete('/delete/:id', async (req, res) => {
    const result = await deletePlan(req.params.id);
    if (!result.success) {
      return res.status(result.error === 'Plan not found' ? 404 : 500).json(result);
    }
    res.json(result);
  });
 

export default router;