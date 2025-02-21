import config from "../../config";
import AppError from "../../errors/AppError";
import { UserService } from "../user/user.service";
import { ILoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";

const loginUser = async (payload:ILoginUser) => { 
    const user = await UserService.getSingleUserFromDB(payload.Email);
    if(!user){
        throw new AppError(404,'User not found');
    }
    if (user.isBlocked) {
        throw new AppError(401, 'User is blocked');
    }
    if (user.Password !== payload.Password) {
        throw new AppError(401, 'Invalid credentials');
    }
    const jwtPayload = {
        Email: user.Email,
        Role: user.UserType,    
    }

    const accessToken = createToken(
        jwtPayload,
        config.jwt_secret as string,
        config.jwt_expiration as string,
    )
    return accessToken;
}

export const AuthServices = {
    loginUser,
}