// controllers/CultureController.ts
import { AuthRequest } from "../middleware/auth";
import Culture from "../models/Culture";
import { Request, Response } from "express";




export const createCulture = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nom, variete, datePlantation, dateRecolte, typeIrrigation  } = req.body;

    // Vérifie que l'utilisateur est bien authentifié
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    // Création de la parcelle avec l'utilisateur associé
    const culture = await Culture.create({
      nom,
      variete,
      datePlantation,
      dateRecolte,
      typeIrrigation,
      user: userId, // ← association de la parcelle à l’utilisateur connecté
    });

    res.status(201).json(culture);
  } catch (error) {
    console.error('Erreur lors de la création de la parcelle:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



export const getAllCultures = async (_: Request, res: Response) => {
  try {
    const cultures = await Culture.find()
        .populate({ path: 'variete', select: 'name' });
    res.status(200).json(cultures);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getCultureById = async (req: Request, res: Response): Promise<void> => {
  try {
    const culture = await Culture.findById(req.params.id);
    if (!culture) 
     res.status(404).json({ message: "Culture not found" });
    res.status(200).json(culture);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateCulture = async (req: Request, res: Response) => {
  try {
    const updated = await Culture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteCulture = async (req: Request, res: Response) => {
  try {
    await Culture.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

 export const getCultureByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }
  
      const cul = await Culture.find({ user: userId })
              .populate({ path: 'variete', select: 'name' });
        
  
      res.status(200).json(cul);
    } 
    catch (error) {
      console.error('Erreur lors de la récupération des cultures:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

