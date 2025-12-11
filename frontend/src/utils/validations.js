import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username required"),
  password: z.string().min(6, "Password must be 6+ chars"),
});

export const registerSchema = loginSchema;
export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "completed"]),
});
