import { NextFunction, Request, Response } from "express";

export function globalErrHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || "Something went wrong";

    res.status(errStatus).json({
        success: false,
        message: errMsg
    });
}