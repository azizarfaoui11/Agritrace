// models/StockManager.ts
import  { IUser, User } from './user';
import mongoose from 'mongoose';

export interface IStockManager extends IUser {
  storageId: string;
}

const StockManager = User.discriminator<IStockManager>('StockManager', new mongoose.Schema({
  storageId: { type: String, required: true },
}));

export default StockManager;
