// models/Expedition.ts
import { Schema, model, Document } from "mongoose";

export interface IExpedition extends Document {
  dateExpedition: Date;
  distance: string;
  typevehicule: string;
  quantite:number;
  order: Schema.Types.ObjectId; // Si lié à un produit
}

const ExpeditionSchema = new Schema<IExpedition>({
  dateExpedition: { type: Date, required: true },
  distance: { type: String, required: true },
  typevehicule: { type: String, required: true },
  quantite: { type: Number, required: true },
  order: { type: Schema.Types.ObjectId, ref: "Order", required: false },
});

export default model<IExpedition>("Expedition", ExpeditionSchema);
