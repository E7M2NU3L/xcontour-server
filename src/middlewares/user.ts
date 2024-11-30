import { NextFunction, Request, Response } from "express";
import { AppErr } from "utils/app-err";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from "models/user";

dotenv.config();

export const AuthMiddleware = async (err : any, req : Request, res : Response, next : NextFunction) => {
    try {
        const token = req?.headers?.authorization?.split(' ')[1];
        if(!token) return next(AppErr('Unauthorized', 401));

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        if(!decoded) return next(AppErr('Unauthorized', 401));

        const user = await UserModel.findById(decoded?._id);
        if(!user) return next(AppErr('Unauthorized', 401));

        (req as any).user = user;
        next();
    } catch (error) {
        next(AppErr('Something went wrong', 500));
    }
}

export const CheckEditor = async (req : Request, res : Response, next : NextFunction) => {
    const user = (req as any).user;
    if(user?.Role !== 'editor') return next(AppErr('Unauthorized', 401));
    next();
};

export const CheckAdmin = async (req : Request, res : Response, next : NextFunction) => {
    const user = (req as any).user;
    if(user?.Role !== 'admin') return next(AppErr('Unauthorized', 401));
    next();
};

export const CheckViewer = async (req : Request, res : Response, next : NextFunction) => {
    const user = (req as any).user;
    if(user?.Role !== 'viewer') return next(AppErr('Unauthorized', 401));
    next();
};
