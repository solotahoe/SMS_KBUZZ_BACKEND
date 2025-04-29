import express from 'express'
import {
    createUser,
    getAllUsersWithSubscriptions,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    validateUserInput,
    
}  from '../utils/userUtils.js';

const router = express.Router();

  //login a user 
  router.post("/login", async(req, res)=>{
   const result = await loginUser(req.body)
   if (!result.success) {
    return res.status(400).json(result);
  }

  // Set cookie
  res.cookie("jwt", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  
  res.status(200).json(result);
  })

  // Create a new user
  router.post('/create', validateUserInput, async (req, res) => {
    const result = await createUser(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  });

  // Get all users
 router.get('/get/all', async (req, res) => {
    const result = await getAllUsersWithSubscriptions();
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    res.json(result);
  });

  // Get a single user by ID
  router.get('/:id', async (req, res) => {
    const result = await getUserById(req.params.id);
    
    if (!result.success) {
      return res.status(result.error === 'User not found' ? 404 : 500).json(result);
    }
    
    res.json(result);
  });

  // Update a user
 router.put('/update/:id', async (req, res) => {
    const result = await updateUser(req.params.id, req.body);
    
    if (!result.success) {
      return res.status(result.error === 'User not found' ? 404 : 400).json(result);
    }
    
    res.json(result);
  });
  
  // Delete a user
  router.delete('/delete/:id', async (req, res) => {
    const result = await deleteUser(req.params.id);
    
    if (!result.success) {
      return res.status(result.error === 'User not found' ? 404 : 500).json(result);
    }
    
    res.json(result);
  });

export default router;