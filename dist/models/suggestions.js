"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Suggestions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SuggestionSchema = new mongoose_1.default.Schema({
    contractId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Contract', required: true },
    suggestedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true }, // Suggested text
    suggestionType: {
        type: String,
        enum: ['Addition', 'Modification', 'Deletion'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    createdAt: { type: Date, default: Date.now },
});
exports.Suggestions = mongoose_1.default.model('Suggestion', SuggestionSchema);
