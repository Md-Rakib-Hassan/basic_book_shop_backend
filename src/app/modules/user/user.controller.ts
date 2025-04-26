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

const getSingleUserByEmail = catchAsync(async (req, res) => {
    const { email } = req.params;
    const result = await UserService.getSingleUserFromDBByEmail(email);
   
    sendResponse(res, {
        success: true,
        message: 'User found successfully',
        statusCode: 200,
        data: result
    })
    
}
, 400);

export const UserController = {
    createUser,
    getSingleUserByEmail
}