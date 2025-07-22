// controllers/ReclamationController.ts
import { AuthRequest } from "../middleware/auth";
import Reclamation from "../models/Reclamation";
import { Request, Response } from "express";

export const createReclamation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, date  } = req.body;

    

    // Création de la parcelle avec l'utilisateur associé
    const recl = await Reclamation.create({
      description,
      date,
    });

    res.status(201).json(recl);
  } catch (error) {
    console.error('Erreur lors de la création de la parcelle:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};






export const getAllReclamations = async (_: Request, res: Response) => {
  try {
    const reclamations = await Reclamation.find();
    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getReclamationById = async (req: Request, res: Response) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id).populate("utilisateur");
    if (!reclamation) 
         res.status(404).json({ message: "Reclamation not found" });
    res.status(200).json(reclamation);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateReclamation = async (req: Request, res: Response) => {
  try {
    const updated = await Reclamation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteReclamation = async (req: Request, res: Response) => {
  try {
    await Reclamation.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


export const getReclamationByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }
  
      const rec = await Reclamation.find({ user: userId })
        
  
      res.status(200).json(rec);
    } 
    catch (error) {
      console.error('Erreur lors de la récupération des cultures:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
