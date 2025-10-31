import {z} from "zod";

export const signInSchema = z.object({
  email: z.email({message: "Invalid email"})
    .min(1, {message: "Email is required"}),
  password: z.string()
    .min(1, {message: "Password is required"})
    .min(6, {message: "Password must be more than 6 characters"})
    .max(32, {message: "Password must be less than 32 characters"})
});