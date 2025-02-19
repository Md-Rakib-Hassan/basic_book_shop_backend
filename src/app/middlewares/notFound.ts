/* eslint-disable no-unused-vars */
import { RequestHandler } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFound: RequestHandler = (req, res, next) => { 
    res.status(404).send({
        success: false,
        message:"API not found !!",
        statusCode: 404,
        error: {},
        stack:''

    })
}
export default notFound;