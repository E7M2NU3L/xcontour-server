"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suggestions_1 = require("../controllers/suggestions");
const express_1 = require("express");
const SuggestionsRouter = (0, express_1.Router)();
// Routes
SuggestionsRouter.post("/create", async (req, res, next) => {
    try {
        await (0, suggestions_1.SuggestChange)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
SuggestionsRouter.get("/:contractId", async (req, res, next) => {
    try {
        await (0, suggestions_1.FetchAllSuggestions)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
SuggestionsRouter.post("/:suggestionId", async (req, res, next) => {
    try {
        await (0, suggestions_1.ReviewSuggestion)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.default = SuggestionsRouter;
