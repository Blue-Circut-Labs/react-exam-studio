import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Trophy, CheckCircle, XCircle, Home, BarChart3, RefreshCcw, Download, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const Results: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const resultData = JSON.parse(localStorage.getItem(`result_${examId}`) || '{}');
  const { score = 0, correctAnswers = 0, totalQuestions = 0 } = resultData;

  const isPassed = score >= 50;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Decorative background element */}
          <div className={cn(
            "absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20",
            isPassed ? "bg-emerald-500" : "bg-red-500"
          )} />

          <Card className="text-center overflow-hidden border-none shadow-2xl rounded-3xl">
            <div className={cn(
              "h-2",
              isPassed ? "bg-emerald-500" : "bg-red-500"
            )} />
            
            <CardHeader className="pt-16 pb-8 border-none relative z-10">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className={cn(
                  "w-28 h-28 mx-auto rounded-3xl flex items-center justify-center mb-8 shadow-xl",
                  isPassed ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-red-500 text-white shadow-red-200"
                )}
              >
                {isPassed ? <Trophy size={56} /> : <BarChart3 size={56} />}
              </motion.div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
              </h1>
              <p className="text-gray-500 font-medium text-lg">
                You've completed the <span className="text-indigo-600 font-bold">Modern Web Development</span> Assessment
              </p>
            </CardHeader>
            
            <CardContent className="px-8 sm:px-16 pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex flex-col items-center">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Final Score</p>
                  <p className={cn(
                    "text-5xl font-black",
                    isPassed ? "text-emerald-600" : "text-red-600"
                  )}>
                    {Math.round(score)}<span className="text-2xl">%</span>
                  </p>
                </div>
                <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex flex-col items-center">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Correct</p>
                  <p className="text-5xl font-black text-indigo-600">
                    {correctAnswers}<span className="text-2xl text-indigo-300">/{totalQuestions}</span>
                  </p>
                </div>
                <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex flex-col items-center">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Status</p>
                  <p className={cn(
                    "text-3xl font-black uppercase mt-2",
                    isPassed ? "text-emerald-600" : "text-red-600"
                  )}>
                    {isPassed ? 'Passed' : 'Failed'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-w-xl mx-auto">
                <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <CheckCircle size={24} />
                    </div>
                    <span className="font-bold text-gray-700">Accuracy Rate</span>
                  </div>
                  <span className="font-black text-emerald-600 text-xl">{Math.round((correctAnswers/totalQuestions)*100)}%</span>
                </div>

                <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                      <XCircle size={24} />
                    </div>
                    <span className="font-bold text-gray-700">Incorrect Answers</span>
                  </div>
                  <span className="font-black text-red-500 text-xl">{totalQuestions - correctAnswers}</span>
                </div>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto px-10 h-14 rounded-2xl font-bold"
                  onClick={() => navigate('/dashboard')}
                >
                  <Home className="mr-3" size={20} /> Dashboard
                </Button>
                <Button 
                  variant="primary" 
                  className="w-full sm:w-auto px-10 h-14 rounded-2xl font-bold shadow-xl shadow-indigo-100 group"
                  onClick={() => navigate(`/exam/${examId}`)}
                >
                  <RefreshCcw className="mr-3 group-hover:rotate-180 transition-transform duration-500" size={20} /> Retake Exam
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50/50 p-8 flex flex-col sm:flex-row items-center justify-between border-t gap-4">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">
                  <Download size={18} /> Download Certificate
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">
                  <Share2 size={18} /> Share Results
                </button>
              </div>
              <p className="text-gray-400 text-xs font-medium">Exam completed on Feb 20, 2025 • ID: {examId?.substr(0, 8)}</p>
            </CardFooter>
          </Card>
          
          <div className="mt-12 text-center">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f4062c-a7b8-4aa2-8ba5-d29249800c18/success-student-c72ce75d-1772965399301.webp" 
              alt="Success"
              className="w-24 h-24 object-cover rounded-full mx-auto grayscale opacity-50 mb-4"
            />
            <p className="text-gray-400 text-sm italic">
              "Great things are done by a series of small things brought together."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};