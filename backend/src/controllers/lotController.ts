import qrcode from 'qrcode'; 
import {Lot} from '../models/Lot'
import { Request, Response } from 'express';
import QRCode, { IQRCode } from '../models/QRCode'
import crypto from 'crypto'; 
import { EnvironmentImpact } from '../models/EnvironmentImpact';
import mongoose from 'mongoose';
import { StorageCondition } from '../models/StorageCondition';
import { TransportCondition } from '../models/TransportCondition';
import { Parcel } from '../models/Parcels';
import { AuthRequest } from '../middleware/auth';
import { Variety } from '../models/Variety';


/*export const createLot = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const hash = crypto
      .createHash('sha256')
      .update(name + Date.now().toString())
      .digest('hex');

    const qrCode = await QRCode.create({
      hash,
      generationDate: new Date(),
    });

    const lot = await Lot.create({
      name,
      qrCode: qrCode._id,
    });

    const qrCodeImage = await qrcode.toDataURL(hash);

    res.status(201).json({
      message: 'Lot created',
      lot,
      qrCodeImage, // image base64 pour affichage dans le frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLotById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lot = await Lot.findById(req.params.id).populate('qrCode');

    if (lot) {
      const qrCode = lot.qrCode as IQRCode;
      const qrCodeImage = await qrcode.toDataURL(qrCode.hash);
      res.status(200).json({ lot, qrCodeImage });
    } else {
      res.status(404).json({ message: 'Lot not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
*/


/*export const createLot = async (req: Request, res: Response) : Promise<void>=> {
  try {
    const {
      name,
      harvestDate,
      producerMethod,
      parcel,
      storageCondition,
      transportCondition,
      environmentImpact, // ID existant
    } = req.body;

    // Vérifier que l’impact environnemental existe
    const envImpactDoc = await EnvironmentImpact.findById(environmentImpact);
    if (!envImpactDoc) {
       res.status(400).json({ message: "EnvironmentImpact not found" });
    }

    // Génération du hash pour garantir intégrité (non affiché)
    const hash = crypto
      .createHash('sha256')
      .update(name + Date.now().toString())
      .digest('hex');

    // Création du document QRCode (enregistré en DB, mais pas affiché dans le QR)
    const qrCode = await QRCode.create({
      hash,
      generationDate: new Date(),
    });

    // Création du lot
    const lot = await Lot.create({
      name,
      harvestDate,
      producerMethod,
      parcel,
      qrCode: qrCode._id,
      storageCondition,
      transportCondition,
      environmentImpact,
    });

    // Construction des données visibles à encoder dans le QR code
    const qrData = {
      name,
      harvestDate,
      producerMethod,
      waterUsage: envImpactDoc!.waterUsage,
      co2Emission: envImpactDoc!.co2Emission,
    };

    // Génération de l’image QR Code avec les données visibles
    const qrCodeImage = await qrcode.toDataURL(JSON.stringify(qrData));

    res.status(201).json({
      message: 'Lot created',
      lot,
      qrCodeImage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 
*/



export const createLot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      harvestDate,
      producerMethod,
      parcel,
      environmentImpact,
      variety,
    } = req.body;

    // Vérifie que l'utilisateur est bien authentifié
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    

    // Génération du QR code
    const hash = crypto.createHash('sha256').update(name + Date.now().toString()).digest('hex');
    const qrCode = await QRCode.create({
      hash,
      generationDate: new Date(),
    });

    // Création du lot avec l'utilisateur associé
    const lot = await Lot.create({
      name,
      harvestDate,
      producerMethod,
      parcel,
      qrCode: qrCode._id,
      environmentImpact,
      variety ,
      user: userId, // ← association du lot à l’utilisateur connecté
    });

    // Données encodées dans le QR Code
    const qrData = {
      name,
      harvestDate,
      producerMethod,
      waterUsage: environmentImpact.waterUsage,
      co2Emission: environmentImpact.co2Emission,
    };

    const qrCodeImage = await qrcode.toDataURL(JSON.stringify(qrData));

    res.status(201).json({
      message: 'Lot créé',
      lot,
      qrCodeImage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: (err as Error).message });
  }
};




export const getLotsByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

   const lots = await Lot.find({ user: userId })
  .populate({ path: 'parcel', select: 'nom' })
  .populate({ path: 'variety', select: 'name image' })
  .populate({ path: 'environmentImpact', select: 'waterUsage co2Emission' });


    res.status(200).json(lots);
  } catch (error) {
    console.error('Erreur lors de la récupération des lots utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



export const getLotById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lot = await Lot.findById(req.params.id)
      .populate('qrCode') 
      .populate('environmentImpact')
      .populate('parcel') 
      .populate('variety') 
      .populate('user')

    if (!lot) {
      res.status(404).json({ message: 'Lot not found' });
      return;
    }

    const envImpact = lot.environmentImpact as {
      waterUsage?: number;
      co2Emission?: number;
      energyUsage?: number;
      pesticides?: string;
    } | null;

    const qrData = {
      name: lot.name,
      harvestDate: lot.harvestDate,
      producerMethod: lot.producerMethod,
      waterUsage: envImpact?.waterUsage ?? 'N/A',
      co2Emission: envImpact?.co2Emission ?? 'N/A',
    };

    const qrCodeImage = await qrcode.toDataURL(JSON.stringify(qrData));

    res.status(200).json({ lot, qrCodeImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Rechercher un lot par son nom (champ "name")
export const getLotByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.params;

    const lot = await Lot.findOne({ name: name.trim() })
      .populate('qrCode') 
      .populate('environmentImpact')
      .populate('user')
      .populate("parcel")
      .populate("variety")

    if (!lot) {
      
      res.status(404).json({ message: "Lot non trouvé." });
      return ;
    }

    // Génère ici le QR code si besoin
    res.status(200).json({ lot });
  } catch (error) {
    console.error("Erreur lors de la recherche par nom :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const getLotByHash = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hash } = req.params;

    const qrCode = await QRCode.findOne({ hash });
    if (!qrCode) {
      res.status(404).json({ message: 'QR Code not found' });
      return;
    }

    const lot = await Lot.findOne({ qrCode: qrCode._id }).populate('qrCode');
    if (!lot) {
      res.status(404).json({ message: 'Lot not found' });
      return;
    }

    res.status(200).json({ lot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllLots = async (req: Request, res: Response) => {
    try {
      // Récupérer tous les utilisateurs de la base de données
      const users = await Lot.find()
      .populate('parcel', 'nom') // récupère uniquement le champ name
  .populate('environmentImpact', 'nom'); 
      res.json(users); 
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  /*export const assignStorageToLot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lotId, storageId } = req.body;

    // Validation des IDs
    if (!mongoose.Types.ObjectId.isValid(lotId)) {
      res.status(400).json({ message: 'ID de lot invalide' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(storageId)) {
      res.status(400).json({ message: 'ID de condition de stockage invalide' });
      return;
    }

    // Recherche du lot
    const lot = await Lot.findById(lotId);
    if (!lot) {
      res.status(404).json({ message: 'Lot non trouvé' });
      return;
    }

    // Vérifie si la condition de stockage existe
    const storageExists = await StorageCondition.exists({ _id: storageId });
    if (!storageExists) {
      res.status(404).json({ message: 'Condition de stockage non trouvée' });
      return;
    }

    // Affectation
    lot.storageCondition = new mongoose.Types.ObjectId(storageId);
    await lot.save();

    res.status(200).json({ message: 'Condition de stockage affectée avec succès', lot });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'affectation', error: (error as Error).message });
  }
};

*/
  

export const deleteLot = async (req: Request, res: Response) => {
  try {
    await Lot.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};