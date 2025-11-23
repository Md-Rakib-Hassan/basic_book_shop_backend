import { Schema, model } from "mongoose";

const secretPinSchema = new Schema({
  requestId: { type: Schema.Types.ObjectId, ref: "Request", required: true },
  pin: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "10m" } // auto delete after 10 minutes
});

export const SecretPin = model("SecretPin", secretPinSchema);
