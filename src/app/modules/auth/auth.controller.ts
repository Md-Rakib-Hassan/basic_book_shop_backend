import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,

    })
    sendResponse(res, {
        success: true,
        message: 'Login successful',
        statusCode: 200,
        data: {
            token: accessToken
        }
    })
}, 401);

export const AuthController = {
    loginUser
}