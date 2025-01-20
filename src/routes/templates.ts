import { CreateTemplate, DeleteTemplate, FetchAllPublicTemplates, FetchAllTemplates, FetchTemplateById, UseTemplate } from "../controllers/templates";
import { Router } from "express";

const TemplateRouter = Router();

// Routes
TemplateRouter.post("/create", async (req, res, next) => {
    try {
        await CreateTemplate(req, res, next);
    } catch (error) {
        next(error);
    }
});

TemplateRouter.get("/all", async (req, res, next) => {
    try {
        await FetchAllTemplates(req, res, next);
    } catch (error) {
        next(error);
    }
});

TemplateRouter.get("/public", async (req, res, next) => {
    try {
        await FetchAllPublicTemplates(req, res, next);
    } catch (error) {
        next(error);
    }
});

TemplateRouter.get("/single/:id", async (req, res, next) => {
    try {
        await FetchTemplateById(req, res, next);
    } catch (error) {
        next(error);
    }
});

TemplateRouter.get("/use/:id", async (req, res, next) => {
    try {
        await UseTemplate(req, res, next);
    } catch (error) {
        next(error);
    }
});

TemplateRouter.delete("/delete/:id", async (req, res, next) => {
    try {
        await DeleteTemplate(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default TemplateRouter;