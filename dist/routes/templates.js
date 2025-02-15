"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templates_1 = require("../controllers/templates");
const express_1 = require("express");
const TemplateRouter = (0, express_1.Router)();
// Routes
TemplateRouter.post("/create", async (req, res, next) => {
    try {
        await (0, templates_1.CreateTemplate)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
TemplateRouter.get("/all", async (req, res, next) => {
    try {
        await (0, templates_1.FetchAllTemplates)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
TemplateRouter.get("/public", async (req, res, next) => {
    try {
        await (0, templates_1.FetchAllPublicTemplates)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
TemplateRouter.get("/single/:id", async (req, res, next) => {
    try {
        await (0, templates_1.FetchTemplateById)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
TemplateRouter.get("/use/:id", async (req, res, next) => {
    try {
        await (0, templates_1.UseTemplate)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
TemplateRouter.delete("/delete/:id", async (req, res, next) => {
    try {
        await (0, templates_1.DeleteTemplate)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.default = TemplateRouter;
