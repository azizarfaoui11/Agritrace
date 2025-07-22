// controllers/TraitementController.ts
import { AuthRequest } from "../middleware/auth";
import Traitement from "../models/Traitement";
import { Request, Response } from "express";




export const createTraitement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nomPesticide, quantitePesticide, waterUsage  } = req.body;

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    const trait = await Traitement.create({
      nomPesticide,
      quantitePesticide,
      waterUsage,
      user: userId, // ← association de la parcelle à l’utilisateur connecté
    });

    res.status(201).json(trait);
  } catch (error) {
    console.error('Erreur lors de la création de traitement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



export const getAllTraitements = async (_: Request, res: Response) => {
  try {
    const traitements = await Traitement.find();
    res.status(200).json(traitements);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getTraitementById = async (req: Request, res: Response) => {
  try {
    const traitement = await Traitement.findById(req.params.id);
    if (!traitement) 
         res.status(404).json({ message: "Traitement not found" });
    res.status(200).json(traitement);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateTraitement = async (req: Request, res: Response) => {
  try {
    const updated = await Traitement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteTraitement = async (req: Request, res: Response) => {
  try {
    await Traitement.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

 export const getTraitementByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }
  
      const trait = await Traitement.find({ user: userId })
        
  
      res.status(200).json(trait);
    } 
    catch (error) {
      console.error('Erreur lors de la récupération des traitments:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };