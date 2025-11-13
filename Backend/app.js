import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes.js';
import { connectMongo } from './src/config/mongo.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB connection
connectMongo().catch((err) => {
	console.error('Failed to connect to MongoDB', err);
	process.exit(1);
});

app.use('/api/auth', authRoutes);
app.get('/', (_, res) => res.send('Auth backend up 🚀'));

export default app;
