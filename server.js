import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";


// CONFIGURATIONS
dotenv.config();
const server = express();

server.use(express.json());
server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
server.use(cors());
// server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES
// server.use('/api/users', userRouter);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));