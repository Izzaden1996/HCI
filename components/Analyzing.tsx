
import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Search, BrainCircuit, BarChart3, Languages, Filter } from 'lucide-react';
import { Language } from '../types';

// Added AnalyzingProps to fix TS error in App.tsx
interface AnalyzingProps {
  language: Language;
}

const Analyzing: React.FC<AnalyzingProps> = ({ language }) => {
  const [step, setStep] = useState(0);
  const isRtl = language === 'ar';

  const steps = [
    { icon: <Search />, text: isRtl ? 'جاري قراءة مستندك...' : 'Reading your document...' },
    { icon: <Languages />, text: isRtl ? 'جاري اكتشاف اللغة والتعرف الضوئي...' : 'Detecting language and performing OCR...' },
    { icon: <Filter />, text: isRtl ? 'تحديد المساقات المنجزة والساعات المطلوبة...' : 'Identifying completed courses and required credits...' },
    { icon: <BrainCircuit />, text: isRtl ? 'جاري جلب المنهج الدراسي لتخصصك...' : 'Fetching your major-specific curriculum...' },
    { icon: <BarChart3 />, text: isRtl ? 'موازنة المساقات المتبقية حسب الصعوبة...' : 'Balancing remaining courses by difficulty...' },
    { icon: <CheckCircle2 />, text: isRtl ? 'الانتهاء من خريطة الطريق الأكاديمية...' : 'Finalizing your academic roadmap...' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 1500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-left font-sans ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full space-y-12">
        <div className="relative flex justify-center">
          <div className="w-32 h-32 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={40} />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900 text-center">
            {isRtl ? 'الذكاء الاصطناعي يقوم ببناء خطتك الأكاديمية' : 'AI is building your real academic plan'}
          </h1>
          <div className="space-y-4">
            {steps.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                  idx <= step ? 'bg-white shadow-sm opacity-100 border border-indigo-100' : 'opacity-30'
                }`}
              >
                <div className={`${idx < step ? 'text-green-500' : idx === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {idx < step ? <CheckCircle2 size={24} /> : item.icon}
                </div>
                <span className={`text-sm font-medium ${idx === step ? 'text-slate-900' : 'text-slate-500'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzing;
