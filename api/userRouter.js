/* 
POST register user
POST Login user
GET retrieve user
PUT update user
*/

import express from "express";

const router = express.Router();

// const { registerUser, authenticateUser, getProfile, updateProfile } = controllers;

// Register User
router.post('/register', registerUser);
router.post('/login', authenticateUser);
router.get('/register', getProfile);
router.put('/profile', updateProfile);

export default router;