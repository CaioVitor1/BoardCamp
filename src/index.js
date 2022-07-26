import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoriesRoutes from './routes/categoriesRoutes.js'
import gamesRoutes from './routes/gamesRoutes.js'
import customersRoutes from './routes/customersRoutes.js'
import rentalsRoutes from './routes/rentalsRouter.js'
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(categoriesRoutes);
app.use(gamesRoutes);
app.use(customersRoutes);
app.use(rentalsRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));