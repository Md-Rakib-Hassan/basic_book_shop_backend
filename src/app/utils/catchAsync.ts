import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (fn: RequestHandler,errorCode?:number) => {
  return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((err) => {
        if (errorCode) err.statusCode = errorCode;
          return next(err)
      });
  };
};
export default catchAsync;
