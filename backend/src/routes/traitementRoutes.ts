import express from "express";
import {
  createTraitement,
  getAllTraitements,
  getTraitementById,
  updateTraitement,
  deleteTraitement,
  getTraitementByUser,
} from "../controllers/traitementController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/create",auth, createTraitement);
router.get("/mine",auth,getTraitementByUser);
router.get("/", getAllTraitements);
router.get("/:id", getTraitementById);
router.put("/:id", updateTraitement);
router.delete("/:id", deleteTraitement);

export default router;
