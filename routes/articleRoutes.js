import express from 'express';
import {
  createArticle,
  getAllArticles,
  getSingleArticle,
} from '../controllers/articleController.js';
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authentication.js';
const router = express.Router();

router.post('/', authenticateUser, createArticle);
router.get('/', getAllArticles);
router.get('/:id', getSingleArticle);

export default router;
