"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestChange = SuggestChange;
exports.FetchAllSuggestions = FetchAllSuggestions;
exports.ReviewSuggestion = ReviewSuggestion;
const suggestions_1 = require("../models/suggestions");
const app_err_1 = require("../utils/app-err");
const mongoose_1 = __importDefault(require("mongoose"));
const isValidObjectId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
async function SuggestChange(req, res, next) {
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
        const suggestion = await suggestions_1.Suggestions.create({
            contractId,
            suggestedBy: req.user._id,
            comment: content,
            suggestionType,
            status: "Pending",
        });
        return res.status(201).json({
            status: "success",
            message: "Suggestion submitted successfully",
            data: suggestion,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
async function FetchAllSuggestions(req, res, next) {
    try {
        const { contractId } = req.params;
        const suggestions = await suggestions_1.Suggestions.find({
            where: {
                contractId
            }
        });
        return res.status(200).json({
            status: "success",
            message: "Suggestions fetched successfully",
            data: suggestions,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
async function ReviewSuggestion(req, res, next) {
    try {
        const { suggestionId } = req.params;
        const { status, comment } = req.body;
        if (!isValidObjectId(suggestionId)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid suggestion ID",
            });
        }
        const suggestion = await suggestions_1.Suggestions.findById(suggestionId);
        if (!suggestion) {
            return res.status(404).json({
                status: "fail",
                message: "Suggestion not found",
            });
        }
        suggestion.status = status;
        if (comment)
            suggestion.comment = comment;
        await suggestion.save();
        return res.status(200).json({
            status: "success",
            message: "Suggestion reviewed successfully",
            data: suggestion,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
