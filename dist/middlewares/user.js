"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckViewer = exports.CheckAdmin = exports.CheckEditor = exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_err_1 = require("../utils/app-err");
dotenv_1.default.config();
const AuthMiddleware = (err, req, res, next) => {
    try {
        const token = req.cookies['token'];
        console.log("token: ", token);
        if (!token)
            return next((0, app_err_1.AppErr)('Unauthorized', 401));
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded)
            return next((0, app_err_1.AppErr)('Unauthorized', 401));
        console.log(decoded);
        req.user = decoded;
        console.log(req.user);
        next();
    }
    catch (error) {
        next((0, app_err_1.AppErr)('Something went wrong', 500));
    }
};
exports.AuthMiddleware = AuthMiddleware;
const CheckEditor = (req, res, next) => {
    const user = req.user;
    if (user?.Role !== 'editor')
        return next((0, app_err_1.AppErr)('Unauthorized', 401));
    next();
};
exports.CheckEditor = CheckEditor;
const CheckAdmin = (req, res, next) => {
    const user = req.user;
    if (user?.Role !== 'admin')
        return next((0, app_err_1.AppErr)('Unauthorized', 401));
    next();
};
exports.CheckAdmin = CheckAdmin;
const CheckViewer = async (req, res, next) => {
    const user = req.user;
    if (user?.Role !== 'viewer')
        return next((0, app_err_1.AppErr)('Unauthorized', 401));
    next();
};
exports.CheckViewer = CheckViewer;
