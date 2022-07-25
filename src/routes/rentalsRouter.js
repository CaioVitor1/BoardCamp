import { insertRentals, listRentals, returnRentals, deleteRentals } from '../controllers/rentalsController.js';
import { Router } from 'express';
import { validateDelete, validateFinished, validateInsert } from '../middlewares/validateRentals.js';

const router = Router();

router.get('/rentals', listRentals);
router.post('/rentals', validateInsert, insertRentals);
router.post('/rentals/:id/return', validateFinished, returnRentals);
router.delete('/rentals/:id', validateDelete, deleteRentals)
export default router;