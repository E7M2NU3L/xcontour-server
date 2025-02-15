"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSuccessFailure = exports.LoginFailedController = exports.CallbackGoogle = exports.InitGoogle = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passport_1 = __importDefault(require("passport"));
// Initiates the Google Login flow
const InitGoogle = async (req, res) => {
    passport_1.default.authenticate('google', { scope: ['profile', 'email'] });
};
exports.InitGoogle = InitGoogle;
// Callback URL for handling the Google Login response
const CallbackGoogle = async (req, res, next) => {
    passport_1.default.authenticate('google', {
        successRedirect: process.env.CLIENT_ENDPOINT,
        failureRedirect: '/login/failed'
    });
};
exports.CallbackGoogle = CallbackGoogle;
const LoginFailedController = async (req, res, next) => {
    res.status(401).json({
        error: true,
        message: "Login wth google has been failed"
    });
};
exports.LoginFailedController = LoginFailedController;
const LoginSuccessFailure = async (req, res, next) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "successfully Logged in",
            user: req.user
        });
    }
    else {
        res.status(403).json({
            error: true,
            message: "Unauthorized"
        });
    }
};
exports.LoginSuccessFailure = LoginSuccessFailure;
