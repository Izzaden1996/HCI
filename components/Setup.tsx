
import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2, Sparkles, Languages } from 'lucide-react';
import { Language } from '../types';

interface SetupProps {
  onComplete: (gpa: number, file: File | null) => void;
  language: Language;
}

const Setup: React.FC<SetupProps> = ({ onComplete, language }) => {
  const [gpa, setGpa] = useState<string>('3.5');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isRtl = language === 'ar';

  const translations = {
    title: isRtl ? 'مستقبل الإرشاد الأكاديمي' : 'The Future of Advising',
    subtitle: isRtl ? 'ارفع خطتك الدراسية واترك الباقي للذكاء الاصطناعي' : 'Upload your study plan and leave the rest to AI',
    gpaLabel: isRtl ? 'المعدل التراكمي الحالي' : 'Current Cumulative GPA',
    uploadLabel: isRtl ? 'رفع كشف العلامات (PDF أو صورة)' : 'Upload Transcript (PDF or Image)',
    dropZone: isRtl ? 'اسحب ملفك هنا أو انقر للرفع' : 'Drag your file here or click to upload',
    support: isRtl ? 'يدعم PDF, PNG, JPG (بحد أقصى 10MB)' : 'Supports PDF, PNG, JPG (Max 10MB)',
    submit: isRtl ? 'إنشاء خطة ذكية' : 'Generate Smart Plan'
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-700 ${isRtl ? 'font-arabic' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">{translations.title}</h1>
            <p className="text-indigo-100 opacity-90">{translations.subtitle}</p>
          </div>
          <Sparkles className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} opacity-20`} size={40} />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 block">{translations.gpaLabel}</label>
            <div className="relative">
              <input 
                type="number" 
                step="0.01" 
                max="4" 
                min="0"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-xl font-bold text-indigo-600"
                placeholder="0.00"
              />
              <div className={`absolute ${isRtl ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 text-slate-400 font-bold`}>/ 4.00</div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 block">{translations.uploadLabel}</label>
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
              className={`relative border-2 border-dashed rounded-3xl p-10 transition-all text-center group ${
                isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-slate-50/30 hover:border-indigo-300'
              }`}
            >
              <input 
                type="file" 
                accept=".pdf,image/*"
                onChange={handleFile}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className={`p-4 rounded-2xl mb-4 transition-all ${file ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600 group-hover:scale-110'}`}>
                  {file ? <FileText size={32} /> : <Upload size={32} />}
                </div>
                <h3 className="font-bold text-slate-800">
                  {file ? file.name : translations.dropZone}
                </h3>
                <p className="text-xs text-slate-400 mt-2">{translations.support}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onComplete(parseFloat(gpa), file)}
            disabled={!file}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 disabled:opacity-50"
          >
            {translations.submit} <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setup;
