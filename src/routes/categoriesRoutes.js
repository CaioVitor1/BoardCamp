import { insertCategories, listCategories } from '../controllers/categoriesController.js';
import { Router } from 'express';
import { validateCategories } from '../middlewares/validateCategories.js';

const router = Router();

router.get('/categories', listCategories);
router.post('/categories', validateCategories, insertCategories)
export default router;