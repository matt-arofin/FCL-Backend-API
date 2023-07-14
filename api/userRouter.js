import controllers from './userHandler.js';
import express from "express";
import { validateToken, errorHandler } from './userMiddleware.js';

const router = express.Router();

const { registerUser, authenticateUser, getProfile, updateProfile } = controllers;

router.post('/register', registerUser);
router.post('/login', authenticateUser);
router.get('/profile/:id', validateToken, getProfile);
router.put('/profile/:id/update', validateToken, updateProfile);
router.use(errorHandler);

export default router;