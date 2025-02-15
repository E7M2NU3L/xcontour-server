"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileSchema = exports.VerifyResetPasswordSchema = exports.ResetPasswordSchema = exports.ForgotPasswordSchema = exports.VerifyEmailSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.LoginSchema = zod_1.default.object({
    email: zod_1.default.string().email({
        message: "Enter a valid email address"
    }),
    password: zod_1.default.string().min(8, {
        message: "Password must be at least 8 characters long"
    })
});
exports.RegisterSchema = zod_1.default.object({
    firstname: zod_1.default.string(),
    lastname: zod_1.default.string(),
    email: zod_1.default.string().email({
        message: "Enter a valid email address"
    }),
    password: zod_1.default.string().min(8, {
        message: "Password must be at least 8 characters long"
    }).max(70, {
        message: "Exceeded the maximum character limit"
    }),
    Role: zod_1.default.enum(['viewer', 'admin', 'editor']).optional().default('editor')
});
exports.VerifyEmailSchema = zod_1.default.object({
    otp: zod_1.default.string().min(6, {
        message: "OTP must be 6 characters long"
    }),
});
exports.ForgotPasswordSchema = zod_1.default.object({
    email: zod_1.default.string().email({
        message: "Enter a valid email address"
    }),
});
exports.ResetPasswordSchema = zod_1.default.object({
    password: zod_1.default.string().min(8, {
        message: "Password must be at least 8 characters long"
    }),
});
exports.VerifyResetPasswordSchema = zod_1.default.object({
    otp: zod_1.default.string().min(6, {
        message: "OTP must be 6 characters long"
    }),
});
exports.UpdateProfileSchema = zod_1.default.object({
    firstname: zod_1.default.string(),
    lastname: zod_1.default.string(),
    phoneNumber: zod_1.default.string(),
    Bio: zod_1.default.string().optional()
});
