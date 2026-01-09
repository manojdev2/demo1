"use strict";
"use server";
import { AuthError } from "next-auth";
import { signIn, signOut } from "../auth";
import { delay } from "@/utils/delay";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { DatabaseError, ValidationError } from "@/lib/errors";
import { randomBytes } from "crypto";
const bcrypt = require("bcryptjs");

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    delay(1000);
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/signin" });
}

export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return {
        success: true,
        message: "If an account exists with that email, a password reset link has been sent.",
      };
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      },
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return {
      success: true,
      message: "If an account exists with that email, a password reset link has been sent.",
    };
  } catch (error) {
    const msg = "Failed to process password reset request";
    throw new DatabaseError(msg, {
      context: { function: "requestPasswordReset", email },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!token || !newPassword) {
      return {
        success: false,
        message: "Token and password are required",
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid or expired reset token. Please request a new password reset link.",
      };
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return {
        success: false,
        message: "The new password must be different from your current password. Please choose a different password.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return {
      success: true,
      message: "Password has been reset successfully. You can now sign in with your new password.",
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        message: error.message,
      };
    }
    
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string; message?: string };
      if (prismaError.code === "P2002") {
        return {
          success: false,
          message: "An error occurred while updating your password. Please try again.",
        };
      }
    }
    
    return {
      success: false,
      message: "Failed to reset password. Please try again later.",
    };
  }
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!name || !email || !password) {
      throw new ValidationError("Name, email, and password are required", {
        context: { function: "signup" },
      });
    }

    if (name.length < 2) {
      throw new ValidationError("Name must be at least 2 characters long", {
        context: { function: "signup" },
      });
    }

    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long", {
        context: { function: "signup" },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ValidationError("An account with this email already exists", {
        context: { function: "signup", email: normalizedEmail },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully! You can now sign in.",
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        message: error.message,
      };
    }
    
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string; message?: string };
      if (prismaError.code === "P2002") {
        return {
          success: false,
          message: "An account with this email already exists",
        };
      }
    }
    
    return {
      success: false,
      message: "Failed to create account. Please try again later.",
    };
  }
}
