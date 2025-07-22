import mongoose, { Document, model, Schema } from 'mongoose';

export interface IStorageCondition extends Document {
  nom : string;
  temperature: number;
  humidity: number;
  durationDays: number;
}

const StorageConditionSchema: Schema = new Schema({
  nom: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  durationDays: { type: Number, required: true },
});

export const  StorageCondition = model<IStorageCondition>('StorageCondition', StorageConditionSchema);

  

