
import * as z from "zod";

// Schema for registration form validation
export const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["tenant", "agent", "landlord", "admin"], {
    required_error: "Please select a role.",
  }),
  adminCode: z.string().optional(),
}).refine((data) => {
  // If role is admin, adminCode is required
  if (data.role === "admin") {
    return !!data.adminCode;
  }
  return true;
}, {
  message: "Admin registration code is required",
  path: ["adminCode"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
