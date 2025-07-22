import express from "express";
import {
  createCulture,
  getAllCultures,
  getCultureById,
  updateCulture,
  deleteCulture,
  getCultureByUser,
} from "../controllers/cultureController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/create",auth, createCulture);
router.get("/mine",auth,getCultureByUser);
router.get("/", getAllCultures);
router.get("/:id", getCultureById);
router.put("/:id", updateCulture);
router.delete("/:id", deleteCulture);
export default router;
