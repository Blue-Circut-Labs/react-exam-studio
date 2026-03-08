import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertCircle,
  Award,
  ArrowLeft,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  BookOpen
} from 'lucide-react';
import { getExams, saveResult } from '../lib/mockDb';
import { Exam, Question } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ExamSession = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<{ score: number, total: number } | null>(null);

  useEffect(() => {
    const exams = getExams();
    const found = exams.find(e => e.id === id);
    if (found) {
      setExam(found);
      setTimeLeft(found.duration * 60);
    }
  }, [id]);

  useEffect(() => {
    let timer: any;
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft]);

  const finishExam = useCallback(() => {
    if (!exam || !user) return;
    
    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const newResult = {
      id: Math.random().toString(36).substr(2, 9),
      examId: exam.id,
      userId: user.id,
      score,
      totalQuestions: exam.questions.length,
      answers,
      completedAt: new Date().toISOString(),
      timeSpent: (exam.duration * 60) - timeLeft
    };

    saveResult(newResult);
    setResult({ score, total: exam.questions.length });
    setIsFinished(true);
    toast.success('Exam submitted successfully!');
  }, [exam, user, answers, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exam) return <div className="p-8">Exam not found...</div>;

  if (isFinished) {
    const scorePercentage = result ? Math.round((result.score / result.total) * 100) : 0;
    const passed = scorePercentage >= 40;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-2xl w-full rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="relative h-48 bg-indigo-600 flex items-center justify-center">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f4062c-a7b8-4aa2-8ba5-d29249800c18/success-illustration-af7fb86b-1772965734825.webp" 
              alt="Success" 
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative text-center text-white">
              <Award className="h-16 w-16 mx-auto mb-2 text-amber-300 drop-shadow-lg" />
              <h2 className="text-3xl font-bold">Exam Results</h2>
            </div>
          </div>

          <div className="p-8 text-center">
             <div className="flex justify-center gap-12 mb-8">
               <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Score</p>
                  <p className="text-4xl font-extrabold text-slate-900">{result?.score} / {result?.total}</p>
               </div>
               <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Percentage</p>
                  <p className="text-4xl font-extrabold text-indigo-600">{scorePercentage}%</p>
               </div>
             </div>

             <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold mb-8 ${
               passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
             }`}>
               {passed ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
               {passed ? 'Passed - Well Done!' : 'Failed - Keep Studying!'}
             </div>

             <div className="space-y-4">
               <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
               >
                 Back to Dashboard
               </button>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white max-w-xl w-full rounded-3xl shadow-xl p-8 border border-slate-200"
        >
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{exam.title}</h1>
          <p className="text-slate-500 mb-8">{exam.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
              <p className="text-xl font-bold text-slate-900">{exam.duration} Minutes</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Questions</p>
              <p className="text-xl font-bold text-slate-900">{exam.questions.length} Items</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
            <div className="text-sm text-amber-800">
              Once you start, the timer will begin. Do not refresh or close the browser window.
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => setIsStarted(true)}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Start Exam
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { if(confirm('Exit exam? Progress will be lost.')) navigate('/dashboard') }}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="font-bold text-slate-900 hidden sm:block">{exam.title}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 ${timeLeft < 300 ? 'border-red-200 bg-red-50 text-red-600' : 'border-indigo-100 bg-indigo-50 text-indigo-700'}`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
            <button 
              onClick={finishExam}
              className="px-6 py-1.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              Submit <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl h-2 border border-slate-200 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / exam.questions.length) * 100}%` }}
            className="h-full bg-indigo-600"
          />
        </div>
        <div className="mt-2 text-xs font-bold text-slate-400 uppercase">
          Question {currentIndex + 1} of {exam.questions.length}
        </div>
      </div>

      {/* Question Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 lg:p-12"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: idx }))}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                    answers[currentQuestion.id] === idx 
                    ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-500/10' 
                    : 'border-slate-100 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    answers[currentQuestion.id] === idx 
                    ? 'border-indigo-600 bg-indigo-600 text-white' 
                    : 'border-slate-200 text-slate-400 group-hover:border-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-lg font-medium ${answers[currentQuestion.id] === idx ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Navigation */}
      <div className="fixed bottom-8 left-0 right-0 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-full shadow-2xl border border-slate-200 p-2 flex items-center justify-between">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="p-3 disabled:opacity-30 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <div className="flex gap-2">
            {exam.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentIndex === idx ? 'bg-indigo-600 scale-125' : 
                  answers[exam.questions[idx].id] !== undefined ? 'bg-indigo-300' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <button 
            disabled={currentIndex === exam.questions.length - 1}
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="p-3 disabled:opacity-30 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSession;