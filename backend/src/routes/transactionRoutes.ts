import {Router} from "express";
import * as transactionController from "../controllers/transactionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, transactionController.addTransaction);
router.get("/", authMiddleware, transactionController.getAllTransactions);
router.put("/:id", authMiddleware, transactionController.updateTransaction);
router.delete("/:id", authMiddleware, transactionController.deleteTransaction);

export default router;