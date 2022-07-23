import { insertCategories, listCategories } from '../controllers/categoriesController.js';
import { Router } from 'express';

const router = Router();

router.get('/categories', listCategories);
router.post('/categories', insertCategories)
export default router;