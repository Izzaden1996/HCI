
import React, { useState, useEffect } from 'react';
import { GraduationCap, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Languages } from 'lucide-react';
import { Language } from '../types';

interface AuthProps {
  onAuthComplete: (userData: { name: string; email: string }) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete, language, setLanguage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRtl = language === 'ar';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const translations = {
    title: isRtl ? 'ادفيز فلو AI' : 'AdviserFlow AI',
    subtitle: isRtl ? 'إرشاد أكاديمي ذكي في كل خطوة' : 'Intelligent Academic Advising at every step',
    login: isRtl ? 'تسجيل الدخول' : 'Login',
    signup: isRtl ? 'إنشاء حساب' : 'Sign Up',
    fullName: isRtl ? 'الاسم الكامل' : 'Full Name',
    emailLabel: isRtl ? 'البريد الإلكتروني الجامعي' : 'University Email',
    passwordLabel: isRtl ? 'كلمة المرور' : 'Password',
    forgot: isRtl ? 'نسيت كلمة المرور؟' : 'Forgot password?',
    loginBtn: isRtl ? 'دخول الآن' : 'Login Now',
    signupBtn: isRtl ? 'إنشاء الحساب' : 'Create Account',
    trust: isRtl ? 'موثوق من قبل +50 جامعة' : 'Trusted by 50+ Universities',
    errorNoUser: isRtl ? 'لم يتم العثور على حساب بهذا البريد.' : 'No account found with this email.',
    errorPass: isRtl ? 'كلمة المرور غير صحيحة.' : 'Incorrect password.',
    errorExists: isRtl ? 'هذا البريد مسجل مسبقاً.' : 'This email is already registered.'
  };

  useEffect(() => {
    setError(null);
  }, [isLogin]);

  const getUsers = (): StoredUser[] => {
    const data = localStorage.getItem('adviserflow_users');
    return data ? JSON.parse(data) : [];
  };

  const saveUser = (user: StoredUser) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('adviserflow_users', JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      const users = getUsers();
      if (isLogin) {
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!foundUser) {
          setError(translations.errorNoUser);
          setLoading(false);
          return;
        }
        if (foundUser.password !== password) {
          setError(translations.errorPass);
          setLoading(false);
          return;
        }
        setLoading(false);
        onAuthComplete({ name: foundUser.name, email: foundUser.email });
      } else {
        const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
          setError(translations.errorExists);
          setLoading(false);
          return;
        }
        const newUser = { name, email, password };
        saveUser(newUser);
        setLoading(false);
        onAuthComplete({ name: newUser.name, email: newUser.email });
      }
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden ${isRtl ? 'font-arabic' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Language Switcher Top Right/Left */}
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
        <button 
          onClick={() => setLanguage(isRtl ? 'en' : 'ar')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-indigo-600 shadow-sm hover:shadow-md transition-all"
        >
          <Languages size={18} />
          {isRtl ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100/50 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-600 p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
              <GraduationCap size={36} />
            </div>
            <h1 className="text-2xl font-bold mb-1">{translations.title}</h1>
            <p className="text-indigo-100 text-sm opacity-90">{translations.subtitle}</p>
          </div>
          <Sparkles className="absolute top-4 right-4 opacity-20" size={32} />
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {translations.login}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {translations.signup}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase mx-1">{translations.fullName}</label>
                <div className="relative">
                  <User className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRtl ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase mx-1">{translations.emailLabel}</label>
              <div className="relative">
                <Mail className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase mx-1">{translations.passwordLabel}</label>
              <div className="relative">
                <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm`}
                />
              </div>
            </div>

            {isLogin && (
              <div className={isRtl ? 'text-left' : 'text-right'}>
                <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">{translations.forgot}</button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? translations.loginBtn : translations.signupBtn}
                  <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 text-slate-400 text-xs justify-center">
              <CheckCircle2 size={14} className="text-green-500" />
              <span>{translations.trust}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
