import type z from "zod";
import type {
  deleteAccountRequest,
  loginRequest,
  oauthCompleteProfileRequest,
  registerRequest,
  resetPasswordRequest,
  updateEmailRequest,
  updatePasswordRequest,
} from "./auth.validation";

export type RegisterRequest = z.infer<typeof registerRequest>;

export type LoginRequest = z.infer<typeof loginRequest>;

export type UpdateEmailRequest = z.infer<typeof updateEmailRequest>;

export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequest>;

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequest>;

export type DeleteAccountRequest = z.infer<typeof deleteAccountRequest>;

export type OAuthCompleteProfileRequest = z.infer<typeof oauthCompleteProfileRequest>;
