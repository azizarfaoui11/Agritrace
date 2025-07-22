import express from "express";
import {
  createZone,
  getAllZones,
  getZoneById,
  updateZone,
  deleteZone,
} from "../controllers/ZoneController";

const router = express.Router();

router.post("/create", createZone);
router.get("/", getAllZones);
router.get("/:id", getZoneById);
router.put("/update/:id", updateZone);
router.delete("/delete/:id", deleteZone);

export default router;
