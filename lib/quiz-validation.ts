export interface RawInputQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
  explanation?: string;
}

export function validateInput(
  parsed: unknown,
):
  | { valid: true; questions: RawInputQuestion[] }
  | { valid: false; error: string } {
  if (!Array.isArray(parsed))
    return { valid: false, error: "Root must be a JSON array [ ... ]" };
  if (parsed.length === 0)
    return { valid: false, error: "Array must not be empty" };
  for (let i = 0; i < parsed.length; i++) {
    const q = parsed[i] as Record<string, unknown>;
    if (!q.question || typeof q.question !== "string")
      return {
        valid: false,
        error: `Question ${i + 1}: 'question' field is required`,
      };
    if (!Array.isArray(q.options) || q.options.length !== 4)
      return {
        valid: false,
        error: `Question ${i + 1}: 'options' must be an array of exactly 4 strings`,
      };
    if (
      (q.options as unknown[]).some(
        (o) => typeof o !== "string" || !(o as string).trim(),
      )
    )
      return {
        valid: false,
        error: `Question ${i + 1}: all 4 options must be non-empty strings`,
      };
    const ans = (q.correctAnswer ?? q.answer) as string | undefined;
    if (!ans)
      return {
        valid: false,
        error: `Question ${i + 1}: 'correctAnswer' or 'answer' is required`,
      };
    if (!(q.options as string[]).includes(ans))
      return {
        valid: false,
        error: `Question ${i + 1}: correctAnswer "${ans}" must match one of the options`,
      };
  }
  return { valid: true, questions: parsed as RawInputQuestion[] };
}
