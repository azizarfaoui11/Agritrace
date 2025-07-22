// models/Feedback.ts
import { Schema, model, Document } from "mongoose";

export interface IFeedback extends Document {
  commentaire: string;
  date: Date;
  note: number;
  produit: Schema.Types.ObjectId;
}

const FeedbackSchema = new Schema<IFeedback>({
  commentaire: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  note: { type: Number, required: true },
  produit: { type: Schema.Types.ObjectId, ref: "Produit", required: true },
});

export default model<IFeedback>("Feedback", FeedbackSchema);
