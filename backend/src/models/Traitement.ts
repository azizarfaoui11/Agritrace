// models/Traitement.ts
import mongoose, { Schema, model, Document } from "mongoose";

export interface ITraitement extends Document {
  nomPesticide: string;
  quantitePesticide: number;
  waterUsage:number;
  user: mongoose.Types.ObjectId;
  
}

const TraitementSchema = new Schema<ITraitement>({
  nomPesticide: { type: String, required: true },
  quantitePesticide: { type: Number, required: true },
  waterUsage: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default model<ITraitement>("Traitement", TraitementSchema);
