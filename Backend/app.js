import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./src/config/mongo.js";
import videoRoutes from "./src/routes/videoRoutes.js";
import authRoutes from './src/routes/authRoutes.js';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

await connectMongo();


app.use("/api/videos", videoRoutes);
app.use('/api/auth',authRoutes);

app.get("/", (_, res) => res.send("Backend running 🚀"));

export default app;
