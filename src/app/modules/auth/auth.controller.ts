import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    sendResponse(res, {
        success: true,
        message: 'Login successful',
        statusCode: 200,
        data: {
            token: result
        }
    })
}, 401);

export const AuthController = {
    loginUser
}