import { Schema, model, Document } from "mongoose";

export interface IZone extends Document {
  name: string;
  description?: string;
  capaciteMax?: number;
  typeZone: "refroidissement" | "sec" | "tempéré";
}

const ZoneSchema = new Schema<IZone>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  capaciteMax: { type: Number },
  typeZone: {
    type: String,
    enum: ["refroidissement", "sec", "tempere"],
    required: true,
  },
});

export default model<IZone>("Zone", ZoneSchema);
