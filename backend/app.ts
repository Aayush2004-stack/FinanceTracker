import { testDbConnection } from "./src/configs/db";
import dotenv from "dotenv";
import express from "express";
import register from "./src/routes/authRoutes";
import { errorHandler } from "./src/middlewares/errorMiddleware";
import categoryRoutes from "./src/routes/categoryRoutes";

dotenv.config();

const app = express();
app.use(express.json()); //parse the json body

app.use("/api/auth", register);

app.use("/api/categories", categoryRoutes);

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
