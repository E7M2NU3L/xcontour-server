"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContract = CreateContract;
exports.FetchAllContracts = FetchAllContracts;
exports.FetchContractById = FetchContractById;
exports.updateVersion = updateVersion;
exports.UpdateContract = UpdateContract;
exports.DeleteContract = DeleteContract;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const contracts_1 = require("../models/contracts");
const app_err_1 = require("../utils/app-err");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Helper function to validate object IDs or return an error
const mongoose_1 = __importDefault(require("mongoose"));
const isValidObjectId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
// Create Contracts
async function CreateContract(req, res, next) {
    try {
        const { title, clientName, content, participants, status } = req.body;
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
        if (!title || !clientName || !content || !participants) {
            return res.status(400).json({
                status: "fail",
                message: "Missing required fields: title, clientName, content, participants",
            });
        }
        const contract = await contracts_1.Contracts.create({
            title,
            clientName,
            currentVersion: 1,
            versions: [
                {
                    versionNumber: 1,
                    content,
                    createdBy: decodedToken.id,
                    status: status ?? 'Draft',
                    changeSummary: "Initial Draft",
                },
            ],
            participants,
            createdBy: decodedToken.id,
        });
        return res.status(201).json({
            status: "success",
            message: "Contracts created successfully",
            data: contract,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
// Fetch All Contracts
async function FetchAllContracts(req, res, next) {
    try {
        const contracts = await contracts_1.Contracts.find().populate("participants").populate("createdBy");
        return res.status(200).json({
            status: "success",
            message: "Contracts fetched successfully",
            data: contracts,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
// Fetch Contracts By ID
async function FetchContractById(req, res, next) {
    try {
        const { id } = req.params;
        console.log(id, " is the id");
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid contract ID",
            });
        }
        const contract = await contracts_1.Contracts.findById(id).populate("participants").populate("createdBy");
        if (!contract) {
            return res.status(404).json({
                status: "fail",
                message: "Contracts not found",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Contracts fetched successfully",
            data: contract,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
async function updateVersion(req, res, next) {
    try {
        const { id } = req.params;
        const { status, versionNumber } = req.body;
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid contract ID",
            });
        }
        const contract = await contracts_1.Contracts.findById(id);
        if (!contract) {
            return res.status(404).json({
                status: "fail",
                message: "Contracts not found",
            });
        }
        // Find the version to update by versionNumber
        const versionToUpdate = contract.versions.find(v => v.versionNumber === versionNumber);
        if (!versionToUpdate) {
            return res.status(401).json({
                message: "Version not Found",
                status: "Failed",
            });
        }
        ;
        versionToUpdate.status = status ?? versionToUpdate.status;
        await contract.save();
        return res.json({
            status: "Success",
            contract,
            message: "Status updated successfully",
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
// Update Contracts
async function UpdateContract(req, res, next) {
    try {
        const { id } = req.params;
        const { title, clientName, content, changeSummary, status, versionNumber } = req.body;
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid contract ID",
            });
        }
        const contract = await contracts_1.Contracts.findById(id);
        if (!contract) {
            return res.status(404).json({
                status: "fail",
                message: "Contracts not found",
            });
        }
        // Find the version to update by versionNumber
        const versionToUpdate = contract.versions.find(v => v.versionNumber === versionNumber);
        if (!title || !clientName || !content) {
            if (versionToUpdate) {
                versionToUpdate.status = status ?? versionToUpdate.status;
                versionToUpdate.versionNumber = versionToUpdate.versionNumber + 1;
            }
            return res.json({
                status: "Success",
                contract,
                message: "Status updated successfully",
            });
        }
        contract.title = title;
        contract.clientName = clientName;
        // Add a new version
        contract.versions.push({
            versionNumber: contract.currentVersion + 1,
            content,
            changeSummary,
        });
        contract.currentVersion += 1;
        await contract.save();
        return res.status(200).json({
            status: "success",
            message: "Contracts updated successfully",
            data: contract,
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
// Delete Contracts
async function DeleteContract(req, res, next) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid contract ID",
            });
        }
        await contracts_1.Contracts.findByIdAndDelete(id);
        return res.status(200).json({
            status: "success",
            message: "Contracts deleted successfully",
        });
    }
    catch (error) {
        next((0, app_err_1.AppErrServer)(error));
    }
}
