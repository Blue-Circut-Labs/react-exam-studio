import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  User as UserIcon, 
  LogOut, 
  Search, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getExams, getResults } from '../lib/mockDb';
import { Exam, ExamResult } from '../lib/types';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'results'>('available');
  const navigate = useNavigate();

  useEffect(() => {
    setExams(getExams());
    setResults(getResults().filter(r => r.userId === user?.id));
  }, [user]);

  const stats = [
    { label: 'Exams Taken', value: results.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg. Score', value: `${results.length > 0 ? Math.round(results.reduce((acc, curr) => acc + (curr.score/curr.totalQuestions)*100, 0) / results.length) : 0}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Time Spent', value: `${Math.round(results.reduce((acc, curr) => acc + curr.timeSpent, 0) / 60)} min`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-2 border-b border-slate-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900">ExamPro</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('available')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'available' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </button>
          <button 
             onClick={() => setActiveTab('results')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'results' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <History className="h-5 w-5" /> My History
          </button>
          {user?.role === 'admin' && (
             <Link 
              to="/admin"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              <ShieldCheck className="h-5 w-5" /> Admin Panel
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 mb-4">
            <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:pl-64 p-4 lg:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}! 👋</h1>
            <p className="text-slate-500">Ready to sharpen your skills today?</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search exams..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
            />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`${stat.bg} p-4 rounded-xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'available' ? (
            <motion.div 
              key="available"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Available Exams</h2>
                <div className="flex gap-2">
                   <button className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Filter</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {exams.map((exam) => {
                  const hasTaken = results.some(r => r.examId === exam.id);
                  return (
                    <motion.div 
                      key={exam.id}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col"
                    >
                      <div className="h-32 bg-slate-100 relative overflow-hidden">
                        <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold ${
                          exam.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : 
                          exam.difficulty === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {exam.difficulty}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                           <BookOpen className="w-24 h-24" />
                        </div>
                      </div>
                      <div className="p-6 flex-grow">
                        <div className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wider">{exam.category}</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{exam.title}</h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{exam.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {exam.duration}m
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" /> {exam.questions.length} Questions
                          </div>
                        </div>
                        
                        <Link 
                          to={`/exam/${exam.id}`}
                          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            hasTaken 
                            ? 'bg-slate-100 text-slate-500 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {hasTaken ? 'Already Completed' : 'Start Exam'}
                          {!hasTaken && <ChevronRight className="h-4 w-4" />}
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Results</h2>
              {results.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No results yet</h3>
                  <p className="text-slate-500">Complete your first exam to see your scores here.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Exam Title</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Score</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {results.map((result) => {
                        const exam = exams.find(e => e.id === result.examId);
                        const percentage = (result.score / result.totalQuestions) * 100;
                        return (
                          <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-900">{exam?.title || 'Unknown Exam'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${percentage >= 70 ? 'text-emerald-600' : percentage >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {result.score}/{result.totalQuestions}
                                </span>
                                <span className="text-xs text-slate-400">({Math.round(percentage)}%)</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {format(new Date(result.completedAt), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${percentage >= 40 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {percentage >= 40 ? 'Passed' : 'Failed'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

export default Dashboard;