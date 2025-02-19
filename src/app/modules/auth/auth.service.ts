import config from "../../config";
import AppError from "../../errors/AppError";
import { UserService } from "../user/user.service";
import { ILoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";

const loginUser = async (payload:ILoginUser) => { 
    const user = await UserService.getSingleUserFromDB(payload.email);
    if(!user){
        throw new AppError(404,'User not found');
    }
    if (user.isBlocked) {
        throw new AppError(401, 'User is blocked');
    }
    if (user.password !== payload.password) {
        throw new AppError(401, 'Invalid credentials');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,    
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