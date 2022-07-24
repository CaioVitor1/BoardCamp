import { Router } from 'express';
import { listGames, insertGames } from '../controllers/gamesController.js';
const router = Router();

router.get('/games', listGames);
router.post('/games', insertGames)
export default router;