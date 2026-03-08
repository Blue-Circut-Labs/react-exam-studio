export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  totalMarks: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  date: string;
  answers: Record<string, number>;
}