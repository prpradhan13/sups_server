import express from 'express';
import { testCntr } from '../controllers/product.controller.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/user.middleware.js';

const router = express.Router();

router.get('/', authenticateUser, authorizeAdmin, testCntr);

export default router;