import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mocking some API behavior with local storage for demo
export const examService = {
  getExams: async () => {
    // In a real app: return api.get('/exams');
    const stored = localStorage.getItem('exams_db');
    if (stored) return JSON.parse(stored);
    
    const defaultExams = [
      {
        id: '1',
        title: 'Modern Web Development',
        description: 'Test your knowledge on React 19, Vite, and modern CSS frameworks.',
        duration: 30,
        questions: [
          {
            id: 'q1',
            text: 'What is React 19 primary focus?',
            options: ['Class components', 'Server components & Actions', 'Direct DOM manipulation', 'Styling only'],
            correctAnswer: 1,
          },
          {
            id: 'q2',
            text: 'Which hook is used for side effects in React?',
            options: ['useState', 'useContext', 'useEffect', 'useReducer'],
            correctAnswer: 2,
          }
        ],
        totalMarks: 100,
      }
    ];
    localStorage.setItem('exams_db', JSON.stringify(defaultExams));
    return defaultExams;
  },

  getExamById: async (id: string) => {
    const exams = await examService.getExams();
    return exams.find((e: any) => e.id === id);
  },

  saveResult: async (result: any) => {
    const history = JSON.parse(localStorage.getItem('exam_history') || '[]');
    history.unshift({ ...result, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString() });
    localStorage.setItem('exam_history', JSON.stringify(history));
    return result;
  },

  getHistory: async (userId: string) => {
    const history = JSON.parse(localStorage.getItem('exam_history') || '[]');
    return history.filter((h: any) => h.userId === userId);
  }
};