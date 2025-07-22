import mongoose from 'mongoose';
import  { IUser, User } from './user';

export interface ITransformateur extends IUser {
  certification: string;
}

const Transformateur = User.discriminator<ITransformateur>('Transformateur', new mongoose.Schema({
  certification: { type: String, required: true },
}));

export default Transformateur;
