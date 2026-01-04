
import React, { useState, useEffect } from 'react';
import { MOCK_COURSES } from '../constants';
import { geminiService } from '../services/geminiService';
import { Course, StudentProfile, Language } from '../types';
import { Sparkles, CheckCircle2, MessageCircle, AlertCircle, Info, ChevronRight, Loader2 } from 'lucide-react';

interface ResultsProps {
  student: StudentProfile;
  // Added language prop to fix TS error in App.tsx
  language: Language;
}

const Results: React.FC<ResultsProps> = ({ student, language }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modifying, setModifying] = useState(false);
  const [approved, setApproved] = useState(false);
  const isRtl = language === 'ar';

  const fetchPlan = async (request?: string) => {
    setModifying(true);
    // Fixed: Pass `language` instead of `MOCK_COURSES` as the second argument to match the service signature
    const plan = await geminiService.generateAutomaticPlan(student, language, request);
    setCourses(plan);
    setLoading(false);
    setModifying(false);
  };

  useEffect(() => {
    fetchPlan();
  }, [language]); // Refresh when language changes

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center p-12">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-500 font-medium">{isRtl ? 'جاري تجهيز المقترحات...' : 'Preparing suggestions...'}</p>
    </div>
  );

  const translations = {
    title: isRtl ? 'جدول الفصل المقترح' : 'Suggested Semester Schedule',
    subtitle: isRtl ? `مساقات مختارة بناءً على خطتك ومعدلك (${student.gpa})` : `Courses selected based on your plan and GPA (${student.gpa})`,
    accept: isRtl ? 'قبول الخطة' : 'Accept Plan',
    approved: isRtl ? 'تم اعتماد الخطة' : 'Plan Approved',
    saved: isRtl ? 'تم حفظ الجدول!' : 'Schedule Saved!',
    savedDesc: isRtl ? 'يمكنك الآن المتابعة للتسجيل الرسمي في الجامعة.' : 'You can now proceed to official university registration.',
    recalculating: isRtl ? 'جاري إعادة الحساب...' : 'Recalculating...',
    adjustments: isRtl ? 'تعديلات سريعة' : 'Quick Adjustments',
    lighten: isRtl ? 'تخفيف عبء الفصل' : 'Lighten Semester Load',
    electives: isRtl ? 'إضافة مواد اختيارية سهلة' : 'Add Easy Electives',
    cores: isRtl ? 'التركيز على مواد التخصص' : 'Focus on Major Cores',
    note: isRtl ? 'ملاحظة هامة' : 'Important Note',
    noteDesc: isRtl ? 'هذه التوصيات مبنية على تحليل الذكاء الاصطناعي. يرجى استشارة مرشدك البشري للحالات الحرجة.' : 'These recommendations are based on AI analysis. Please consult your human advisor for critical edge cases.'
  };

  return (
    <div className={`max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${isRtl ? 'font-arabic' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            {translations.title}
            <Sparkles className="text-amber-500" size={28} />
          </h1>
          <p className="text-slate-500 mt-2">{translations.subtitle}</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setApproved(true)}
            className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg ${
              approved ? 'bg-green-600 text-white shadow-green-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
           >
             <CheckCircle2 size={20} />
             {approved ? translations.approved : translations.accept}
           </button>
        </div>
      </div>

      {approved && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-3xl flex items-center gap-4 text-green-800 animate-in zoom-in">
          <CheckCircle2 size={32} />
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <h3 className="font-bold">{translations.saved}</h3>
            <p className="text-sm">{translations.savedDesc}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {modifying && (
            <div className="bg-white/50 backdrop-blur-sm inset-0 z-50 flex items-center justify-center p-12 rounded-3xl border-2 border-dashed border-indigo-200">
               <Loader2 className="animate-spin text-indigo-600 mr-2" /> {translations.recalculating}
            </div>
          )}
          {courses.map((course, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <div className={`flex gap-4 items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Fix difficulty comparison: cast to string to handle localized Arabic values and avoid TS narrowing overlap errors */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    (course.difficulty as string) === 'Hard' || (course.difficulty as string) === 'صعب' ? 'bg-red-50 text-red-600' : 
                    (course.difficulty as string) === 'Moderate' || (course.difficulty as string) === 'متوسط' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {course.code.substring(0, 2)}
                  </div>
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <h4 className="font-bold text-slate-900">{course.code}: {course.name}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      {course.credits} {isRtl ? 'ساعات' : 'Credits'} • {course.difficulty}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`bg-slate-50 rounded-2xl p-4 flex gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                <Info size={16} className="text-indigo-600 shrink-0 mt-1" />
                <p className={`text-sm text-slate-600 italic leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>{course.reasoning}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className={`font-bold text-slate-900 mb-6 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <MessageCircle size={20} className="text-indigo-600" />
              {translations.adjustments}
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => fetchPlan("Lighten the load for this semester")}
                className={`w-full p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all flex items-center justify-between ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                {translations.lighten} <ChevronRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </button>
              <button 
                onClick={() => fetchPlan("Add easy elective courses")}
                className={`w-full p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all flex items-center justify-between ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                {translations.electives} <ChevronRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </button>
              <button 
                onClick={() => fetchPlan("Focus only on core major requirements")}
                className={`w-full p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all flex items-center justify-between ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                {translations.cores} <ChevronRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
            <div className={`flex items-center gap-3 mb-3 text-amber-700 font-bold ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <AlertCircle size={20} /> {translations.note}
            </div>
            <p className={`text-sm text-amber-800 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
              {translations.noteDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
