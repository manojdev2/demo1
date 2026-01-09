"use strict";

import nodemailer from "nodemailer";
import { DatabaseError } from "./errors";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !smtpFrom) {
    throw new DatabaseError("SMTP configuration is missing", {
      context: {
        function: "getTransporter",
        required: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"],
      },
    });
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: parseInt(smtpPort, 10) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const emailTransporter = getTransporter();
    const smtpFrom = process.env.SMTP_FROM;

    if (!smtpFrom) {
      throw new DatabaseError("SMTP_FROM is not configured", {
        context: { function: "sendEmail" },
      });
    }

    await emailTransporter.sendMail({
      from: smtpFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""),
    });
  } catch (error) {
    const msg = "Failed to send email";
    throw new DatabaseError(msg, {
      context: { function: "sendEmail", to: options.to },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_TRUST_HOST || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Reset Your Password - Anentaa</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                      Reset Your Password
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                      Hello,
                    </p>
                    <p style="margin: 0 0 20px; color: #555555; font-size: 16px;">
                      We received a request to reset the password for your Anentaa account. If you made this request, click the button below to create a new password.
                    </p>
                    
                    <!-- CTA Button -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                      <tr>
                        <td align="center" style="padding: 0;">
                          <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 20px; color: #666666; font-size: 14px; border-top: 1px solid #e5e5e5; padding-top: 20px;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 0 0 30px; padding: 12px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all; color: #667eea; font-size: 13px; font-family: 'Courier New', monospace;">
                      ${resetUrl}
                    </p>
                    
                    <!-- Security Notice -->
                    <div style="margin: 30px 0; padding: 16px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                      <p style="margin: 0 0 8px; color: #856404; font-size: 14px; font-weight: 600;">
                        ⚠️ Security Notice
                      </p>
                      <p style="margin: 0; color: #856404; font-size: 13px;">
                        This password reset link will expire in <strong>1 hour</strong> for your security. If you didn&apos;t request a password reset, please ignore this email and your password will remain unchanged.
                      </p>
                    </div>
                    
                    <p style="margin: 30px 0 0; color: #888888; font-size: 14px;">
                      If you continue to have problems, please contact our support team.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 13px; text-align: center;">
                      This email was sent by <strong>Anentaa</strong>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                      © ${new Date().getFullYear()} Anentaa. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `
Reset Your Password - Anentaa

Hello,

We received a request to reset the password for your Anentaa account. If you made this request, use the link below to create a new password.

Reset Password: ${resetUrl}

This password reset link will expire in 1 hour for your security. If you didn't request a password reset, please ignore this email and your password will remain unchanged.

If you continue to have problems, please contact our support team.

---
This email was sent by Anentaa
© ${new Date().getFullYear()} Anentaa.ai by Krossark. All rights reserved.
  `;

  await sendEmail({
    to: email,
    subject: "Reset Your Anentaa Password",
    html,
    text,
  });
}


