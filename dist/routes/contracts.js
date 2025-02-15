"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_1 = require("../controllers/contracts");
const express_1 = require("express");
const ContractsRouter = (0, express_1.Router)();
// Routes
ContractsRouter.post("/create", async (req, res, next) => {
    try {
        await (0, contracts_1.CreateContract)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
ContractsRouter.get("/all", async (req, res, next) => {
    try {
        await (0, contracts_1.FetchAllContracts)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
ContractsRouter.get("/all/:id", async (req, res, next) => {
    try {
        await (0, contracts_1.FetchContractById)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
ContractsRouter.put("/all/:id", async (req, res, next) => {
    try {
        await (0, contracts_1.UpdateContract)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
ContractsRouter.put("/all/status/:id", async (req, res, next) => {
    try {
        await (0, contracts_1.updateVersion)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
// /api/v1/contracts/delete/${id}
ContractsRouter.delete("/all/:id", async (req, res, next) => {
    try {
        await (0, contracts_1.DeleteContract)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.default = ContractsRouter;
