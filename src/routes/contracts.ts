import { CreateContract, DeleteContract, FetchAllContracts, FetchContractById, UpdateContract } from "../controllers/contracts";
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

ContractsRouter.get("/:id", async (req, res, next) => {
    try {
        await FetchContractById(req, res, next);
    } catch (error) {
        next(error);
    }
});

ContractsRouter.put("/:id", async (req, res, next) => {
    try {
        await UpdateContract(req, res, next);
    } catch (error) {
        next(error)
    }
})

ContractsRouter.delete("/:id", async (req, res, next) => {
    try {
        await DeleteContract(req, res, next);
    } catch (error) {
        next(error)
    }
})

export default ContractsRouter;
