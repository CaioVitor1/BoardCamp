import { insertRentals, listRentals, returnRentals, deleteRentals } from '../controllers/rentalsController.js';
import { Router } from 'express';

const router = Router();

router.get('/rentals', listRentals);
router.post('/rentals', insertRentals);
router.post('/rentals/:id/return', returnRentals);
router.delete('/rentals/:id', deleteRentals)
export default router;