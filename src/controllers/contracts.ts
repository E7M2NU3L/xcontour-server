import dotenv from 'dotenv';
dotenv.config();

import { NextFunction, Request, Response } from "express";
import { Contracts } from "../models/contracts";
import { AppErrServer } from "../utils/app-err";
import jwt from 'jsonwebtoken'

// Helper function to validate object IDs or return an error
import mongoose from "mongoose";

const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

// Create Contracts
export async function CreateContract(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, clientName, content, participants, status } = req.body;
         // Extract token from cookies or headers
         const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
            
         // If no token found, log out gracefully
         if (!token) {
             return res.status(401).json({
                 message: "User logged out (no active session).",
             });
         }
 
         // Verify token
         let decodedToken : any = null;
         try {
             decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
         } catch (error) {
             // Invalid token, clear cookies as a fallback
             res.clearCookie("token");
             return res.status(401).json({
                 message: "User logged out (invalid token).",
             });
         }

        if (!title || !clientName || !content || !participants) {
            return res.status(400).json({
                status: "fail",
                message: "Missing required fields: title, clientName, content, participants",
            });
        }

        const contract = await Contracts.create({
            title,
            clientName,
            currentVersion: 1,
            versions: [
                {
                    versionNumber: 1,
                    content,
                    createdBy: decodedToken.id,
                    status : status ?? 'Draft',
                    changeSummary: "Initial Draft",
                },
            ],
            participants,
            createdBy: decodedToken.id,
        });

        return res.status(201).json({
            status: "success",
            message: "Contracts created successfully",
            data: contract,
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}

// Fetch All Contracts
export async function FetchAllContracts(req: Request, res: Response, next: NextFunction) {
    try {
        const contracts = await Contracts.find().populate("participants").populate("createdBy");
        return res.status(200).json({
            status: "success",
            message: "Contracts fetched successfully",
            data: contracts,
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}

// Fetch Contracts By ID
export async function FetchContractById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        console.log(id, " is the id")

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid contract ID",
            });
        }

        const contract = await Contracts.findById(id).populate("participants").populate("createdBy");

        if (!contract) {
            return res.status(404).json({
                status: "fail",
                message: "Contracts not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Contracts fetched successfully",
            data: contract,
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}

export async function updateVersion(req : Request, res : Response, next : NextFunction) {
    try {
        const { id } = req.params;
        const { status, versionNumber } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid contract ID",
            });
        }

        const contract = await Contracts.findById(id);

        if (!contract) {
            return res.status(404).json({
                status: "fail",
                message: "Contracts not found",
            });
        }

         // Find the version to update by versionNumber
         const versionToUpdate = contract.versions.find(v => v.versionNumber === versionNumber);
        
         if (!versionToUpdate) {
            return res.status(401).json({
                message : "Version not Found",
                status : "Failed",
            })
        };

        versionToUpdate.status = status ?? versionToUpdate.status;
        
        await contract.save();

        return res.json({
            status : "Success",
            contract,
            message: "Status updated successfully",
        })
    } catch (error) {
        next(AppErrServer(error));
    }
}

// Update Contracts
export async function UpdateContract(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const {title, clientName, content, changeSummary, status, versionNumber } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid contract ID",
            });
        }

        const contract = await Contracts.findById(id);

        if (!contract) {
            return res.status(404).json({
                status: "fail",
                message: "Contracts not found",
            });
        }

         // Find the version to update by versionNumber
         const versionToUpdate = contract.versions.find(v => v.versionNumber === versionNumber);
            if (!title || !clientName || !content) {
                if (versionToUpdate) {
                    versionToUpdate.status = status ?? versionToUpdate.status;
                    versionToUpdate.versionNumber  = versionToUpdate.versionNumber + 1
                }

                return res.json({
                    status : "Success",
                    contract,
                    message: "Status updated successfully",
                })
            }
        
        contract.title = title;
        contract.clientName = clientName;

        // Add a new version
        contract.versions.push({
            versionNumber: contract.currentVersion + 1,
            content,
            changeSummary,
        });

        contract.currentVersion += 1;
        await contract.save();

        return res.status(200).json({
            status: "success",
            message: "Contracts updated successfully",
            data: contract,
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}

// Delete Contracts
export async function DeleteContract(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid contract ID",
            });
        }

        await Contracts.findByIdAndDelete(id);

        return res.status(200).json({
            status: "success",
            message: "Contracts deleted successfully",
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}