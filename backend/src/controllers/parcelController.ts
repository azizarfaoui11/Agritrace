import { Request, Response } from 'express';
import { Parcel } from '../models/Parcels';
import mongoose from 'mongoose';
import {Lot} from '../models/Lot';
import { AuthRequest } from '../middleware/auth';

export const getAllParcel = async (req: Request, res: Response) => {
    try {
      const parcels = await Parcel.find();
      res.json(parcels); 
    } catch (error) {
      console.error('Erreur lors de la récupération des parcels:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };


  export const createParcel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nom, parcelLocation, area, culture, produit ,traitement } = req.body;

    // Vérifie que l'utilisateur est bien authentifié
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    // Création de la parcelle avec l'utilisateur associé
    const parcel = await Parcel.create({
      nom,
      parcelLocation,
      area,
      culture,
      produit,
      traitement,
      user: userId, // ← association de la parcelle à l’utilisateur connecté
    });

    res.status(201).json(parcel);
  } catch (error) {
    console.error('Erreur lors de la création de la parcelle:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

  export const getParcelById = async (req: Request, res: Response): Promise<void> => {
    try {
      const parcel = await Parcel.findById(req.params.id)
      .populate({path:'culture' , select: 'nom'})
      .populate({path:'produit', select:'libelle'})
      .populate({path:'traitement', select:'nomPesticide'})
      ;
      if (!parcel) 
      res.status(404).json({ message: 'Parcelle non trouvée' });
      res.status(200).json(parcel);
    } catch (error) {
      console.error('Erreur lors de la récupération de la parcelle:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  export const updateParcel = async (req: Request, res: Response) : Promise<void> => {
    try {
      const parcelId = req.params.id;
      const linkedLots = await Lot.find({ parcel: parcelId });
      if (linkedLots.length > 0) {
         
        res.status(400).json({ message: 'Impossible de modifier cette parcelle car elle est liée à un ou plusieurs lots.' });
      }
  
      const updated = await Parcel.findByIdAndUpdate(parcelId, req.body, { new: true });
      if (!updated)  
      res.status(404).json({ message: 'Parcelle non trouvée' });
      res.status(200).json(updated);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  export const deleteParcel = async (req: Request, res: Response) : Promise<void>=> {
    try {
      const parcelId = req.params.id;
      const linkedLots = await Lot.find({ parcel: parcelId });
      if (linkedLots.length > 0) {
         
        res.status(400).json({ message: 'Impossible de supprimer cette parcelle car elle est liée à un ou plusieurs lots.' });
      }
  
      await Parcel.findByIdAndDelete(parcelId);
      res.status(200).json({ message: 'Parcelle supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  export const getParcelsByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }
  
      const lots = await Parcel.find({ user: userId })
        
  
      res.status(200).json(lots);
    } catch (error) {
      console.error('Erreur lors de la récupération des lots utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
  