// models/Transporter.ts
import  { IUser , User } from './user';
import mongoose from 'mongoose';

export interface ITransporter extends IUser {
  vehicleId: string;
}

const Transporter = User.discriminator<ITransporter>('Transporter', new mongoose.Schema({
  vehicleId: { type: String, required: true },
}));

export default Transporter;
