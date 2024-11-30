import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user";
import { ForgotPasswordSchema, LoginSchema, RegisterSchema, ResetPasswordSchema, UpdateProfileSchema, VerifyEmailSchema, VerifyResetPasswordSchema } from "../schemas/auth-schemas";
import { AppErr } from "../utils/app-err";
import { ZodError } from "zod";
import bcrypt from 'bcrypt';
import { CreateUserToken } from "../jwt/user";
import OtpGenerator from "otp-generator";
import { sendEmail } from "../utils/email-api";

// Sign In Controller
export const signInController = async (req: Request, res: Response, next: NextFunction) => {
   try {
        // Implementation for signing in
        const body = req.body;
        const parsedBody = LoginSchema.parse(body);

        const user = await UserModel.findOne({ email : parsedBody.email });
        if(!user) return next(AppErr('Invalid email or password', 401));

        const isMatch = await bcrypt.compare(parsedBody.password, user.password);
        if(!isMatch) return next(AppErr('Invalid email or password', 401));

        const payload = {
            email : user?.email as string,
            id : user?._id,
            username : user?.firstname + ' ' + user?.lastname,
            profilePic : user?.profilePic,
            role : user?.Role
        };

        const token = await CreateUserToken(payload);
        res.cookie('token', token, { httpOnly : true, secure : true, maxAge : 30 * 24 * 60 * 60 * 1000 });

        await UserModel.findByIdAndUpdate(user?._id, { token : token });

        return res.status(201).json({
            message : `user has been signed in on ${new Date().toLocaleString()}`,
            token : token
        });
   } catch (error) {
        if (error instanceof ZodError) next(AppErr(error.errors[0].message, 400));
        else {
            next(AppErr('Something went wrong', 500));
        }
   }
};

// Sign Up Controller
export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for signing up
    const body = req.body;
    const parsedBody = RegisterSchema.parse(body);

    const user = await UserModel.findOne({ email : parsedBody.email });
    if(user) return next(AppErr('User already exists', 400));

    const hashedPassword = await bcrypt.hash(parsedBody.password, 10);
    const newUser = await UserModel.create({ ...parsedBody, password : hashedPassword });

    const otp = OtpGenerator.generate(6, {specialChars: false, digits : true, upperCaseAlphabets : false, lowerCaseAlphabets : false});

    await sendEmail(newUser?.email as string, 'Flinte - Email Verification', "Kindly Verify your Email with the OTP below: \n" + otp + "\n\nThis OTP will expire in 5 minutes");

    res.cookie('otp', otp, { httpOnly : true, secure : true, maxAge : 5 * 60 * 1000 });

    return res.status(201).json({
        message : `user has been signed up on ${new Date().toLocaleString()}`,
        user : newUser
    });
};

// Sign Out Controller
export const signOutController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for signing out
    const user = (req as any).user;
    if(!user) return next(AppErr('User not found', 404));

    await UserModel.findByIdAndUpdate(user._id, { token : '' });
    res.clearCookie('token');
    res.clearCookie('otp');

    return res.status(200).json({
        message : `user has been signed out on ${new Date().toLocaleString()}`,
    });
};

// Refresh Token Controller
export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for refreshing token
    const user = (req as any).user;
    if(!user) return next(AppErr('User not found', 404));

    const payload = {
        email : user?.email as string,
        id : user?._id,
        username : user?.firstname + ' ' + user?.lastname,
        profilePic : user?.profilePic,
        role : user?.Role
    };
    const token = await CreateUserToken(payload);

    await UserModel.findByIdAndUpdate(user?._id, { token : token });

    res.cookie('token', token, { httpOnly : true, secure : true, maxAge : 30 * 24 * 60 * 60 * 1000 });

    return res.status(201).json({
        message : `user has been refreshed token on ${new Date().toLocaleString()}`,
        token : token
    });
};

// Verify Email Controller
export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for verifying email
    const body = req.body;
    const parsedBody = VerifyEmailSchema.parse(body);

    const otp = req.cookies.otp;
    if(!otp) return next(AppErr('OTP not found', 400));

    if(otp !== parsedBody.otp) return next(AppErr('Invalid OTP', 400));

    const user = (req as any).user;
    if(!user) return next(AppErr('User not found', 404));

    await UserModel.findByIdAndUpdate(user?._id, { isVerified : true });

    res.clearCookie('otp');

    return res.status(200).json({
        message : `email has been verified on ${new Date().toLocaleString()}`,
    });
};

// Forgot Password Controller
export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for forgot password
    const body = req.body;
    const parsedBody = ForgotPasswordSchema.parse(body);

    const user = await UserModel.findOne({ email : parsedBody.email });
    if(!user) return next(AppErr('User not found', 404));

    const otp = OtpGenerator.generate(6, {specialChars: false, digits : true, upperCaseAlphabets : false, lowerCaseAlphabets : false});

    await sendEmail(user?.email as string, 'Flinte - Forgot Password', "Kindly Reset your Password with the OTP below: \n" + otp + "\n\nThis OTP will expire in 5 minutes");

    res.cookie('otp', otp, { httpOnly : true, secure : true, maxAge : 5 * 60 * 1000 });

    return res.status(200).json({
        message : `password has been sent to email on ${new Date().toLocaleString()}`,
    });
};

// Reset Password Controller
export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for resetting password
    const body = req.body;
    const parsedBody = ResetPasswordSchema.parse(body);

    const isResetting = req.cookies.isResetting;
    if(!isResetting) return next(AppErr('User not resetting', 400));

    const user = (req as any).user;
    if(!user) return next(AppErr('User not found', 404));

    const hashedPassword = await bcrypt.hash(parsedBody.password, 10);
    await UserModel.findByIdAndUpdate(user?._id, { password : hashedPassword });

    res.clearCookie('isResetting');

    return res.status(200).json({
        message : `password has been reset on ${new Date().toLocaleString()}`,
    });
};

// Verify Reset Password Controller
export const verifyResetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for verifying reset password
    const body = req.body;
    const parsedBody = VerifyResetPasswordSchema.parse(body);

    const otp = req.cookies.otp;
    if(!otp) return next(AppErr('OTP not found', 400));

    if(otp !== parsedBody.otp) return next(AppErr('Invalid OTP', 400));

    res.clearCookie('otp');
    res.cookie('isResetting', true, { httpOnly : true, secure : true, maxAge : 5 * 60 * 1000 });

    return res.status(200).json({
        message : `password has been verified on ${new Date().toLocaleString()}`,
    });
};

// Get Profile Controller
export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for getting profile
    const user = (req as any).user;
    if(!user) return next(AppErr('User not found', 404));

    const userData = await UserModel.findById(user?._id);
    if(!userData) return next(AppErr('User not found', 404));

    return res.status(200).json({
        user : userData
    });
};

// Update Profile Controller
export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for updating profile
    const body = req.body;
    const parsedBody = UpdateProfileSchema.parse(body);

    const user = (req as any).user;
    if(!user) return next(AppErr('User not found', 404));

    await UserModel.findByIdAndUpdate(user?._id, { ...parsedBody });

    return res.status(200).json({
        message : `profile has been updated on ${new Date().toLocaleString()}`,
    });
};

// Delete Profile Controller
export const deleteProfileController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for deleting profile
    const user = (req as any).user;
    if(!user) return next(AppErr('User not found', 404));

    await UserModel.findByIdAndDelete(user?._id);

    return res.status(200).json({
        message : `profile has been deleted on ${new Date().toLocaleString()}`,
    });
};

// Upload Profile Picture Controller
export const uploadProfilePicController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for uploading profile picture
    const body = req.body;
    const fileUrl = body?.fileUrl as string;

    const user = (req as any).user;
    if(!user) return next(AppErr('User not found', 404));

    await UserModel.findByIdAndUpdate(user?._id, { profilePic : fileUrl });

    return res.status(200).json({
        message : `profile picture has been uploaded on ${new Date().toLocaleString()}`,
    });
};

// Delete Profile Picture Controller
export const deleteProfilePicController = async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for deleting profile picture
    const user = (req as any).user;
    if(!user) return next(AppErr('User not found', 404));

    await UserModel.findByIdAndUpdate(user?._id, { profilePic : '' });

    return res.status(200).json({
        message : `profile picture has been deleted on ${new Date().toLocaleString()}`,
    });
};