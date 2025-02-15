"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTemplate = CreateTemplate;
exports.FetchAllTemplates = FetchAllTemplates;
exports.FetchTemplateById = FetchTemplateById;
exports.DeleteTemplate = DeleteTemplate;
exports.FetchAllPublicTemplates = FetchAllPublicTemplates;
exports.UseTemplate = UseTemplate;
const app_err_1 = require("../utils/app-err");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const templates_1 = require("../models/templates");
// Create a new template
async function CreateTemplate(req, res, next) {
    try {
        const { title, content, description, displayContent } = req.body;
        // Ensure required fields are provided
        if (!title || !content) {
            return res.status(400).json({
                status: 'fail',
                message: 'Title and content are required to create a template',
            });
        }
        ;
        // Extract token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        // If no token found, log out gracefully
        if (!token) {
            return res.status(401).json({
                message: "User logged out (no active session).",
            });
        }
        // Verify token
        let decodedToken = null;
        try {
            decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            // Invalid token, clear cookies as a fallback
            res.clearCookie("token");
            return res.status(401).json({
                message: "User logged out (invalid token).",
            });
        }
        const template = new templates_1.Templates({
            title,
            content,
            description,
            createdBy: decodedToken.id,
            displayContent,
            public: false
        });
        const savedTemplate = await template.save();
        return res.status(201).json({
            status: 'success',
            message: 'Template created successfully',
            data: savedTemplate,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
// Fetch all templates
async function FetchAllTemplates(req, res, next) {
    try {
        // Extract token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        // If no token found, log out gracefully
        if (!token) {
            return res.status(401).json({
                message: "User logged out (no active session).",
            });
        }
        // Verify token
        let decodedToken = null;
        try {
            decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            // Invalid token, clear cookies as a fallback
            res.clearCookie("token");
            return res.status(401).json({
                message: "User logged out (invalid token).",
            });
        }
        const templates = await templates_1.Templates.find({
            createdBy: decodedToken.id
        });
        return res.status(200).json({
            status: 'success',
            message: 'Templates fetched successfully',
            data: templates,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
// Fetch a template by its ID
async function FetchTemplateById(req, res, next) {
    try {
        const { id } = req.params;
        const template = await templates_1.Templates.findById(id);
        if (!template) {
            return res.status(404).json({
                status: 'fail',
                message: 'Template not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Template fetched successfully',
            data: template,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
;
async function DeleteTemplate(req, res, next) {
    try {
        // Extract token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        // If no token found, log out gracefully
        if (!token) {
            return res.status(401).json({
                message: "User logged out (no active session).",
            });
        }
        // Verify token
        let decodedToken = null;
        try {
            decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            // Invalid token, clear cookies as a fallback
            res.clearCookie("token");
            return res.status(401).json({
                message: "User logged out (invalid token).",
            });
        }
        ;
        const { id } = req.params;
        const TemplateFound = await templates_1.Templates.findById(id);
        if (!TemplateFound) {
            return res.status(301).json({
                status: "Failed",
                message: "Template does not exists"
            });
        }
        ;
        if (decodedToken?.id !== TemplateFound.createdBy?.toString()) {
            res.status(401).json({
                status: "Failed",
                message: "Permission Denied"
            });
        }
        ;
        await templates_1.Templates.findByIdAndDelete(id);
        return res.status(200).json({
            status: "Success",
            message: "Template has been deleted successfully"
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
;
async function FetchAllPublicTemplates(req, res, next) {
    try {
        const publicTemp = await templates_1.Templates.find({
            public: true
        });
        if (!publicTemp) {
            res.status(201).json({
                message: "None Found, try again"
            });
        }
        ;
        return res.status(201).json({
            status: "Success",
            message: "public templates fetched successfully",
            publicTemp
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
// Use a template (e.g., apply its content to a new contract)
async function UseTemplate(req, res, next) {
    try {
        const { id } = req.params;
        const template = await templates_1.Templates.findById(id);
        if (!template) {
            return res.status(404).json({
                status: 'fail',
                message: 'Template not found',
            });
        }
        // Example logic: Return the content of the template for use
        return res.status(200).json({
            status: 'success',
            message: 'Template used successfully',
            data: {
                content: template.content,
            },
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
