import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data } = body; // expect data URL: data:image/png;base64,....
    if (!data) return NextResponse.json({ error: "No data provided" }, { status: 400 });

    const matches = data.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const mime = matches[1];
    const ext = mime.split("/")[1] || "png";
    const buffer = Buffer.from(matches[2], "base64");

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `${uuidv4()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}