
import React from 'react';
import { StudentProfile, Language } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, AlertCircle, TrendingUp, Target, ArrowRight, BookOpen } from 'lucide-react';

interface DashboardProps {
  student: StudentProfile;
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ student, language }) => {
  const isRtl = language === 'ar';
  const completionRate = Math.round((student.completedCredits / student.totalCreditsRequired) * 100);
  
  const data = [
    { name: isRtl ? 'ساعات منجزة' : 'Completed Credits', value: student.completedCredits },
    { name: isRtl ? 'ساعات متبقية' : 'Remaining Credits', value: Math.max(0, student.totalCreditsRequired - student.completedCredits) },
  ];
  
  const COLORS = ['#6366f1', '#f1f5f9'];

  const translations = {
    welcome: isRtl ? `مرحباً بك، ${student.name}! 👋` : `Welcome back, ${student.name}! 👋`,
    desc: isRtl 
      ? `تم تحليل ملفك بنجاح. أنت تدرس تخصص ${student.major}. لقد أحرزت تقدماً جيداً بإنهاء ${student.completedCredits} ساعة من أصل ${student.totalCreditsRequired}.` 
      : `Your file has been analyzed successfully. You are pursuing a degree in ${student.major}. You've made great progress completing ${student.completedCredits} credits out of ${student.totalCreditsRequired}.`,
    stats: {
      gpa: isRtl ? 'المعدل التراكمي' : 'Cumulative GPA',
      standing: isRtl ? 'الحالة الأكاديمية' : 'Academic Standing',
      remaining: isRtl ? 'الساعات المتبقية' : 'Credits Remaining'
    },
    standingVal: {
      honors: isRtl ? 'امتياز' : 'Honors',
      good: isRtl ? 'جيد جداً' : 'Good',
      satisfactory: isRtl ? 'مقبول' : 'Satisfactory'
    },
    analysis: isRtl ? 'تحليل مسارك بالذكاء الاصطناعي' : 'AI Path Analysis',
    tip: isRtl ? 'نصيحة التسجيل' : 'Registration Tip',
    grad: isRtl ? 'التخرج المتوقع' : 'Expected Graduation',
    gradVal: isRtl ? 'خلال 4 فصول' : 'In 4 Semesters',
    progress: isRtl ? 'التقدم نحو التخرج' : 'Graduation Progress',
    done: isRtl ? 'منجز' : 'Done',
    left: isRtl ? 'متبقٍ' : 'Left'
  };

  const getStanding = () => {
    if (student.gpa >= 3.5) return translations.standingVal.honors;
    if (student.gpa >= 3.0) return translations.standingVal.good;
    return translations.standingVal.satisfactory;
  };

  return (
    <div className="space-y-8 text-left font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3">{translations.welcome}</h1>
          <p className="text-indigo-100 max-w-xl leading-relaxed">
            {translations.desc}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
             <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 text-center min-w-[140px]">
                <p className="text-[10px] uppercase opacity-70 mb-1">{translations.stats.gpa}</p>
                <p className="text-2xl font-black">{student.gpa.toFixed(2)}</p>
             </div>
             <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 text-center min-w-[140px]">
                <p className="text-[10px] uppercase opacity-70 mb-1">{translations.stats.standing}</p>
                <p className="text-lg font-bold">{getStanding()}</p>
             </div>
             <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 text-center min-w-[140px]">
                <p className="text-[10px] uppercase opacity-70 mb-1">{translations.stats.remaining}</p>
                <p className="text-2xl font-black">{student.totalCreditsRequired - student.completedCredits}</p>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 w-1 h-full bg-indigo-600 transition-all group-hover:w-2 ${isRtl ? 'right-0' : 'left-0'}`}></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Target className="text-indigo-600" size={20} />
              {translations.analysis}
            </h3>
            <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl mb-6">
               <p className="text-indigo-900 text-sm leading-relaxed">
                 {isRtl 
                  ? `بناءً على تخصصك (${student.major}) ومعدلك الحالي، يوصي النظام بالتركيز على مساقات المستوى الثالث هذا الفصل. لقد أكملت جميع المتطلبات التأسيسية.`
                  : `"Based on your major (${student.major}) and current GPA, the system recommends focusing on level-3 courses this semester. You have completed all foundational requirements."`
                 }
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{translations.tip}</p>
                  <p className="text-sm font-bold">15 - 18 {isRtl ? 'ساعة' : 'Credits'}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{translations.grad}</p>
                  <p className="text-sm font-bold">{translations.gradVal}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold mb-6 text-center">{translations.progress}</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-4xl font-black text-indigo-600 leading-none">{completionRate}%</p>
              <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{isRtl ? 'منجز' : 'Completed'}</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-3 bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-400 mb-1">{translations.done}</p>
              <p className="font-bold text-indigo-600">{student.completedCredits} {isRtl ? 'س' : 'cr'}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-400 mb-1">{translations.left}</p>
              <p className="font-bold text-slate-400">{student.totalCreditsRequired - student.completedCredits} {isRtl ? 'س' : 'cr'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
