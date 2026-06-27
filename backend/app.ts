import { testDbConnection } from "./src/configs/db";
import dotenv from "dotenv";
import express from "express";
import register from "./src/routes/authRoutes";
import { errorHandler } from "./src/middlewares/errorMiddleware";
import cors from "cors";
import categoryRoutes from "./src/routes/categoryRoutes";
import areaRoutes from "./src/routes/areaRoutes";
import transactionRoutes from "./src/routes/transactionRoutes";
import { apiLimiter, authLimiter } from "./src/middlewares/rateLimiter";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:5173", // replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you need cookies
  }),
);
app.use(express.json()); //parse the json body

app.use(apiLimiter);

app.use("/api/auth", authLimiter, register);

app.use("/api/categories", categoryRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/transactions", transactionRoutes);

app.use(errorHandler); //global err handler
const PORT = process.env.PORT || 3001;
async function startServer() {
  await testDbConnection();
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
export default app;
