import {Router} from "express";
import * as transactionController from "../controllers/transactionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, transactionController.addTransaction);

export default router;