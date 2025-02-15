"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Templates = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TemplateSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true }, // Contract body or clauses in plain text/HTML
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    public: {
        type: Boolean,
        required: true
    },
    displayContent: {
        type: String,
        default: ''
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.Templates = mongoose_1.default.model('Template', TemplateSchema);
