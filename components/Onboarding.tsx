
import React, { useState } from 'react';
import { Page } from '../types';
import { GraduationCap, ArrowLeft, UserCircle, School } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id: '',
    major: 'علوم الحاسوب',
    year: 'سنة ثالثة'
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-2xl font-bold">ادفيز فلو AI</h1>
          <p className="text-indigo-100 text-sm mt-1 font-arabic">نظام الإرشاد الأكاديمي الذكي</p>
        </div>

        <div className="p-8 text-right">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">تسجيل دخول بوابة الطالب</h2>
                <p className="text-slate-500 text-sm">أدخل بياناتك الجامعية لمزامنة سجلك الأكاديمي.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">الرقم الجامعي</label>
                  <div className="relative">
                    <UserCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="مثال: 202100456"
                      className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-right"
                      value={formData.id}
                      onChange={e => setFormData({...formData, id: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">كلمة المرور</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-right"
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                مزامنة البيانات الأكاديمية <ArrowLeft size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              <div>
                <h2 className="text-xl font-bold text-slate-900">تأكيد ملفك الشخصي</h2>
                <p className="text-slate-500 text-sm">لقد جلبنا سجلاتك. هل هذه المعلومات صحيحة؟</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                    <School size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">التخصص الأكاديمي</p>
                    <p className="font-bold text-slate-800">{formData.major}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm font-bold">
                    3.6
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">المعدل الحالي</p>
                    <p className="font-bold text-slate-800">3.65 / 4.00</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-xs text-amber-800 leading-relaxed italic">
                  "رؤية AI: بقي لك 10 ساعات لإنهاء متطلبات الجامعة العامة. لقد جهزت لك خطة مخصصة."
                </p>
              </div>

              <button 
                onClick={onComplete}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                دخول لوحة التحكم
              </button>
              <button 
                onClick={() => setStep(1)}
                className="w-full text-slate-400 text-sm font-medium hover:text-slate-600 text-center"
              >
                ليس حسابك؟ العودة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
