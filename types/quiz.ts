export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type QuestionStatus = "unvisited" | "answered" | "review" | "skipped";

export interface QuestionState {
  status: QuestionStatus;
  selectedOption: string | null;
}

export interface QuizState {
  questions: Question[];
  questionStates: QuestionState[];
  currentIndex: number;
  timeLeft: number; // seconds
  isSubmitted: boolean;
}

export interface QuizResult {
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  questionStates: QuestionState[];
  questions: Question[];
}