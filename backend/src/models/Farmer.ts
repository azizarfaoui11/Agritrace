import mongoose from 'mongoose';
import  { IUser, User } from './user';

export interface IFarmer extends IUser {
  certification: string;
}

const Farmer = User.discriminator<IFarmer>('Farmer', new mongoose.Schema({
  certification: { type: String, required: true },
}));

export default Farmer;
