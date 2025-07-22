// controllers/ExpeditionController.ts
import Expedition from "../models/Expedition";
import { Request, Response } from "express";

export const createExpedition = async (req: Request, res: Response) => {
  try {
    const expedition = await Expedition.create(req.body);
    res.status(201).json(expedition);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getAllExpeditions = async (_: Request, res: Response) => {
  try {
    const expeditions = await Expedition.find();
    //.populate("produit");
    res.status(200).json(expeditions);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getExpeditionById = async (req: Request, res: Response) => {
  try {
    const expedition = await Expedition.findById(req.params.id);
   // .populate("produit");
    if (!expedition) 
         res.status(404).json({ message: "Expedition not found" });
    res.status(200).json(expedition);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateExpedition = async (req: Request, res: Response) => {
  try {
    const updated = await Expedition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteExpedition = async (req: Request, res: Response) => {
  try {
    await Expedition.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
