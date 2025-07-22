import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController";

const router = express.Router();

router.post("/create", createFeedback);
router.get("/all", getAllFeedbacks);
router.get("/:id", getFeedbackById);
router.put("/:id", updateFeedback);
router.delete("/delete/:id", deleteFeedback);

export default router;
