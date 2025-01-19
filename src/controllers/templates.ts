import { Request, Response, NextFunction } from "express";
import { AppErrServer } from "../utils/app-err";
import jwt from 'jsonwebtoken';
import { Templates } from "../models/templates";

// Create a new template
export async function CreateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, content, description } = req.body;

        // Ensure required fields are provided
        if (!title || !content) {
            return res.status(400).json({
                status: 'fail',
                message: 'Title and content are required to create a template',
            });
        };

        // Extract token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log(token);
            
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

        const template = new Templates({
            title,
            content,
            description,
            createdBy : decodedToken.id
        });

        const savedTemplate = await template.save();

        return res.status(201).json({
            status: 'success',
            message: 'Template created successfully',
            data: savedTemplate,
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}

// Fetch all templates
export async function FetchAllTemplates(req: Request, res: Response, next: NextFunction) {
    try {
        // Extract token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log(token);
            
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

        const templates = await Templates.find({
            createdBy : decodedToken.id
        });

        return res.status(200).json({
            status: 'success',
            message: 'Templates fetched successfully',
            data: templates,
        });
    } catch (error) {
        next(AppErrServer(error));
    }
}

// Fetch a template by its ID
export async function FetchTemplateById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const template = await Templates.findById(id);

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
    } catch (error) {
        next(AppErrServer(error));
    }
}

// Use a template (e.g., apply its content to a new contract)
export async function UseTemplate(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const template = await Templates.findById(id);

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
    } catch (error) {
        next(AppErrServer(error));
    }
}
