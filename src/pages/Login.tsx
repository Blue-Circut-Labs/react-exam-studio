import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { LogIn, ShieldCheck, GraduationCap, Github, Mail, Lock, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Access Denied', {
        description: 'Please provide valid credentials to proceed.',
      });
      return;
    }
    
    login(email, role);
    toast.success(`Welcome back, ${email.split('@')[0]}!`, {
      description: `You are now logged in as a ${role}.`,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden lg:flex flex-col relative bg-indigo-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f4062c-a7b8-4aa2-8ba5-d29249800c18/exam-bg-a75640ba-1772965400455.webp" 
            alt="Decorative Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 p-16 flex flex-col h-full justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl">
              <GraduationCap size={28} />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">EduQuest Pro</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              Unlock Your <span className="text-indigo-200">Potential</span> Through Testing.
            </h2>
            <p className="text-indigo-100 text-lg leading-relaxed opacity-90">
              The world's most advanced online examination platform for modern educational institutions and corporate training.
            </p>
          </div>

          <div className="flex items-center gap-6 text-indigo-200 text-sm font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} /> Secure JWT Auth
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" /> 256-bit Encryption
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" /> Cloud Sync
            </div>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-400 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="max-w-md w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 lg:hidden text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-600 text-white shadow-xl mb-4">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900">EduQuest Pro</h1>
          </motion.div>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Sign In</h2>
            <p className="text-gray-500 font-medium">Enter your credentials to access your portal</p>
          </div>

          <div className="bg-gray-50 p-1.5 rounded-2xl mb-8 flex gap-1">
            <button
              onClick={() => setRole('student')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                role === 'student' 
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <UserIcon size={18} /> Student Portal
            </button>
            <button
              onClick={() => setRole('admin')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                role === 'admin' 
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ShieldCheck size={18} /> Administrator
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Work Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="name@company.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="••••••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1 pb-2">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg accent-indigo-600 border-gray-300" />
              <label htmlFor="remember" className="text-sm font-medium text-gray-500 cursor-pointer">Remember me for 30 days</label>
            </div>

            <Button type="submit" className="w-full py-4 text-lg font-bold shadow-xl shadow-indigo-100 rounded-2xl" size="lg">
              Sign Into Account <LogIn className="ml-2" size={20} />
            </Button>
          </form>

          <div className="mt-8 flex flex-col gap-4">
            <div className="relative flex items-center justify-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white">Or Continue With</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3.5 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors font-bold text-gray-600">
                <Github size={20} /> GitHub
              </button>
              <button className="flex items-center justify-center gap-2 py-3.5 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors font-bold text-gray-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm font-medium text-gray-500">
            Don't have an account? <button className="text-indigo-600 font-bold hover:underline">Create Student Account</button>
          </p>
        </div>
      </div>
    </div>
  );
};