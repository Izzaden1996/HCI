
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { SemesterPlan, StudentProfile, Language } from '../types';
import { Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface StudyPlanProps {
  student: StudentProfile;
  language: Language;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ student, language }) => {
  const [plans, setPlans] = useState<SemesterPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRtl = language === 'ar';

  const translations = {
    title: isRtl ? `خريطة الدرجة لـ ${student.name.split(' ')[0]}` : `Degree Roadmap for ${student.name.split(' ')[0]}`,
    badge: isRtl ? 'محسن بالذكاء الاصطناعي' : 'AI Optimized',
    subtitle: isRtl ? `تمت موازنة المساقات بناءً على معدلك التراكمي (${student.gpa}).` : `Courses balanced based on your cumulative GPA (${student.gpa}).`,
    regenerate: isRtl ? 'تحديث المسار' : 'Regenerate Path',
    analyzing: isRtl ? 'نقوم بتحليل مسارك الأكاديمي...' : 'Analyzing your academic path...',
    analyzingDesc: isRtl ? 'نحن نختار المساقات لضمان أفضل نتيجة ممكنة للمعدل.' : 'We are selecting courses to ensure the best possible GPA outcome.',
    creditsTotal: isRtl ? 'إجمالي الساعات' : 'Credits Total',
    empty: isRtl ? 'لم يتم إنشاء خطة بعد.' : 'No plan generated yet.',
    tryNow: isRtl ? 'حاول الآن' : 'Try generating now'
  };

  const generateNewPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await geminiService.generateStudyPlan(student, language);
      if (Array.isArray(result)) {
        setPlans(result);
      } else {
        setPlans([]);
        setError(isRtl ? "تلقينا صيغة غير صالحة من المستشار. يرجى المحاولة مرة أخرى." : "Received an invalid format from the advisor. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError(isRtl ? "فشل إنشاء خريطة الدرجة. يرجى التحقق من اتصالك." : "Failed to generate your degree roadmap. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (plans.length === 0) {
      generateNewPlan();
    }
  }, [language]); // Regenerate when language changes to match content

  const safePlans = Array.isArray(plans) ? plans : [];

  return (
    <div className="space-y-8 h-full flex flex-col pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {translations.title}
            <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{translations.badge}</span>
          </h2>
          <p className="text-slate-500">{translations.subtitle}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={generateNewPlan}
            disabled={loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 text-sm font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
            {translations.regenerate}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-300">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
          <h3 className="text-xl font-bold text-slate-800">{translations.analyzing}</h3>
          <p className="text-slate-500 max-w-sm text-center mt-2">{translations.analyzingDesc}</p>
        </div>
      ) : safePlans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {safePlans.map((sem, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{sem.semesterName}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                    {Array.isArray(sem.courses) ? sem.courses.reduce((acc, c) => acc + (c.credits || 0), 0) : 0} {translations.creditsTotal}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {Array.isArray(sem.courses) && sem.courses.map((course: any, cIdx: number) => (
                  <div key={cIdx} className="space-y-2">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className={`w-1.5 h-10 rounded-full shrink-0 ${
                          course.difficulty === 'Hard' || course.difficulty === 'صعب' ? 'bg-red-400' : 
                          course.difficulty === 'Moderate' || course.difficulty === 'متوسط' ? 'bg-amber-400' : 'bg-green-400'
                        }`} />
                       <div className="flex-1">
                          <p className="font-bold text-slate-800 text-sm">{course.code}: {course.name}</p>
                          <p className="text-[10px] text-slate-400">{course.credits} {isRtl ? 'ساعات' : 'Credits'} • {course.difficulty}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-300">
          <h3 className="text-lg font-bold text-slate-400">{translations.empty}</h3>
          <button onClick={generateNewPlan} className="text-indigo-600 font-bold hover:underline mt-2">{translations.tryNow}</button>
        </div>
      )}
    </div>
  );
};

export default StudyPlan;
