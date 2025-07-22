import { Request, Response } from 'express';
import { User } from '../models/user';
import mongoose from 'mongoose';
import {Lot} from '../models/Lot';
import { Parcel}  from '../models/Parcels';
import Order from '../models/Order';
import Produit from '../models/Produit';
import Feedback from '../models/Feedback';
import Reclamation from '../models/Reclamation';
import Culture from '../models/Culture';
import Stock from '../models/Stock';
import { Variety } from '../models/Variety';
import bcrypt from 'bcryptjs';






export const getAllUsers = async (req: Request, res: Response) => {
    try {
      // Récupérer tous les utilisateurs de la base de données
      const users = await User.find().select('-password'); // Exclure le mot de passe
      res.json(users); // Retourner la liste des utilisateurs
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };


  // Route : /api/users/role/:role
export const getUsersByRoleParam = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;

    const users = await User.find({ role }).select('-password');

    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs par rôle:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



  
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      // Vérifier si l'ID est un ObjectId valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
      }
  
      const user = await User.findById(id);
  
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }
  
      await user.deleteOne();
      
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom, email, password, role , telephone } = req.body;

    if (!nom || !email || !password || !role) {
      res.status(400).json({ message: 'Champs requis manquants' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Email déjà utilisé' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nom,
      email,
      password: hashedPassword,
      role,
      telephone,
      etat:'inactif'
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};  




  export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const updates = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }
  
      Object.keys(updates).forEach((key) => {
        (user as any)[key] = updates[key];
      });
  
      await user.save();
      res.json(user);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  // controllers/statisticsController.ts
export const getAdminStatistics = async (req: Request, res: Response) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalStocks,
      totalFeedbacks,
      totalParcels,
      totalCultures,
      totalVarietes,
      totalReclamations,
    ] = await Promise.all([
       Order.countDocuments(),
      Produit.countDocuments(),
      Stock.countDocuments(),
      Feedback.countDocuments(),
      Parcel.countDocuments(),
      Culture.countDocuments(),
      Variety.countDocuments(),
      Reclamation.countDocuments(),
    ]);

    res.json({
      totalOrders,
      totalProducts,
      totalStocks,
      totalFeedbacks,
      totalParcels,
      totalCultures,
      totalVarietes,
      totalReclamations,
    });
  } catch (error) {
    console.error('Erreur stats admin :', error);
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques.' });
  }
};



function getMonthName(monthNum: number) {
  const months = [
    "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  return months[monthNum];
}


export const getMonthlyStats = async (req: Request, res: Response) => {
  try {
    const entities = [
      { model: Stock, key: 'stocks' },
      { model: Parcel, key: 'parcels' },
      { model: User, key: 'farmers', match: { role: 'farmer' } },
      { model: Order, key: 'orders' },
      { model: Produit, key: 'products' },
      { model: Feedback, key: 'feedbacks' },
      { model: Reclamation, key: 'reclamations' },
      { model: Culture, key: 'cultures' },
    ];

    const results = await Promise.all(
      entities.map(({ model, key, match }) =>
        model.aggregate([
          { $match: match || {} },
          {
            $group: {
              _id: { $month: "$createdAt" },
              total: { $sum: 1 }
            }
          },
          { $sort: { "_id": 1 } }
        ]).then(data =>
          data.map(d => ({ month: getMonthName(d._id), [key]: d.total }))
        )
      )
    );


    // Fusionner les résultats mois par mois
    const monthMap: { [month: string]: any } = {};
    for (const entityData of results) {
      for (const entry of entityData) {
        const month = entry.month;
        if (!monthMap[month]) {
          monthMap[month] = { month };
        }
        Object.assign(monthMap[month], entry);
      }
    }

    const stats = Object.values(monthMap);

    res.json({ stats });
  } catch (err) {
    console.error('Erreur stats mensuelles :', err);
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques mensuelles.' });
  }
};


  
  
  
