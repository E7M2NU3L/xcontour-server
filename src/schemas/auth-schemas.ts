import z from "zod";

export const LoginSchema = z.object({
    email : z.string().email({
        message : "Enter a valid email address"
    }),
    password : z.string().min(8, {
        message : "Password must be at least 8 characters long"
    })
});

export const RegisterSchema = z.object({
    firstName : z.string(),
    lastName : z.string(),
    email : z.string().email({
        message : "Enter a valid email address"
    }),
    password : z.string().min(8, {
        message : "Password must be at least 8 characters long"
    }).max(70, {
        message : "Exceeded the maximum character limit"
    }),
    role : z.enum(['viewer', 'admin', 'editor'], {
        required_error : "Role is required"
    })
});

export const VerifyEmailSchema = z.object({
    otp : z.string().min(6, {
        message : "OTP must be 6 characters long"
    }),
});

export const ForgotPasswordSchema = z.object({
    email : z.string().email({
        message : "Enter a valid email address"
    }),
});

export const ResetPasswordSchema = z.object({
    password : z.string().min(8, {
        message : "Password must be at least 8 characters long"
    }),
});

export const VerifyResetPasswordSchema = z.object({
    otp : z.string().min(6, {
        message : "OTP must be 6 characters long"
    }),
});

export const UpdateProfileSchema = z.object({
    firstName : z.string(),
    lastName : z.string(),
    password : z.string().min(8, {
        message : "Password must be at least 8 characters long"
    }),
});
