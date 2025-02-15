"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAccountController = exports.deleteProfilePicController = exports.uploadProfilePicController = exports.deleteProfileController = exports.updateProfileController = exports.getProfileController = exports.verifyResetPasswordController = exports.resetPasswordController = exports.forgotPasswordController = exports.verifyEmailController = exports.VerifyUserSendOtpController = exports.refreshTokenController = exports.signOutController = exports.signUpController = exports.signInController = void 0;
const user_1 = require("../models/user");
const auth_schemas_1 = require("../schemas/auth-schemas");
const app_err_1 = require("../utils/app-err");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_2 = require("../jwt/user");
const otp_generator_1 = __importDefault(require("otp-generator"));
const email_api_1 = require("../utils/email-api");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Sign In Controller
const signInController = async (req, res, next) => {
    try {
        // Implementation for signing in
        const body = req.body;
        const parsedBody = auth_schemas_1.LoginSchema.parse(body);
        const user = await user_1.UserModel.findOne({ email: parsedBody.email });
        if (!user)
            return next((0, app_err_1.AppErr)('Invalid email or password', 401));
        const isMatch = await bcrypt_1.default.compare(parsedBody.password, user.password);
        if (!isMatch)
            return next((0, app_err_1.AppErr)('Invalid email or password', 401));
        const payload = {
            email: user?.email,
            id: user?._id,
            username: user?.firstname + ' ' + user?.lastname,
            profilePic: user?.profilePic,
            role: user?.Role
        };
        const token = await (0, user_2.CreateUserToken)(payload);
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 });
        await user_1.UserModel.findByIdAndUpdate(user?._id, { token: token });
        req.user = payload;
        return res.status(201).json({
            message: `user has been signed in on ${new Date().toLocaleString()}`,
            token: token
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError)
            next((0, app_err_1.AppErr)(error.errors[0].message, 400));
        else {
            next((0, app_err_1.AppErr)('Something went wrong', 500));
        }
    }
};
exports.signInController = signInController;
// Sign Up Controller
const signUpController = async (req, res, next) => {
    // Implementation for signing up
    const body = req.body;
    const parsedBody = auth_schemas_1.RegisterSchema.parse(body);
    const user = await user_1.UserModel.findOne({ email: parsedBody.email });
    if (user)
        return next((0, app_err_1.AppErr)('User already exists', 400));
    const hashedPassword = await bcrypt_1.default.hash(parsedBody.password, 10);
    const newUser = await user_1.UserModel.create({ ...parsedBody, password: hashedPassword });
    return res.status(201).json({
        message: `user has been signed up on ${new Date().toLocaleString()}`,
        user: newUser
    });
};
exports.signUpController = signUpController;
const signOutController = async (req, res, next) => {
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
        req.logOut(function (err) {
            if (err) {
                console.log(err);
            }
        });
        return res.status(200).json({
            message: "User logged out successfully (invalid token).",
        });
    }
    // Invalidate token in database
    const userId = decodedToken.id ?? '';
    const user = await user_1.UserModel.findById(userId);
    if (user) {
        await user_1.UserModel.findByIdAndUpdate(userId, { token: "" });
    }
    // Clear cookies
    res.clearCookie("token");
    res.clearCookie("otp");
    res.clearCookie("verify-user-otp");
    return res.status(200).json({
        message: `User has been signed out successfully on ${new Date().toLocaleString()}.`,
    });
};
exports.signOutController = signOutController;
// Refresh Token Controller
const refreshTokenController = async (req, res, next) => {
    // Implementation for refreshing token
    const user = req.user;
    if (!user)
        return next((0, app_err_1.AppErr)('User not found', 404));
    const payload = {
        email: user?.email,
        id: user?._id,
        username: user?.firstname + ' ' + user?.lastname,
        profilePic: user?.profilePic,
        role: user?.Role
    };
    const token = await (0, user_2.CreateUserToken)(payload);
    await user_1.UserModel.findByIdAndUpdate(user?._id, { token: token });
    res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 });
    return res.status(201).json({
        message: `user has been refreshed token on ${new Date().toLocaleString()}`,
        token: token
    });
};
exports.refreshTokenController = refreshTokenController;
// verifyUser Send Otp Controller
const VerifyUserSendOtpController = async (req, res, next) => {
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
    const otp = otp_generator_1.default.generate(6, { specialChars: false, digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false });
    await (0, email_api_1.sendEmail)(decodedToken?.email, 'XContour - Email Verification One Time Password', "your User account will be secured with the OTP below: \n" + otp + "\n\nThis OTP will expire in 5 minutes");
    res.cookie('verify-user-otp', otp, { httpOnly: true, secure: false, maxAge: 5 * 60 * 1000 });
    return res.json({
        message: "Otp has been sent to your email address",
        status: 200
    });
};
exports.VerifyUserSendOtpController = VerifyUserSendOtpController;
// Verify Email Controller
const verifyEmailController = async (req, res, next) => {
    // Implementation for verifying email
    const body = req.body;
    const parsedBody = auth_schemas_1.VerifyEmailSchema.parse(body);
    const otp = req.cookies['verify-user-otp'];
    if (!otp)
        return next((0, app_err_1.AppErr)('OTP not found', 400));
    if (otp !== parsedBody.otp)
        return next((0, app_err_1.AppErr)('Invalid OTP', 400));
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
    await user_1.UserModel.findByIdAndUpdate(decodedToken?.id, { isVerified: true });
    res.clearCookie('verify-user-otp');
    return res.status(200).json({
        message: `email has been verified on ${new Date().toLocaleString()}`,
    });
};
exports.verifyEmailController = verifyEmailController;
// Forgot Password Controller
const forgotPasswordController = async (req, res, next) => {
    // Implementation for forgot password
    const body = req.body;
    const parsedBody = auth_schemas_1.ForgotPasswordSchema.parse(body);
    const user = await user_1.UserModel.findOne({ email: parsedBody.email });
    if (!user) {
        return next((0, app_err_1.AppErr)('User not found', 404));
    }
    const otp = otp_generator_1.default.generate(6, { specialChars: false, digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false });
    await (0, email_api_1.sendEmail)(user?.email, 'XContour - Forgot Password', "Kindly Reset your Password with the OTP below: \n" + otp + "\n\nThis OTP will expire in 5 minutes");
    res.cookie('otp', otp, { httpOnly: true, secure: false, maxAge: 5 * 60 * 1000 });
    res.cookie('user-email', parsedBody.email, {
        httpOnly: true,
        secure: true,
        maxAge: 5 * 60 * 1000
    });
    return res.status(200).json({
        message: `password has been sent to email on ${new Date().toLocaleString()}`,
    });
};
exports.forgotPasswordController = forgotPasswordController;
// Reset Password Controller
const resetPasswordController = async (req, res, next) => {
    // Implementation for resetting password
    const body = req.body;
    const parsedBody = auth_schemas_1.ResetPasswordSchema.parse(body);
    const isResetting = req.cookies.isResetting;
    if (!isResetting)
        return next((0, app_err_1.AppErr)('User not resetting', 400));
    const user = req.cookies['user-email'];
    if (!user) {
        return next((0, app_err_1.AppErr)("Email not set properly", 500));
    }
    const FoundUser = await user_1.UserModel.findOne({
        email: user
    });
    if (!FoundUser) {
        return next((0, app_err_1.AppErr)("user email does not exists", 500));
    }
    const hashedPassword = await bcrypt_1.default.hash(parsedBody.password, 10);
    await user_1.UserModel.findByIdAndUpdate(FoundUser._id, { password: hashedPassword });
    res.clearCookie('isResetting');
    res.clearCookie('user-email');
    return res.status(200).json({
        message: `password has been reset on ${new Date().toLocaleString()}`,
    });
};
exports.resetPasswordController = resetPasswordController;
// Verify Reset Password Controller
const verifyResetPasswordController = async (req, res, next) => {
    // Implementation for verifying reset password
    const body = req.body;
    const parsedBody = auth_schemas_1.VerifyResetPasswordSchema.parse(body);
    const otp = req.cookies.otp;
    if (!otp)
        return next((0, app_err_1.AppErr)('OTP not found', 400));
    if (otp !== parsedBody.otp)
        return next((0, app_err_1.AppErr)('Invalid OTP', 400));
    res.clearCookie('otp');
    res.cookie('isResetting', true, { httpOnly: true, secure: false, maxAge: 5 * 60 * 1000 });
    return res.status(200).json({
        message: `password has been verified on ${new Date().toLocaleString()}`,
    });
};
exports.verifyResetPasswordController = verifyResetPasswordController;
// Get Profile Controller
const getProfileController = async (req, res, next) => {
    // Implementation for getting profile
    const token = req.cookies['token'];
    if (!token)
        return next((0, app_err_1.AppErr)('Unauthorized', 401));
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decoded)
        return next((0, app_err_1.AppErr)('Unauthorized', 401));
    const user = await user_1.UserModel.findById(decoded?.id);
    if (!user)
        return next((0, app_err_1.AppErr)('Unauthorized', 401));
    console.log(req.user);
    return res.status(200).json({
        user
    });
};
exports.getProfileController = getProfileController;
// Update Profile Controller
const updateProfileController = async (req, res, next) => {
    // Implementation for updating profile
    const body = req.body;
    const parsedBody = auth_schemas_1.UpdateProfileSchema.parse(body);
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
    await user_1.UserModel.findByIdAndUpdate(decodedToken?.id, { ...parsedBody });
    return res.status(200).json({
        message: `profile has been updated on ${new Date().toLocaleString()}`,
    });
};
exports.updateProfileController = updateProfileController;
// Delete Profile Controller
const deleteProfileController = async (req, res, next) => {
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
    await user_1.UserModel.findByIdAndDelete(decodedToken?.id);
    return res.status(200).json({
        message: `profile has been deleted on ${new Date().toLocaleString()}`,
    });
};
exports.deleteProfileController = deleteProfileController;
// Upload Profile Picture Controller
const uploadProfilePicController = async (req, res, next) => {
    // Implementation for uploading profile picture
    const body = req.body;
    const fileUrl = body?.fileUrl;
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
    await user_1.UserModel.findByIdAndUpdate(decodedToken?.id, { profilePic: fileUrl });
    return res.status(200).json({
        message: `profile picture has been uploaded on ${new Date().toLocaleString()}`,
    });
};
exports.uploadProfilePicController = uploadProfilePicController;
// Delete Profile Picture Controller
const deleteProfilePicController = async (req, res, next) => {
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
    await user_1.UserModel.findByIdAndUpdate(decodedToken?.id, { profilePic: '' });
    return res.status(200).json({
        message: `profile picture has been deleted on ${new Date().toLocaleString()}`,
    });
};
exports.deleteProfilePicController = deleteProfilePicController;
const DeleteAccountController = async (req, res, next) => {
    const { confirm, datadeletion, agree } = req.body;
    if (datadeletion || agree) {
        return next((0, app_err_1.AppErr)("Agree to the statements, before deleting", 300));
    }
    const token = req.cookies['token'];
    console.log(token);
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    await user_1.UserModel.findByIdAndDelete(decoded.id);
    req.user = '';
    res.cookie('token', '');
    res.clearCookie('token');
    return res.status(200).json({
        status: 200,
        message: "User has been deleted successfully",
    });
};
exports.DeleteAccountController = DeleteAccountController;
