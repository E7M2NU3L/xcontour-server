import { FetchAppOverview } from '../controllers/overview';
import express, { NextFunction, Request, Response } from 'express';

export const OverviewRouter = express.Router();

OverviewRouter.get("/", async (req : Request, res : Response, next : NextFunction) => 
    {
        try {
            await FetchAppOverview(req, res, next);
        } catch (error) {
            next(error);
        }
    });