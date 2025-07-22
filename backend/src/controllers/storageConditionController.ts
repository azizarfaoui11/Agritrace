import { Request, Response } from 'express';
import {StorageCondition} from '../models/StorageCondition';
import {Lot} from '../models/Lot';

export const createStorageCondition = async (req: Request, res: Response) => {
  try {
    const {nom, temperature, humidity, durationDays } = req.body;
    const storage = await StorageCondition.create({nom, temperature, humidity, durationDays });
    res.status(201).json(storage);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
};

export const getAllStorageConditions = async (_req: Request, res: Response) => {
  try {
    const data = await StorageCondition.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération' });
  }
};

export const updateStorageCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const isUsed = await Lot.exists({ storageCondition: id });
    if (isUsed) 
         res.status(400).json({ message: 'Impossible de modifier : utilisé dans un lot' });

    const updated = await StorageCondition.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

export const deleteStorageCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const isUsed = await Lot.exists({ storageCondition: id });
    if (isUsed) 
         res.status(400).json({ message: 'Impossible de supprimer : utilisé dans un lot' });

    await StorageCondition.findByIdAndDelete(id);
    res.json({ message: 'Supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};