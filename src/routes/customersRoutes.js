import { Router } from 'express';
import { listCustomers, insertCustomers, listUnicCustomers, updateCustomers } from '../controllers/customersController.js';
const router = Router();

router.get('/customers', listCustomers);
router.get('/customers/:id', listUnicCustomers);
router.post('/customers', insertCustomers);
router.put('/customers/:id', updateCustomers)
export default router;