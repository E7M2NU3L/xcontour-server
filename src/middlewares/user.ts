import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppErr } from "../utils/app-err";
import { UserModel } from "../models/user";

dotenv.config();

export const AuthMiddleware = (err : any, req : any, res : Response, next : NextFunction) => {
    try {
        const token = req.cookies['token'];
        console.log("token: ",token);
        if(!token) return next(AppErr('Unauthorized', 401));

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        if(!decoded) return next(AppErr('Unauthorized', 401));
        console.log(decoded);

        req.user = decoded;
        console.log(req.user);
        next();
    } catch (error) {
        next(AppErr('Something went wrong', 500));
    }
}

export const CheckEditor = (req : Request, res : Response, next : NextFunction) => {
    const user = (req as any).user;
    if(user?.Role !== 'editor') return next(AppErr('Unauthorized', 401));
    next();
};

export const CheckAdmin = (req : Request, res : Response, next : NextFunction) => {
    const user = (req as any).user;
    if(user?.Role !== 'admin') return next(AppErr('Unauthorized', 401));
    next();
};

export const CheckViewer = async (req : Request, res : Response, next : NextFunction) => {
    const user = (req as any).user;
    if(user?.Role !== 'viewer') return next(AppErr('Unauthorized', 401));
    next();
};
