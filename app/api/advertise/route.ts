import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";

type Body = {
  contact: string;
  company?: string;
  message?: string;
};

async function sendWithResend(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing");
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.AD_FROM_EMAIL || `no-reply@${process.env.VERCEL_URL || "localhost"}`,
    to,
    subject,
    html,
  });
}

async function sendWithSMTP(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error("SMTP configuration missing");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.AD_FROM_EMAIL || user,
    to,
    subject,
    html,
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const { contact, company, message } = body;
    if (!contact) return NextResponse.json({ success: false, error: "missing_contact" }, { status: 400 });

    const notifyTo = process.env.AD_NOTIFY_EMAIL;
    if (!notifyTo) return NextResponse.json({ success: false, error: "no_notify_email" }, { status: 500 });

    const subject = `[Advertise] 新廣告申請 from ${contact}`;
    const html = `<p><strong>聯絡：</strong>${contact}</p>
<p><strong>公司/品牌：</strong>${company || "-"}</p>
<p><strong>內容：</strong><pre>${(message || "-")}</pre></p>
<p>送出時間：${new Date().toISOString()}</p>`;

    // Prefer Resend if available, otherwise SMTP
    if (process.env.RESEND_API_KEY) {
      await sendWithResend(notifyTo, subject, html);
    } else {
      await sendWithSMTP(notifyTo, subject, html);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("advertise POST error", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
