import {TransportCondition} from '../models/TransportCondition';
import { Request, Response } from 'express';
import {Lot} from '../models/Lot';



export const createTransportCondition = async (req: Request, res: Response) => {
  try {
      const {nom, temperatureLog, transportType, humidityLog } = req.body;
    const data = await TransportCondition.create({nom,temperatureLog,transportType,humidityLog});
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
};






export const getAllTransportConditions = async (_req: Request, res: Response) => {
  try {
    const data = await TransportCondition.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération' });
  }
};

export const updateTransportCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const isUsed = await Lot.exists({ transportCondition: id });
    if (isUsed) 
         res.status(400).json({ message: 'Impossible de modifier : utilisé dans un lot' });

    const updated = await TransportCondition.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

export const deleteTransportCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const isUsed = await Lot.exists({ transportCondition: id });
    if (isUsed) 
         res.status(400).json({ message: 'Impossible de supprimer : utilisé dans un lot' });

    await TransportCondition.findByIdAndDelete(id);
    res.json({ message: 'Supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};
