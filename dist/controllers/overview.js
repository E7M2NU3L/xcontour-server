"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAppOverview = FetchAppOverview;
const app_err_1 = require("../utils/app-err");
const contracts_1 = require("../models/contracts");
const templates_1 = require("../models/templates");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function FetchAppOverview(req, res, next) {
    try {
        // Extract token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log(token);
        // If no token found, log out gracefully
        if (!token) {
            return res.status(200).json({
                message: "User logged out successfully (no active session).",
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
            return res.status(200).json({
                message: "User logged out successfully (invalid token).",
            });
        }
        const userId = decodedToken.id; // Assuming the user ID is available in the request object after authentication middleware
        // Fetching total contracts, active contracts, and draft contracts
        const totalContracts = await contracts_1.Contracts.countDocuments();
        const activeContracts = await contracts_1.Contracts.countDocuments({ "versions.status": "Active" });
        const draftContracts = await contracts_1.Contracts.countDocuments({ "versions.status": "Draft" });
        // Fetching templates created by the user
        const userTemplates = await templates_1.Templates.countDocuments({ createdBy: userId });
        // Monthly Summary - Total contracts for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlySummary = await contracts_1.Contracts.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
        ]);
        const formattedMonthlySummary = Array.from({ length: 6 }, (_, i) => {
            const month = new Date();
            month.setMonth(month.getMonth() - (5 - i));
            const monthNumber = month.getMonth() + 1; // Months are 0-indexed
            return {
                month: month.toLocaleString("default", { month: "long" }),
                count: monthlySummary.find((data) => data._id === monthNumber)?.count || 0,
            };
        });
        // Weekly Contracts - Weekly ratio for active and draft contracts
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const weeklyContracts = await contracts_1.Contracts.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfWeek },
                },
            },
            {
                $group: {
                    _id: null,
                    activeContracts: {
                        $sum: {
                            $cond: [{ $eq: ["$versions.status", "Active"] }, 1, 0],
                        },
                    },
                    draftContracts: {
                        $sum: {
                            $cond: [{ $eq: ["$versions.status", "Draft"] }, 1, 0],
                        },
                    },
                },
            },
        ]);
        // Formatting weekly contract data with ratios
        const weeklyContractData = [
            {
                date: "2024-07-15",
                activeContracts: weeklyContracts[0]?.activeContracts || 0,
                draftContracts: weeklyContracts[0]?.draftContracts || 0,
            },
            {
                date: "2024-07-16",
                activeContracts: weeklyContracts[0]?.activeContracts || 0,
                draftContracts: weeklyContracts[0]?.draftContracts || 0,
            },
            {
                date: "2024-07-17",
                activeContracts: weeklyContracts[0]?.activeContracts || 0,
                draftContracts: weeklyContracts[0]?.draftContracts || 0,
            },
            {
                date: "2024-07-18",
                activeContracts: weeklyContracts[0]?.activeContracts || 0,
                draftContracts: weeklyContracts[0]?.draftContracts || 0,
            },
            {
                date: "2024-07-19",
                activeContracts: weeklyContracts[0]?.activeContracts || 0,
                draftContracts: weeklyContracts[0]?.draftContracts || 0,
            },
            {
                date: "2024-07-20",
                activeContracts: weeklyContracts[0]?.activeContracts || 0,
                draftContracts: weeklyContracts[0]?.draftContracts || 0,
            },
        ];
        // Bar Chart Data - Static example
        const chartData = [
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
        ];
        // Returning the response
        return res.json({
            status: "Success",
            message: "The Overview data has been fetched successfully",
            data: {
                totalContracts,
                activeContracts,
                draftContracts,
                userTemplates,
                monthlySummary: formattedMonthlySummary,
                weeklyContracts: weeklyContractData,
                chartData,
            },
        });
    }
    catch (error) {
        return next((0, app_err_1.AppErrServer)(error));
    }
}
