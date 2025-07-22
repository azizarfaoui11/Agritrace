import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';


export enum Role {
  FARMER = 'Farmer',
  TRANSPORTER = 'Transporter',
  STOCK_MANAGER = 'StockManager',
  ADMIN = 'Admin',
  VENDEUR='Seller',
  TRANSFORMATEUR='Transformateur'
}

export interface IUser extends Document {
  nom: string;
  email: string;
  password: string;
  role: Role ;
  telephone?: string;
  etat?: 'inactif' | 'actif';

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: { type: String, enum: Object.values(Role), required: true },

  telephone: {
  type: String,
  trim: true,
  // Exemple de validation facultative (format de téléphone international basique)
  match: [/^\+?[0-9]{7,15}$/, 'Numéro de téléphone invalide']
},

  etat: {
    type: String,
    enum: ['inactif', 'actif'],
    default: 'inactif'
  },
  

  
}, {
  timestamps: true
});

// 🔐 Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 🔐 Comparaison des mots de passe
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', userSchema);
