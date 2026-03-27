// app/api/save-quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { z } from "zod";

// Zod Schema — हर question इसी shape का होना चाहिए
const QuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(5),
  options: z.array(z.string()).min(4),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(10),
});

const SaveQuizSchema = z.object({
  subject: z.string().min(1),   // e.g. "Rajasthan-History"
  topic: z.string().min(1),     // e.g. "Chauhan-Dynasty"
  setName: z.string().min(1),   // e.g. "Chauhan-Dynasty-Part-1"
  questions: z.array(QuestionSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Zod Validation
    const parsed = SaveQuizSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { subject, topic, setName, questions } = parsed.data;

    // Safe path — project root के अंदर ही रहेगा
    const dir = path.join(process.cwd(), "data", "questions", subject, topic);
    await mkdir(dir, { recursive: true }); // फोल्डर न हो तो बना दो

    const filePath = path.join(dir, `${setName}.json`);
    await writeFile(filePath, JSON.stringify(questions, null, 2), "utf-8");

    return NextResponse.json({ success: true, savedTo: filePath });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}