import { Types } from "mongoose";

export interface IPickupPoint {
    Name: string; 
    UserId: Types.ObjectId;  // Link pickup point to user
    Address: string; 
    Latitude: number; 
    Longitude: number; 
}
