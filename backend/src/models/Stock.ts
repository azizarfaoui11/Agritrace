// models/Stock.ts
import { Schema, model, Document } from "mongoose";

export interface IStock extends Document {
  nom: string;
  zone: string;
  dateEntree: Date;
  dateSortie: Date;
  temperature: number;
  produit: Schema.Types.ObjectId;
}

const StockSchema = new Schema<IStock>({
  nom: { type: String, required: true },
  zone: { type: String, required: true },
  dateEntree: { type: Date, required: true },
  dateSortie: { type: Date },
  temperature: { type: Number, required: true },
  produit: { type: Schema.Types.ObjectId, ref: "Produit", required: true },
});

export default model<IStock>("Stock", StockSchema);
