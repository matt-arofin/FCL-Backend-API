import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoose from 'mongoose';
import userRouter from './api/userRouter.js'
import { jwksMiddleware } from './keyGenerator.js'


// CONFIGURATIONS
dotenv.config();
const server = express();

server.use(express.json());
server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
server.use(cors());
// server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES
server.use('/api', userRouter);
server.use('/jwt/jwks.json', jwksMiddleware);

// DATABASE
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectDB();

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

