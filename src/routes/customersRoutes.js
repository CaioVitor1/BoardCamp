import { Router } from 'express';
import { listCustomers, insertCustomers, listUnicCustomers, updateCustomers } from '../controllers/customersController.js';
import { validateCustomer, validateUpdate } from '../middlewares/validateCustomers.js';
const router = Router();

router.get('/customers', listCustomers);
router.get('/customers/:id', listUnicCustomers);
router.post('/customers', validateCustomer, insertCustomers);
router.put('/customers/:id', validateUpdate, updateCustomers)
export default router;