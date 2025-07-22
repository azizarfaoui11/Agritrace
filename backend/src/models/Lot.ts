import mongoose, { model, Schema } from "mongoose";
import { IQRCode } from "./QRCode";

export enum ProductionMethod {
    ORGANIC = 'Organic',
    CONVENTIONAL = 'Conventional',
    BIODYNAMIC = 'Biodynamic',
  }
  
  export interface ILot extends Document {
    name: string;
    harvestDate: Date;
    producerMethod: ProductionMethod;
    parcel: mongoose.Types.ObjectId;
    qrCode: mongoose.Types.ObjectId | IQRCode;
    environmentImpact: mongoose.Types.ObjectId;
    variety: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;


    

  }
  
  const LotSchema = new Schema({
    name: { type: 'string', required: true },
    harvestDate: { type: Date },
    //producerMethod: { type: String, enum: Object.values(ProductionMethod), required: true },
    producerMethod: { type: String, enum: Object.values(ProductionMethod) },
    parcel: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel' },
    qrCode: { type: mongoose.Schema.Types.ObjectId, ref: 'QRCode' },
    environmentImpact: { type: mongoose.Schema.Types.ObjectId, ref: 'EnvironmentImpact' },
    variety: { type: mongoose.Schema.Types.ObjectId, ref: 'Variety' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },



  });
  

    export const  Lot = model<ILot>('Lot', LotSchema);
  
  