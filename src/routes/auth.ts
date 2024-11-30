import { deleteProfileController, deleteProfilePicController, forgotPasswordController, getProfileController, refreshTokenController, resetPasswordController, signInController, signOutController, signUpController, updateProfileController, uploadProfilePicController, verifyEmailController, verifyResetPasswordController } from "../controllers/auth";
import { Router } from "express";

// Auth Router
const AuthRouter = Router();
// Routes
AuthRouter.post("/sign-in", async (req, res, next) => {
  try {
    await signInController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/sign-up", async (req, res, next) => {
  try {
    await signUpController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/sign-out", async (req, res, next) => {
  try {
    await signOutController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/refresh-token", async (req, res, next) => {
  try {
    await refreshTokenController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.get("/verify-email", async (req, res, next) => {
  try {
    await verifyEmailController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/forgot-password", async (req, res, next) => {
  try {
    await forgotPasswordController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/reset-password", async (req, res, next) => {
  try {
    await resetPasswordController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/verify-reset-password", async (req, res, next) => {
  try {
    await verifyResetPasswordController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.get("/profile", async (req, res, next) => {
  try {
    await getProfileController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.patch("/profile", async (req, res, next) => {
  try {
    await updateProfileController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.delete("/profile", async (req, res, next) => {
  try {
    await deleteProfileController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.post("/upload-profile-pic", async (req, res, next) => {
  try {
    await uploadProfilePicController(req, res, next);
  } catch (error) {
    next(error);
  }
});
AuthRouter.delete("/delete-profile-pic", async (req, res, next) => {
  try {
    await deleteProfilePicController(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default AuthRouter;