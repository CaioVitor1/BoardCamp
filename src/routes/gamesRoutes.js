import { Router } from 'express';
import { listGames, insertGames } from '../controllers/gamesController.js';
import { validateGames } from '../middlewares/validateGames.js';
const router = Router();

router.get('/games', listGames);
router.post('/games',validateGames, insertGames)
export default router;