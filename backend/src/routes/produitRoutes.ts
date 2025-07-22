import express from "express";
import {
  createProduit,
  getAllProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  getProduitByUser,
  updateConformite,
  updateCo2emission,
} from "../controllers/produitController";
import { auth } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/create",auth,upload.single('image'), createProduit);
router.get('/mine', auth, getProduitByUser);
router.get("/", getAllProduits);
router.get("/:id", getProduitById);
router.put("/:id", updateProduit);
router.delete("/delete/:id", deleteProduit);
router.put("/:id/conformite", updateConformite);
router.put("/:id/carbone",updateCo2emission);


export default router;
