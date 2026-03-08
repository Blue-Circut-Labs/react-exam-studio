import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck, Award, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl tracking-tight">ExamPro</span>
            </div>
            <div className="flex gap-4">
              <Link to="/auth" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Login</Link>
              <Link to="/auth?mode=register" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-16">
        <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                  Modern Examination <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Platform</span> for Success.
                </h1>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                  The ultimate web-based solution for educational institutions. Create, manage, and conduct exams with ease and integrity.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link to="/auth" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2 group">
                    Start Your Exam <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-8 text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium">Secure Testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-medium">Instant Results</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-12 lg:mt-0 relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                   <img 
                    src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f4062c-a7b8-4aa2-8ba5-d29249800c18/landing-bg-26072f1f-1772965734720.webp" 
                    alt="University Setting" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-indigo-900/10"></div>
                </div>
                {/* Floating stats card */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 hidden sm:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Exams Completed</p>
                      <p className="text-2xl font-bold text-slate-900">12.5k+</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose ExamPro?</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Built with modern technology to provide the best experience for both examiners and candidates.</p>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'User Friendly', desc: 'Intuitive interface for stress-free exam taking experience.', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'Advanced Analytics', desc: 'Detailed score reports and performance tracking for students.', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
                { title: 'Easy Management', desc: 'Admins can easily create and manage questions with a few clicks.', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-left"
                >
                  <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-6`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p>© 2024 ExamPro Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;