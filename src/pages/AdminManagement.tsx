import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings,
  MoreVertical,
  ChevronRight,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { getExams, saveExam, deleteExam, getResults } from '../lib/mockDb';
import { Exam, Question } from '../lib/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const AdminManagement = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExam, setCurrentExam] = useState<Partial<Exam>>({
    title: '',
    description: '',
    duration: 30,
    category: 'General',
    difficulty: 'Medium',
    questions: []
  });
  const [activeView, setActiveView] = useState<'exams' | 'results'>('exams');

  useEffect(() => {
    setExams(getExams());
  }, []);

  const handleSave = () => {
    if (!currentExam.title || currentExam.questions?.length === 0) {
      toast.error('Please fill in all required fields and add questions');
      return;
    }
    
    const examToSave = {
      ...currentExam,
      id: currentExam.id || Math.random().toString(36).substr(2, 9),
      createdAt: currentExam.createdAt || new Date().toISOString(),
    } as Exam;

    saveExam(examToSave);
    setExams(getExams());
    setIsEditing(false);
    toast.success('Exam saved successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      deleteExam(id);
      setExams(getExams());
      toast.info('Exam deleted');
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setCurrentExam(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">Admin Hub</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveView('exams')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeView === 'exams' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
          >
            <FileText className="h-5 w-5" /> Exams Manager
          </button>
          <button 
            onClick={() => setActiveView('results')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeView === 'results' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
          >
            <BarChart3 className="h-5 w-5" /> Analytics
          </button>
          <Link to="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800/50 mt-12">
            <LayoutDashboard className="h-5 w-5" /> Student View
          </Link>
        </nav>
      </aside>

      <main className="flex-grow pl-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {activeView === 'exams' ? 'Manage Examinations' : 'Performance Analytics'}
            </h1>
            <p className="text-slate-500">Overview of platform activities and content.</p>
          </div>
          {activeView === 'exams' && (
            <button 
              onClick={() => {
                setCurrentExam({ title: '', description: '', duration: 30, category: 'General', difficulty: 'Medium', questions: [] });
                setIsEditing(true);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Plus className="h-5 w-5" /> Create New Exam
            </button>
          )}
        </header>

        {activeView === 'exams' ? (
          <div className="grid grid-cols-1 gap-6">
            {exams.map(exam => (
              <div key={exam.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{exam.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span>{exam.category}</span>
                      <span>•</span>
                      <span>{exam.questions.length} Questions</span>
                      <span>•</span>
                      <span>{exam.duration} mins</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setCurrentExam(exam); setIsEditing(true); }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(exam.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200">
             <div className="text-center py-20">
                <BarChart3 className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Advanced Analytics</h3>
                <p className="text-slate-500">Real-time charts and student performance metrics will appear here.</p>
             </div>
          </div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-8"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                  <h2 className="text-xl font-bold text-slate-900">
                    {currentExam.id ? 'Edit Examination' : 'New Examination'}
                  </h2>
                  <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Exam Title</label>
                      <input 
                        type="text" 
                        value={currentExam.title} 
                        onChange={e => setCurrentExam(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="e.g. Advanced JavaScript"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Category</label>
                      <input 
                        type="text" 
                        value={currentExam.category} 
                        onChange={e => setCurrentExam(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Duration (Minutes)</label>
                      <input 
                        type="number" 
                        value={currentExam.duration} 
                        onChange={e => setCurrentExam(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Difficulty</label>
                      <select 
                        value={currentExam.difficulty}
                        onChange={e => setCurrentExam(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700">Description</label>
                      <textarea 
                        value={currentExam.description} 
                        onChange={e => setCurrentExam(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 h-24"
                      />
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">Questions ({currentExam.questions?.length || 0})</h3>
                      <button 
                        onClick={addQuestion}
                        className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all"
                      >
                        <Plus className="h-4 w-4" /> Add Question
                      </button>
                    </div>

                    <div className="space-y-6">
                      {currentExam.questions?.map((q, qIdx) => (
                        <div key={q.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                          <button 
                            onClick={() => setCurrentExam(prev => ({
                              ...prev,
                              questions: prev.questions?.filter(item => item.id !== q.id)
                            }))}
                            className="absolute -top-2 -right-2 bg-white border border-slate-200 p-1.5 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <div className="space-y-4">
                            <input 
                              type="text" 
                              placeholder={`Question ${qIdx + 1}`}
                              value={q.text}
                              onChange={e => {
                                const newQs = [...(currentExam.questions || [])];
                                newQs[qIdx].text = e.target.value;
                                setCurrentExam(prev => ({ ...prev, questions: newQs }));
                              }}
                              className="w-full bg-white px-4 py-2 border border-slate-200 rounded-lg font-medium"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    name={`correct-${q.id}`} 
                                    checked={q.correctAnswer === optIdx}
                                    onChange={() => {
                                      const newQs = [...(currentExam.questions || [])];
                                      newQs[qIdx].correctAnswer = optIdx;
                                      setCurrentExam(prev => ({ ...prev, questions: newQs }));
                                    }}
                                  />
                                  <input 
                                    type="text" 
                                    placeholder={`Option ${optIdx + 1}`}
                                    value={opt}
                                    onChange={e => {
                                      const newQs = [...(currentExam.questions || [])];
                                      newQs[qIdx].options[optIdx] = e.target.value;
                                      setCurrentExam(prev => ({ ...prev, questions: newQs }));
                                    }}
                                    className="flex-grow bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
                  >
                    Save Exam
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminManagement;