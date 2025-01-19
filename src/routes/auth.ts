import { AuthMiddleware } from "../middlewares/user";
import { DeleteAccountController, deleteProfileController, deleteProfilePicController, forgotPasswordController, getProfileController, refreshTokenController, resetPasswordController, signInController, signOutController, signUpController, updateProfileController, uploadProfilePicController, verifyEmailController, verifyResetPasswordController, VerifyUserSendOtpController } from "../controllers/auth";
import { NextFunction, Request, Response, Router } from "express";
import { CallbackGoogle, InitGoogle } from "../controllers/google-auth";

// Auth Router
const AuthRouter = Router();
// Routes
AuthRouter.post("/sign-in", async (req :  Request, res : Response, next : NextFunction) => {
  try {
    await signInController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/sign-up", async (req :  Request, res : Response, next : NextFunction) => {
  try {
    await signUpController(req, res, next);
  } catch (error) {
    next(error);
  }
});

AuthRouter.post("/sign-out", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await signOutController(req, res, next);
  } catch (error) {
    next(error);
  }
});

AuthRouter.post("/refresh-token", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await refreshTokenController(req, res, next);
  } catch (error) {
    next(error);
  }
});

AuthRouter.post("/verify-user-send-otp", AuthMiddleware, async (req : Request, res : Response, next : NextFunction) => {
  try {
    await VerifyUserSendOtpController(req, res, next);
  } catch (error) {
    next(error);
  }
})

AuthRouter.put("/verify-email", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await verifyEmailController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/send-otp", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await forgotPasswordController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.put("/reset-password", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await resetPasswordController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/verify-otp", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await verifyResetPasswordController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.get("/profile", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getProfileController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.put("/profile", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateProfileController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.delete("/profile", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await DeleteAccountController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.put("/upload-profile-pic", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await uploadProfilePicController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.put("/delete-profile-pic", AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteProfilePicController(req, res, next);
  } catch (error) {
    next(error);
  }
});

AuthRouter.get("/google", InitGoogle);
AuthRouter.get("/callback/google", CallbackGoogle);

// Success 
AuthRouter.get('/auth/callback/success' , (req : Request , res : Response) => {
  if(!req.user)
      {
        res.redirect('/auth/callback/failure');
      }
    res.send(req.user);
});

// failure
AuthRouter.get('/auth/callback/failure' , (req  : Request, res : Response) => {
  res.send("Error");
})

export default AuthRouter;