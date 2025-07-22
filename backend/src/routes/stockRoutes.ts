import express from "express";
import {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
  getStocksByZoneName,
} from "../controllers/stockController";

const router = express.Router();

router.post("/create", createStock);
router.get("/", getAllStocks);
router.get("/:id", getStockById);
router.put("/update/:id", updateStock);
router.delete("/delete/:id", deleteStock);
router.get("/zone/:zoneName", getStocksByZoneName);


export default router;
