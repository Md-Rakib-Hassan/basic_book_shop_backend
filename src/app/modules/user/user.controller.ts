import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service"

const createUser = catchAsync(async (req, res) => {
    
    const result = await UserService.createUserIntoDB(req.body);
    sendResponse(res, {
        success: true,
        message: 'User registered successfully',
        statusCode: 201,
        data: result
    })
    
}, 400);

export const UserController = {
    createUser
}