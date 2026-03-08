export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
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
  duration: number; // minutes
  questions: Question[];
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
  completedAt: string;
  timeSpent: number; // seconds
}