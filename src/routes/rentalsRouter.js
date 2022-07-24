import { insertRentals, listRentals } from '../controllers/rentalsController.js';
import { Router } from 'express';

const router = Router();

router.get('/rentals', listRentals);
router.post('/rentals', insertRentals)
export default router;