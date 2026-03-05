import { NextResponse } from "next/server";
import { getFirestoreDB } from "@/lib/firebase-admin";

type RawCarQuestion = {
  id?: string | number;
  number?: number;
  question?: string;
  title?: string;
  options?: string[];
  answer?: string | number;
};

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

function stripOptionPrefix(text: string) {
  return text.replace(/^\(\d+\)\s*/, "").trim();
}

function parseInlineOptionsFromQuestion(rawQuestion: string) {
  const markerRegex = /(?:\(|（)\s*[0-9０-９]+\s*(?:\)|）)/g;
  const matches = Array.from(rawQuestion.matchAll(markerRegex));

  if (matches.length < 2) {
    return { title: rawQuestion.trim(), options: [] as string[] };
  }

  const firstMatch = matches[0];
  const title = rawQuestion
    .slice(0, firstMatch.index ?? 0)
    .replace(/[：:]\s*$/, "")
    .trim();

  const options: string[] = [];
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const start = (current.index ?? 0) + current[0].length;
    const end = next ? (next.index ?? rawQuestion.length) : rawQuestion.length;
    const text = rawQuestion
      .slice(start, end)
      .replace(/^[，。、．.\s]+/, "")
      .trim();
    if (text) options.push(text);
  }

  return { title, options };
}

function toAnswerLabel(answer: string | number | undefined, optionsLength: number) {
  if (answer === undefined || answer === null) return "";

  const raw = String(answer).trim();
  if (!raw) return "";

  const upper = raw.toUpperCase();
  if (OPTION_LABELS.includes(upper)) return upper;

  const numericMatch = upper.match(/\d+/);
  if (numericMatch) {
    const oneBasedIndex = Number(numericMatch[0]);
    if (Number.isInteger(oneBasedIndex) && oneBasedIndex > 0 && oneBasedIndex <= optionsLength) {
      return OPTION_LABELS[oneBasedIndex - 1];
    }
  }

  return upper;
}

export async function GET() {
  try {
    const db = getFirestoreDB();
    const snapshot = await db.collection("carQuizQuestions").get();

    const questions = snapshot.docs
      .map((doc) => {
        const data = doc.data() as RawCarQuestion;
        const rawTitle = String(data.question ?? data.title ?? "");
        const rawOptions = Array.isArray(data.options) ? data.options : [];
        const inlineParsed = rawOptions.length === 0 ? parseInlineOptionsFromQuestion(rawTitle) : null;
        const sourceOptions = inlineParsed && inlineParsed.options.length > 0 ? inlineParsed.options : rawOptions;
        const normalizedOptions = sourceOptions.map((text, idx) => ({
          label: OPTION_LABELS[idx] ?? String(idx + 1),
          text: stripOptionPrefix(String(text)),
        }));

        const numberValue =
          typeof data.number === "number"
            ? data.number
            : typeof data.id === "number"
              ? data.id
              : Number(data.id) || 0;

        return {
          id: String(data.id ?? doc.id),
          number: numberValue,
          title: inlineParsed && inlineParsed.options.length > 0 ? inlineParsed.title : rawTitle,
          options: normalizedOptions,
          answer: toAnswerLabel(data.answer, normalizedOptions.length),
        };
      })
      .filter((q) => q.title && q.options.length > 0)
      .sort((a, b) => a.number - b.number)
      .map((q, idx) => ({ ...q, number: q.number > 0 ? q.number : idx + 1 }));

    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch car quiz questions" },
      { status: 500 }
    );
  }
}
