import express from 'express';
import { showCurrentUser } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authentication.js';

const router = express.Router();

router.get('/showMe', authenticateUser, showCurrentUser);

export default router;
