// models/Reclamation.ts
import { Schema, model, Document } from "mongoose";

export interface IReclamation extends Document {
  description: string;
  date: Date;
}

const ReclamationSchema = new Schema<IReclamation>({
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});

export default model<IReclamation>("Reclamation", ReclamationSchema);
