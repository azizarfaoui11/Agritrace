// models/Culture.ts
import mongoose, { Schema, model, Document } from "mongoose";

export interface ICulture extends Document {
  nom: string;
  variete: mongoose.Types.ObjectId;
  datePlantation: Date;
  dateRecolte: Date;
  typeIrrigation: string;
  user: Schema.Types.ObjectId;
}

const CultureSchema = new Schema<ICulture>({
  nom: { type: String, required: true },
  variete: { type: mongoose.Schema.Types.ObjectId, ref: 'Variety' },
  datePlantation: { type: Date, required: true },
  dateRecolte: { type: Date, required: true },
  typeIrrigation: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
});

export default model<ICulture>("Culture", CultureSchema);
