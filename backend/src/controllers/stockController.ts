// controllers/StockController.ts
import Produit from "../models/Produit";
import Stock from "../models/Stock";
import { Request, Response } from "express";

export const createStock = async (req: Request, res: Response) => {
  try {
    const newStock = await Stock.create(req.body);
    res.status(201).json(newStock);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getAllStocks = async (_: Request, res: Response) => {
  try {
    const stocks = await Stock.find()
    .populate('produit');
   // .populate("variete");
    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getStockById = async (req: Request, res: Response) => {
  try {
    const stock = await Stock.findById(req.params.id);
    //.populate("variete");
    if (!stock) 
         res.status(404).json({ message: "Stock not found" });
    res.status(200).json(stock);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteStock = async (req: Request, res: Response) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const changeStockZone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newZone } = req.body;

    const stock = await Stock.findByIdAndUpdate(id, { zone: newZone }, { new: true });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json(stock);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getStocksByZoneName = async (req: Request, res: Response) => {
  try {
    const zoneName = req.params.zoneName; // exemple : "zone A"

    const stocks = await Stock.find({ zone: zoneName }).populate("produit");

    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


/*export const toggleEtatProduit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const produit = await Produit.findById(id);

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    produit.etat=
    await produit.save();

    res.status(200).json(produit);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
*/