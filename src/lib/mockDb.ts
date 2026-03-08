import { Exam, ExamResult, Question } from './types';

const INITIAL_EXAMS: Exam[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Test your knowledge on core React concepts like hooks, props, and state.',
    duration: 15,
    category: 'Frontend',
    difficulty: 'Medium',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        text: 'What is the correct way to update state in React?',
        options: ['this.state = {}', 'useState() and its setter', 'Directly modifying variables', 'Using document.getElementById'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'Which hook is used for side effects?',
        options: ['useMemo', 'useCallback', 'useEffect', 'useReducer'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: '2',
    title: 'CSS Masterclass',
    description: 'Deep dive into Grid, Flexbox, and modern CSS selectors.',
    duration: 10,
    category: 'Design',
    difficulty: 'Hard',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q3',
        text: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 2
      }
    ]
  }
];

export const getExams = (): Exam[] => {
  const saved = localStorage.getItem('exams');
  if (!saved) {
    localStorage.setItem('exams', JSON.stringify(INITIAL_EXAMS));
    return INITIAL_EXAMS;
  }
  return JSON.parse(saved);
};

export const saveExam = (exam: Exam) => {
  const exams = getExams();
  const existingIndex = exams.findIndex(e => e.id === exam.id);
  if (existingIndex > -1) {
    exams[existingIndex] = exam;
  } else {
    exams.push(exam);
  }
  localStorage.setItem('exams', JSON.stringify(exams));
};

export const deleteExam = (id: string) => {
  const exams = getExams().filter(e => e.id !== id);
  localStorage.setItem('exams', JSON.stringify(exams));
};

export const saveResult = (result: ExamResult) => {
  const results = getResults();
  results.push(result);
  localStorage.setItem('exam_results', JSON.stringify(results));
};

export const getResults = (): ExamResult[] => {
  const saved = localStorage.getItem('exam_results');
  return saved ? JSON.parse(saved) : [];
};