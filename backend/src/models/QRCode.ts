import mongoose, { Document, Schema } from 'mongoose';

export interface IQRCode extends Document {
  hash: string;
  generationDate: Date;
}

const QRCodeSchema: Schema = new Schema({
  hash: { type: String, required: true },
  generationDate: { type: Date, required: true },
});

export default mongoose.model<IQRCode>('QRCode', QRCodeSchema);
