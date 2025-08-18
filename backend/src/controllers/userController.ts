import { Request, Response } from 'express';
import { User } from '../models/user';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const getProfile = async (req: AuthRequest, res: Response):Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
       res.status(404).json({ message: 'Utilisateur non trouvé' });
       return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 

export const backendHealth  = async (req: Request, res: Response):Promise<void> => {
  
    res.status(500).json({ message: 'Erreur serveur' });
  
}; 





