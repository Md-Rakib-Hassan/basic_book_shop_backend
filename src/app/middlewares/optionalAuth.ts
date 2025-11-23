import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { UserService } from "../modules/user/user.service";

const optionalAuth = () => {
  return async (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;

        const { Email } = decoded;
        const user = await UserService.getSingleUserFromDBByEmail(Email);

        if (user && !user.isBlocked) {
          decoded._id = user._id;
          req.user = decoded as JwtPayload;
        }
        // if user not found or blocked → just skip (guest)
      } catch {
        // invalid token → ignore (guest)
      }
    }

    // no token or invalid token → req.user stays undefined
    next();
  };
};

export default optionalAuth;
