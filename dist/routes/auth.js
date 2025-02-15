"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../middlewares/user");
const auth_1 = require("../controllers/auth");
const express_1 = require("express");
const google_auth_1 = require("../controllers/google-auth");
// Auth Router
const AuthRouter = (0, express_1.Router)();
// Routes
AuthRouter.post("/sign-in", async (req, res, next) => {
    try {
        await (0, auth_1.signInController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.post("/sign-up", async (req, res, next) => {
    try {
        await (0, auth_1.signUpController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.post("/sign-out", async (req, res, next) => {
    try {
        await (0, auth_1.signOutController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.post("/refresh-token", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.refreshTokenController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.post("/verify-user-send-otp", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.VerifyUserSendOtpController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.put("/verify-email", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.verifyEmailController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.post("/send-otp", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.forgotPasswordController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.put("/reset-password", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.resetPasswordController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.post("/verify-otp", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.verifyResetPasswordController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.get("/profile", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.getProfileController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.put("/profile", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.updateProfileController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.delete("/profile", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.DeleteAccountController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.put("/upload-profile-pic", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.uploadProfilePicController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.put("/delete-profile-pic", user_1.AuthMiddleware, async (req, res, next) => {
    try {
        await (0, auth_1.deleteProfilePicController)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
AuthRouter.get("/google", google_auth_1.InitGoogle);
AuthRouter.get("/callback/google", google_auth_1.CallbackGoogle);
// Success 
AuthRouter.get('/auth/callback/success', (req, res) => {
    if (!req.user) {
        res.redirect('/auth/callback/failure');
    }
    res.send(req.user);
});
// failure
AuthRouter.get('/auth/callback/failure', (req, res) => {
    res.send("Error");
});
exports.default = AuthRouter;
