import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;

const connection = new Pool({
  connectionString: process.env.POSTGRESS_DATABASE_URL,
  user: process.env.POSTGRESS_USER,
  host: process.env.POSTGRESS_HOST,
  port: process.env.POSTGRESS_PORT,
  database: process.env.POSTGRESS_DATABASE,
  password: process.env.POSTGRESS_PASSWORD
});

export default connection;
