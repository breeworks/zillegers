import { z } from "zod";

export const AuthSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email().optional(), // optional for signin
  preferredLanguages: z.string().optional()
});
