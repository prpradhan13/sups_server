import express from 'express';
import { createCategory, getAllCategories } from "../controllers/category.controller.js";

const router = express.Router();

router.get('/', getAllCategories); // authenticateUser, authorizeAdmin,

router.post('/createCategory', createCategory); // authenticateUser, authorizeAdmin,

export default router;