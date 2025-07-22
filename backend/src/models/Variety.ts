import mongoose, { model, Schema } from "mongoose";

// models/Variety.ts
export interface IVariety extends Document {
    name: string;
    diseaseResistance: string;
    //image: String;
    user: mongoose.Types.ObjectId;
    
  }
  
  const VarietySchema = new Schema({
    name: { type: String, required: true },
    diseaseResistance: { type: String },
    //image: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
  });
  
  export const Variety=  model<IVariety>('Variety', VarietySchema);
  
  