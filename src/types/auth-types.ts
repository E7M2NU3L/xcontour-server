import { LoginSchema, RegisterSchema } from "../schemas/auth-schemas";
import z from "zod";

export type SignInTypes = z.infer<typeof LoginSchema>;
export type SignUpTypes = z.infer<typeof RegisterSchema>;