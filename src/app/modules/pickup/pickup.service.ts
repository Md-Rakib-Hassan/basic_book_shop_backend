import AppError from '../../errors/AppError';
import PickupPointModel from './pickup.model';
import { IPickupPoint } from './pickup.interface';
import { Mongoose, Types } from 'mongoose';

const createPickupPoint = async (data: IPickupPoint) => {

  const existing = await PickupPointModel.findOne({ Name: data.Name, UserId: data.UserId });
  if (existing) throw new AppError(400, 'Pickup point already exists for this user');
  const pickup = await PickupPointModel.create(data);
  return pickup;
};

const getAllPickupPointsByUser = async (userId: string) => {
  return PickupPointModel.find({ UserId: userId });
};

const getPickupPointById = async (id:string) => {

  return PickupPointModel.find({UserId:id});
};

const updatePickupPoint = async (id: string, data: Partial<IPickupPoint>) => {

  return PickupPointModel.findByIdAndUpdate(id, data, { new: true });
};

const deletePickupPoint = async (id: string) => {
  return PickupPointModel.findByIdAndDelete(id);
};

export const PickupPointService = {
  createPickupPoint,
  getAllPickupPointsByUser,
  getPickupPointById,
  updatePickupPoint,
  deletePickupPoint,
};
