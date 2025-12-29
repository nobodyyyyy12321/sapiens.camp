import { NextResponse } from "next/server";
import { findUserByName, findUserByEmail, saveUser } from "../../../../lib/users";
import bcrypt from "bcryptjs";

async function trySendVerificationEmail(to: string, url: string) {
  // Try to send email via nodemailer if configured; otherwise log and return false
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("Verification URL (no SMTP configured):", url);
      return false;
    }
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    await transporter.sendMail({
      from,
      to,
      subject: "請驗證您的帳號",
      html: `<p>請點擊下方連結完成驗證：</p><p><a href="${url}">${url}</a></p>`,
    });
    return true;
  } catch (err) {
    console.error("send email error:", err);
    console.log("Verification URL:", url);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing name, email or password" }, { status: 400 });
    }

    if (findUserByEmail(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    if (findUserByName(name)) {
      return NextResponse.json({ error: "Name already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      emailVerified: false,
      verificationToken,
      verificationExpires,
    };

    saveUser(user as any);

    const base = process.env.NEXTAUTH_URL || `http://localhost:3000`;
    const verificationUrl = `${base}/api/auth/verify?token=${verificationToken}`;

    const sent = await trySendVerificationEmail(email, verificationUrl);

    return NextResponse.json({ ok: true, userId: user.id, verificationSent: sent, verificationUrl: sent ? undefined : verificationUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
