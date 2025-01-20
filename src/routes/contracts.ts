import { CreateContract, DeleteContract, FetchAllContracts, FetchContractById, UpdateContract, updateVersion } from "../controllers/contracts";
import { Router } from "express";

const ContractsRouter = Router();

// Routes
ContractsRouter.post("/create", async (req, res, next) => {
    try {
        await CreateContract(req, res, next);
    } catch (error) {
        next(error);
    }
});

ContractsRouter.get("/all", async (req, res, next) => {
    try {
        await FetchAllContracts(req, res, next);
    } catch (error) {
        next(error);
    }
});

ContractsRouter.get("/all/:id", async (req, res, next) => {
    try {
        await FetchContractById(req, res, next);
    } catch (error) {
        next(error);
    }
});

ContractsRouter.put("/all/:id", async (req, res, next) => {
    try {
        await UpdateContract(req, res, next);
    } catch (error) {
        next(error)
    }
})

ContractsRouter.put("/all/status/:id", async (req, res, next) => {
    try {
        await updateVersion(req, res, next);
    } catch (error) {
        next(error)
    }
})

// /api/v1/contracts/delete/${id}
ContractsRouter.delete("/all/:id", async (req, res, next) => {
    try {
        await DeleteContract(req, res, next);
    } catch (error) {
        next(error)
    }
})

export default ContractsRouter;
