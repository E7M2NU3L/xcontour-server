import { FetchAllSuggestions, ReviewSuggestion, SuggestChange } from "../controllers/suggestions";
import { Router } from "express";

const SuggestionsRouter = Router();

// Routes
SuggestionsRouter.post("/create", async (req, res, next) => {
    try {
        await SuggestChange(req, res, next);
    } catch (error) {
        next(error);
    }
});

SuggestionsRouter.get("/:contractId", async (req, res, next) => {
    try {
        await FetchAllSuggestions(req, res, next);
    } catch (error) {
        next(error);
    }
});

SuggestionsRouter.post("/:suggestionId", async (req, res, next) => {
    try {
        await ReviewSuggestion(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default SuggestionsRouter;