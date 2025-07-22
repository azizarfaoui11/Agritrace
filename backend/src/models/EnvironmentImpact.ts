import mongoose, { model, Schema } from 'mongoose';

export interface IEnvironmentImpact extends Document {
  nom: string;
  waterUsage: number;
  co2Emission: number;
  user: mongoose.Types.ObjectId;
  
}

const EnvironmentImpactSchema: Schema = new Schema({
  nom: { type: String, required: true },
  waterUsage: { type: Number, required: true },
  co2Emission: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  
});

//export default mongoose.model<IEnvironmentImpact>('EnvironmentImpact', EnvironmentImpactSchema);
export const EnvironmentImpact =  model<IEnvironmentImpact>('EnvironmentImpact', EnvironmentImpactSchema);



