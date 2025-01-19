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
    firstname : z.string(),
    lastname : z.string(),
    email : z.string().email({
        message : "Enter a valid email address"
    }),
    password : z.string().min(8, {
        message : "Password must be at least 8 characters long"
    }).max(70, {
        message : "Exceeded the maximum character limit"
    }),
    Role : z.enum(['viewer', 'admin', 'editor']).optional().default('editor')
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
    firstname : z.string(),
    lastname : z.string(),
    phoneNumber : z.string(),
    Bio : z.string().optional()
});
