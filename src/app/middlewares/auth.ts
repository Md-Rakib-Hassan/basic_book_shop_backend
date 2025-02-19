import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync"
import config from "../config";
import { UserService } from "../modules/user/user.service";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...roles:TUserRole[]) => {
    return catchAsync(async(req, res, next) => {
        const token = (req.headers.authorization)?.replace('Bearer ', '');
        if (!token) {
            throw new AppError(401,'Unauthorized user');
        }
        const decoded = jwt.verify(token, config.jwt_secret as string)as JwtPayload;

        const { role, email } = decoded;

        const user = await UserService.getSingleUserFromDB(email);
        if (!user) {
            throw new AppError(404,'User not found');
        }
        if(user?.isBlocked){
            throw new AppError(401, 'User is blocked');
        }
        if (roles && !roles.includes(role)) {
            throw new AppError(401,'You are not authorized');
        }
        decoded._id=user._id;
        req.user = decoded as JwtPayload;
        next();
    })
}

export default auth;