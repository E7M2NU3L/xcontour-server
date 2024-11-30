import { NextFunction, Request, Response } from "express";
import { Suggestions } from "../models/suggestions";
import { AppErrServer } from "../utils/app-err";
import mongoose from "mongoose";

const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

export async function SuggestChange(req: Request, res: Response, next: NextFunction) {
    try {
        const { contractId, content, suggestionType } = req.body;

        if (!contractId || !content || !suggestionType) {
            return res.status(400).json({
                status: "fail",
                message: "Missing required fields: contractId, content, suggestionType",
            });
        }

        if (!isValidObjectId(contractId)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid contract ID",
            });
        }

        const suggestion = await Suggestions.create({
            contractId,
            suggestedBy: (req as any).user._id,
            comment: content,
            suggestionType,
            status: "Pending",
        });

        return res.status(201).json({
            status: "success",
            message: "Suggestion submitted successfully",
            data: suggestion,
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}

export async function FetchAllSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
        const { contractId } = req.params;
        const suggestions = await Suggestions.find({
            where: {
                contractId
            }
        });

        return res.status(200).json({
            status: "success",
            message: "Suggestions fetched successfully",
            data: suggestions,
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}

export async function ReviewSuggestion(req: Request, res: Response, next: NextFunction) {
    try {
        const { suggestionId } = req.params;
        const { status, comment } = req.body;

        if (!isValidObjectId(suggestionId)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid suggestion ID",
            });
        }

        const suggestion = await Suggestions.findById(suggestionId);

        if (!suggestion) {
            return res.status(404).json({
                status: "fail",
                message: "Suggestion not found",
            });
        }

        suggestion.status = status;
        if (comment) suggestion.comment = comment;
        await suggestion.save();

        return res.status(200).json({
            status: "success",
            message: "Suggestion reviewed successfully",
            data: suggestion,
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}
