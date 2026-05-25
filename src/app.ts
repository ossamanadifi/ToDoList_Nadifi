import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './db/db.ts';
import cookieParser from 'cookie-parser';

//definizione delle variabili di processo
config();
//start db
connectDB();

//definizione delle route
import taskRouter from "./routes/taskRoutes.ts"
import authRouter from "./routes/authRoutes.ts"
import userRouter from "./routes/userRoutes.ts"

//creazione app
const app = express();

//implementazione di metodi/servizi
app.use(cookieParser());
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

//implementazione route
app.use("/auth", authRouter)
app.use("/tasks", taskRouter)
app.use("/account", userRouter)


export { app } ;