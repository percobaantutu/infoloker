const yup = require("yup");

const registerSchema = yup.object({
  name: yup
    .string()
    .required("Full name is required")
    .min(3, "Name must be at least 3 characters")
    .trim(),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .lowercase()
    .trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  role: yup
    .string()
    .oneOf(["jobseeker", "employer"], "Invalid role selection")
    .required("Role is required"),
});

const loginSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required").lowercase().trim(),
  password: yup.string().required("Password is required"),
});

const verifyEmailSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^[0-9]+$/, "OTP must be numeric")
    .length(6, "OTP must be exactly 6 digits"),
});

const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required").lowercase().trim(),
});

const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};