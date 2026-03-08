import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get('mode') === 'register';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, role);
      toast.success('Successfully logged in!');
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error('Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden bg-indigo-900">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f4062c-a7b8-4aa2-8ba5-d29249800c18/auth-bg-829b7d13-1772965734474.webp" 
          alt="Abstract Education" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12 text-white">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6">Master Your Exams</h2>
            <p className="text-lg text-indigo-100 opacity-90 leading-relaxed">
              Join thousands of students who are achieving their goals using our advanced testing platform.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="font-bold text-xl tracking-tight">ExamPro</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isRegister ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-slate-500 mb-8">
            {isRegister ? 'Sign up to start your learning journey.' : 'Enter your credentials to access your dashboard.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                    role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <UserIcon className="h-4 w-4" /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                    role === 'admin' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" /> Admin
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isSubmitting ? 'Processing...' : isRegister ? 'Sign Up' : 'Sign In'}
              {!isSubmitting && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => navigate(`/auth?mode=${isRegister ? 'login' : 'register'}`)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

export default Auth;