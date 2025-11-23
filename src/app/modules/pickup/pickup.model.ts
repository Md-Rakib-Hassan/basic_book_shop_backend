import { Schema, model, Types } from 'mongoose';
import { IPickupPoint } from './pickup.interface';

const pickupPointSchema = new Schema<IPickupPoint>(
  {
    Name: { type: String, required: true },
    UserId: { type:Schema.Types.ObjectId, ref: 'User', required: true },
    Address: { type: String, required: true },
    Latitude: { type: Number, required: true },
    Longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

const PickupPointModel = model<IPickupPoint>('PickupPoint', pickupPointSchema);

export default PickupPointModel;
