import { NextResponse } from "next/server";

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendFeedbackEmail(params: {
  targetEmail: string;
  name: string;
  email: string;
  message: string;
  pageUrl?: string;
  ip?: string;
}) {
  const { targetEmail, name, email, message, pageUrl, ip } = params;
  const subject = `【意見回饋】${name}`;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const safePageUrl = escapeHtml(pageUrl || "未提供");
  const safeIp = escapeHtml(ip || "未提供");
  const html = `
    <h2>新的網站意見回饋</h2>
    <p><strong>姓名：</strong>${safeName}</p>
    <p><strong>Email：</strong>${safeEmail}</p>
    <p><strong>來源頁面：</strong>${safePageUrl}</p>
    <p><strong>IP：</strong>${safeIp}</p>
    <hr/>
    <p><strong>內容：</strong></p>
    <p>${safeMessage}</p>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.MAIL_FROM || "onboarding@resend.dev";
      const result = await resend.emails.send({
        from,
        to: targetEmail,
        subject,
        html,
        replyTo: email,
      });

      if (!result.error) {
        return { sent: true as const };
      }

      console.error("Resend feedback send error:", result.error);
    } catch (error) {
      console.error("Resend feedback send exception:", error);
    }
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const from = process.env.MAIL_FROM || process.env.SMTP_USER;
      await transporter.sendMail({
        from,
        to: targetEmail,
        subject,
        html,
        replyTo: email,
      });

      return { sent: true as const };
    } catch (error) {
      console.error("SMTP feedback send error:", error);
    }
  }

  return { sent: false as const };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    const pageUrl = String(body?.pageUrl || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Email 格式不正確" }, { status: 400 });
    }

    if (name.length > 80 || email.length > 320 || message.length > 4000) {
      return NextResponse.json({ error: "欄位長度超過限制" }, { status: 400 });
    }

    const targetEmail =
      process.env.FEEDBACK_TO_EMAIL || process.env.MAIL_FROM || process.env.SMTP_USER || "";

    if (!targetEmail) {
      return NextResponse.json(
        { error: "尚未設定回饋收件信箱（FEEDBACK_TO_EMAIL）" },
        { status: 500 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;
    const sendResult = await sendFeedbackEmail({ targetEmail, name, email, message, pageUrl, ip });

    if (!sendResult.sent) {
      return NextResponse.json({ error: "寄送失敗，請稍後再試" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("feedback api error:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
