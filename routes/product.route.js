import express from 'express';
import { testCntr } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', testCntr);

export default router;