import {Variety} from '../models/Variety';
import {Parcel} from '../models/Parcels';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';



export const createVariety = async (req: AuthRequest, res: Response) => {
  try {
    //const data = await Variety.create(req.body);
        const {name, diseaseResistance } = req.body;

      const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }
   // const image = req.file?.filename; // ou path complet si besoin


       // const impact = await Variety.create({nom, waterUsage, co2Emission, user:userId });
           const vari = await Variety.create({name, diseaseResistance, user:userId });
       
    
    res.status(201).json(vari);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
};

export const getAllVarieties = async (_req: Request, res: Response) => {
  try {
    const data = await Variety.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération' });
  }
};

export const updateVariety = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const isUsed = await Parcel.exists({ varieties: id });
    if (isUsed)  
    res.status(400).json({ message: 'Impossible de modifier : utilisé dans une parcelle' });

    const updated = await Variety.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

export const deleteVariety = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const isUsed = await Parcel.exists({ varieties: id });
    if (isUsed)
          res.status(400).json({ message: 'Impossible de supprimer : utilisé dans une parcelle' });

    await Variety.findByIdAndDelete(id);
    res.json({ message: 'Supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};





export const getVarietyByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }
  
      const lots = await Variety.find({ user: userId })
        
  
      res.status(200).json(lots);
    } catch (error) {
      console.error('Erreur lors de la récupération des lots utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

