"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverviewRouter = void 0;
const overview_1 = require("../controllers/overview");
const express_1 = __importDefault(require("express"));
exports.OverviewRouter = express_1.default.Router();
exports.OverviewRouter.get("/", async (req, res, next) => {
    try {
        await (0, overview_1.FetchAppOverview)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
