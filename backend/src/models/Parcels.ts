import mongoose, { model, Schema } from "mongoose";

export interface IParcel extends Document {
    nom: string;
    parcelLocation: string;
    area: number;
    culture: mongoose.Types.ObjectId;
    traitement: mongoose.Types.ObjectId;
   // produit: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
  }
  
  const ParcelSchema = new Schema({
    nom: { type: String, required: true },
    parcelLocation: { type: String, required: true },
    area: { type: Number, required: true },
    culture: { type: mongoose.Schema.Types.ObjectId, ref: 'Culture' },
    traitement: { type: mongoose.Schema.Types.ObjectId, ref: 'Traitement' },
    //produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    
  });
  
 // export default mongoose.model<IParcel>('Parcel', ParcelSchema);
  export const  Parcel = model<IParcel>('Parcel', ParcelSchema);


  
  