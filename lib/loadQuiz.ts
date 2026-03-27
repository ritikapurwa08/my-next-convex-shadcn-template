// lib/loadQuiz.ts
import { readFile, readdir } from "fs/promises";
import path from "path";
import { Question } from "@/types/quiz";

const DATA_DIR = path.join(process.cwd(), "data", "questions");

// सभी Subjects की लिस्ट
export async function getAllSubjects(): Promise<string[]> {
  try {
    const entries = await readdir(DATA_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

// किसी Subject के सभी Topics
export async function getTopics(subject: string): Promise<string[]> {
  try {
    const dir = path.join(DATA_DIR, subject);
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

// किसी Topic के सभी Sets
export async function getSets(subject: string, topic: string): Promise<string[]> {
  try {
    const dir = path.join(DATA_DIR, subject, topic);
    const files = await readdir(dir);
    return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}

// Questions load करना — corrupt JSON safe तरीके से
export async function loadQuestions(
  subject: string,
  topic: string,
  setName: string
): Promise<{ questions: Question[] | null; error: string | null }> {
  try {
    const filePath = path.join(DATA_DIR, subject, topic, `${setName}.json`);
    const raw = await readFile(filePath, "utf-8");
    const questions = JSON.parse(raw) as Question[];
    return { questions, error: null };
  } catch (err) {
    console.error("Failed to load questions:", err);
    return { questions: null, error: "Error Loading Questions" };
  }
}