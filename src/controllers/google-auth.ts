import dotenv from 'dotenv';
dotenv.config();

import { NextFunction, Request, Response } from "express";
import passport from "passport";

// Initiates the Google Login flow
export const InitGoogle = async (req : Request, res : Response) => {
    passport.authenticate('google', { scope : ['profile', 'email'] });
}

// Callback URL for handling the Google Login response
export const CallbackGoogle = async (req : Request, res : Response, next : NextFunction) => {
    passport.authenticate( 'google', {
        successRedirect: process.env.CLIENT_ENDPOINT,
        failureRedirect: '/login/failed'
})
};

export const LoginFailedController = async (req : Request, res : Response, next : NextFunction) => {
    res.status(401).json({
        error : true,
        message : "Login wth google has been failed"
    })
};

export const LoginSuccessFailure = async (req : Request, res : Response, next : NextFunction) => {
    if (req.user) {
        res.status(200).json({
            error : false,
            message : "successfully Logged in",
            user : req.user
        })
    }
    else{
        res.status(403).json({
            error : true,
            message : "Unauthorized"
        })
    }
}