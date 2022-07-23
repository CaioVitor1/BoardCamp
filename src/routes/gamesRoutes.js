import { Router } from 'express';
import { listGames } from '../controllers/gamesController.js';
const router = Router();

router.post('/games', listGames);
//router.post('/games', insertGames)
export default router;