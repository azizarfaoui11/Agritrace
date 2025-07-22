import express from "express";
import {
  createExpedition,
  getAllExpeditions,
  getExpeditionById,
  updateExpedition,
  deleteExpedition,
} from "../controllers/expeditionController";

const router = express.Router();

router.post("/create", createExpedition);
router.get("/all", getAllExpeditions);
router.get("/:id", getExpeditionById);
router.put("/:id", updateExpedition);
router.delete("/:id", deleteExpedition);

export default router;
