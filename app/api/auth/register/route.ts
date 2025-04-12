import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/prisma";
import { emailTransporter } from "../../core";

export const POST = async (request: NextRequest) => {
  const { name, email, password, otp, checkOtpCode } = await request.json();
  // console.log({ name, email, password, otp, checkOtpCode });

  const existingUser = await prisma.user.findUnique({
    where: { email: email as string },
  });

  if (existingUser) {
    return new NextResponse("Error : User already exists!", { status: 400 });
  }
  let otpCode = checkOtpCode || "";

  if (otp.trim() == "") {
    otpCode = Math.floor(100000 + Math.random() * 9000);
    const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
      <div style="background-color: #f8f8f8; padding: 15px; text-align: center; border-bottom: 1px solid #eaeaea;">
      <h2 style="color: #333; margin: 0;">Email Verification</h2>
      </div>
      <div style="padding: 20px;">
      <p style="color: #555; font-size: 16px;">Hello ${name},</p>
      <p style="color: #555; font-size: 16px;">Thank you for registering with BusyBrain Task. To complete your registration, please use the verification code below:</p>
      <div style="background-color: #f5f5f5; padding: 12px; text-align: center; margin: 15px 0; border-radius: 4px;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333;">${otpCode}</span>
      </div>
      <p style="color: #555; font-size: 16px;">This code will expire shortly. If you did not request this verification, please disregard this email.</p>
      </div>
      <div style="padding: 15px; text-align: center; font-size: 14px; color: #777; border-top: 1px solid #eaeaea;">
      <p>© ${new Date().getFullYear()} BusyBrain Task. All rights reserved.</p>
      </div>
    </div>
    `;

    await emailTransporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "BusyBrain Task - Verify Email",
      text: "Email Verification",
      html: body,
    });

    return new NextResponse(
      JSON.stringify({
        message: "Otp has been sent to your email for verification.",
        data: otpCode,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // console.log(otp, " -> ", checkOtpCode);

  if (otp == checkOtpCode) {
    const hashPassword = await bcrypt.hash(password, 5);

    try {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          emailVerified: new Date(),
          role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return new NextResponse("User Registered successfully!", {
        status: 200,
      });
    } catch (error) {
      return new NextResponse("Internal Server Error : " + error);
    }
  } else {
    return new NextResponse("Error: Invalid OTP", { status: 400 });
  }
};
