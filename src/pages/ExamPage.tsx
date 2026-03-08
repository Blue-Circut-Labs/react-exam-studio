import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Exam, Question } from '../types';
import { examService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const ExamPage: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadExam = async () => {
      if (!examId) return;
      const data = await examService.getExamById(examId);
      if (data) {
        setExam(data);
        setTimeLeft(data.duration * 60);
      }
      setLoading(false);
    };
    loadExam();
  }, [examId]);

  const handleSubmit = useCallback(async () => {
    if (!exam || !user) return;
    
    let correctAnswers = 0;
    exam.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / exam.questions.length) * 100;
    
    const result = {
      examId: exam.id,
      userId: user.id,
      score,
      totalQuestions: exam.questions.length,
      correctAnswers,
      answers,
      date: new Date().toISOString()
    };

    await examService.saveResult(result);
    localStorage.setItem(`result_${exam.id}`, JSON.stringify(result));
    toast.success('Examination submitted successfully!');
    navigate(`/results/${exam.id}`);
  }, [answers, exam, user, navigate]);

  useEffect(() => {
    if (!loading && timeLeft <= 0 && exam) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, exam, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleBookmark = (idx: number) => {
    const newBookmarks = new Set(bookmarked);
    if (newBookmarks.has(idx)) newBookmarks.delete(idx);
    else newBookmarks.add(idx);
    setBookmarked(newBookmarks);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>
  );

  if (!exam) return <div className="p-8 text-center">Exam not found</div>;

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Dynamic Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div 
          className="h-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${((Object.keys(answers).length) / exam.questions.length) * 100}%` }}
        />
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-1 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{exam.title}</h1>
            <div className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 uppercase">
              Question {currentQuestionIndex + 1}/{exam.questions.length}
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-xl transition-all",
            timeLeft < 300 ? "text-red-600 bg-red-50 ring-2 ring-red-100" : "text-indigo-600 bg-indigo-50"
          )}>
            <Clock size={20} className={timeLeft < 60 ? "animate-pulse" : ""} />
            {formatTime(timeLeft)}
          </div>

          <div className="hidden sm:flex gap-2">
            <Button variant="danger" size="sm" onClick={() => {
              if (confirm('Are you sure you want to end your exam now?')) handleSubmit();
            }}>
              Finish
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <Card className="sticky top-24">
              <CardHeader className="p-4 border-b">
                <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Navigator</h3>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={cn(
                        "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all relative",
                        currentQuestionIndex === idx 
                          ? "ring-2 ring-indigo-600 ring-offset-2 bg-indigo-600 text-white" 
                          : answers[q.id] !== undefined
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      )}
                    >
                      {idx + 1}
                      {bookmarked.has(idx) && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    <div className="w-3 h-3 bg-indigo-600 rounded" /> Current
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    <div className="w-3 h-3 bg-emerald-500 rounded" /> Answered
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    <div className="w-3 h-3 bg-amber-400 rounded" /> Flagged
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Interface */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-none shadow-md overflow-visible">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                        Single Choice
                      </span>
                      <button 
                        onClick={() => toggleBookmark(currentQuestionIndex)}
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium transition-colors",
                          bookmarked.has(currentQuestionIndex) ? "text-amber-500" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        <Bookmark size={18} fill={bookmarked.has(currentQuestionIndex) ? "currentColor" : "none"} />
                        {bookmarked.has(currentQuestionIndex) ? 'Flagged for Review' : 'Flag Question'}
                      </button>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-snug">
                      {currentQuestion.text}
                    </h2>

                    <div className="space-y-4">
                      {currentQuestion.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => setAnswers({...answers, [currentQuestion.id]: idx})}
                          className={cn(
                            "w-full p-5 text-left rounded-2xl border-2 transition-all group flex items-center justify-between",
                            answers[currentQuestion.id] === idx
                              ? "border-indigo-600 bg-indigo-50/30"
                              : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center gap-5">
                            <span className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg",
                              answers[currentQuestion.id] === idx
                                ? "bg-indigo-600 text-white"
                                : "bg-white border-2 border-gray-100 text-gray-400 group-hover:border-indigo-200 group-hover:text-indigo-600"
                            )}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className={cn(
                              "text-lg",
                              answers[currentQuestion.id] === idx ? "font-bold text-indigo-900" : "text-gray-700 font-medium"
                            )}>
                              {option}
                            </span>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                            answers[currentQuestion.id] === idx ? "border-indigo-600 bg-indigo-600" : "border-gray-200"
                          )}>
                            {answers[currentQuestion.id] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <CardFooter className="p-8 border-t flex items-center justify-between bg-gray-50/50">
                    <Button
                      variant="secondary"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      className="px-6"
                    >
                      <ChevronLeft className="mr-2" size={20} /> Previous
                    </Button>
                    
                    <div className="flex gap-3">
                      {currentQuestionIndex === exam.questions.length - 1 ? (
                        <Button onClick={handleSubmit} className="px-8 shadow-lg shadow-indigo-100">
                          Submit Final Exam <Send className="ml-2" size={18} />
                        </Button>
                      ) : (
                        <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="px-8">
                          Save & Next <ChevronRight className="ml-2" size={20} />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
              <div className="p-2 bg-blue-100 rounded-lg h-fit">
                <AlertCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Important Instructions</h4>
                <ul className="text-sm text-blue-800 space-y-1 opacity-80">
                  <li>• Answers are saved automatically as you navigate.</li>
                  <li>• You can return to any question using the navigator.</li>
                  <li>• Ensure you have a steady internet connection before submitting.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};