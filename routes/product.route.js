import express from 'express';
import { testCntr } from '../controllers/product.controller.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/user.middleware.js';
import { createProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', testCntr); // authenticateUser, authorizeAdmin,

router.post('/createProduct', createProduct); // authenticateUser, authorizeAdmin,

export default router;