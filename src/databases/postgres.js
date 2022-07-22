import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;

const connection = new Pool({
  connectionString: process.env.POSTGRESS_DATABASE_URL,
  user: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'boardcamp',
  password: 'teodoro'
});

export default connection;
