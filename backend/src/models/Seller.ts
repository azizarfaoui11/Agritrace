import { IUser, User } from './user';
import mongoose from 'mongoose';

export interface ISeller extends IUser {
  shopName: string;
}

const Seller = User.discriminator<ISeller>(
  'Seller',
  new mongoose.Schema({
    shopName: { type: String, required: true },
  })
);

export default Seller;
