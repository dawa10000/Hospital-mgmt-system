import express from 'express';
import userRoutes from './routes/userRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { setServers } from "node:dns/promises";
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';

setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

dotenv.config({ quite: true })

app.use(cors({
  credentials: true,
  origin: ['https://hospital-mgmt-system-beryl.vercel.app', 'http://localhost:5173']
}));
app.use(cookieParser())
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }
}));
app.use(express.static('uploads'));

app.get('/', (req, res) => {
  return res.status(200).json({
    message: "Welcome to the backend"
  })
})
app.use('/api/users', userRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/doctor', doctorRoutes);


mongoose.connect(process.env.DB_URL).then((val) => {
  app.listen(5000, () => {
    console.log("DB connected and Server is running on port 5000");
  });
}).catch((err) => {
  console.log("DB connection error:", err)
})


