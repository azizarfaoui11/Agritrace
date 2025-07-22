import { Request, Response } from 'express';
import {EnvironmentImpact} from '../models/EnvironmentImpact';
import {Lot} from '../models/Lot'; // Pour vérifier l'utilisation
import { AuthRequest } from '../middleware/auth';

// Créer un nouvel impact environnemental
export const createImpact = async (req: AuthRequest, res: Response) => {
  try {
    const {nom, waterUsage, co2Emission } = req.body;

     const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }
    const impact = await EnvironmentImpact.create({nom, waterUsage, co2Emission, user:userId });
    res.status(201).json(impact);
  } catch (error) {
    console.error('Erreur création:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer tous les impacts
export const getAllImpacts = async (req: Request, res: Response) => {
  try {
    const impacts = await EnvironmentImpact.find();
    res.json(impacts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un impact par ID
export const getImpactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const impact = await EnvironmentImpact.findById(req.params.id);
    if (!impact) 
     res.status(404).json({ message: 'Non trouvé' });
    res.json(impact);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier un impact (si non utilisé)
export const updateImpact = async (req: Request, res: Response):Promise<void> => {
  try {
    const isUsed = await Lot.findOne({ environmentImpact: req.params.id });
    if (isUsed) 
         res.status(400).json({ message: 'Impossible de modifier : utilisé dans un lot.' });

    const updated = await EnvironmentImpact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un impact (si non utilisé)
export const deleteImpact = async (req: Request, res: Response): Promise<void> => {
  try {
    const isUsed = await Lot.findOne({ environmentImpact: req.params.id });
    if (isUsed) 
         res.status(400).json({ message: 'Impossible de supprimer : utilisé dans un lot.' });

    await EnvironmentImpact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

 export const getEnvironmentByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }
  
      const impa = await EnvironmentImpact.find({ user: userId })
        
  
      res.status(200).json(impa);
    } 
    catch (error) {
      console.error('Erreur lors de la récupération des lots utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
