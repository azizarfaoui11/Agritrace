// controllers/zoneController.ts
import { Request, Response } from "express";
import Zone from "../models/Zone";

export const createZone = async (req: Request, res: Response) => {
  try {
    const { name, description, capaciteMax, typeZone } = req.body;
    const zone = new Zone({ name, description, capaciteMax,typeZone });
    await zone.save();
    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({ error });
  }
};


export const getAllZones = async (_req: Request, res: Response) => {
  try {
    const zones = await Zone.find();
    res.status(200).json(zones);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getZoneById = async (req: Request, res: Response) : Promise<void>=> {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) 
         res.status(404).json({ message: "Zone not found" });
    res.status(200).json(zone);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateZone = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedZone = await Zone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedZone) 
         res.status(404).json({ message: "Zone not found" });
    res.status(200).json(updatedZone);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteZone = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedZone = await Zone.findByIdAndDelete(req.params.id);
    if (!deletedZone) 
         res.status(404).json({ message: "Zone not found" });
    res.status(200).json({ message: "Zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
