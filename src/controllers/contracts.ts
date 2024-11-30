import { NextFunction, Request, Response } from "express";
import { Contracts } from "../models/contracts";
import { AppErrServer } from "../utils/app-err";

// Helper function to validate object IDs or return an error
import mongoose from "mongoose";

const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

// Create Contracts
export async function CreateContract(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, clientName, content, participants } = req.body;

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
                    createdBy: (req as any).user._id,
                    changeSummary: "Initial Draft",
                },
            ],
            participants,
            createdBy: (req as any).user._id,
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

// Update Contracts
export async function UpdateContract(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { content, changeSummary } = req.body;

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

        // Add a new version
        contract.versions.push({
            versionNumber: contract.currentVersion + 1,
            content,
            createdBy: (req as any).user._id,
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

        const contract = await Contracts.findByIdAndDelete(id);

        if (!contract) {
            return res.status(404).json({
                status: "fail",
                message: "Contracts not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Contracts deleted successfully",
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}