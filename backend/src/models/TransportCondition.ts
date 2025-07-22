import mongoose, { Document, model, Schema } from 'mongoose';

export enum TransportType {
  REFRIGERATED = 'Refrigerated',
  AMBIENT = 'Ambient',
  CONTROLLED_ATMOSPHERE = 'Controlled_Atmosphere',
}

export interface ITransportCondition extends Document {
  nom: string;
  temperatureLog: number;
  transportType: TransportType;
  humidityLog: number;
}

const TransportConditionSchema: Schema = new Schema({
  nom: { type: String, required: true },
  temperatureLog: { type: Number, required: true },
  transportType: { type: String, enum: Object.values(TransportType), required: true },
  humidityLog: { type: Number, required: true },
});


export const TransportCondition = model<ITransportCondition>('TransportCondition', TransportConditionSchema);




