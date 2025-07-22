import { RequestHandler } from 'express';
import { AuthRequest } from './auth';

export const authorizeRoles = (...roles: string[]): RequestHandler => {
  return (req: AuthRequest, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Accès interdit: rôle insuffisant' });
      return;
    }
    next();
  };
};
