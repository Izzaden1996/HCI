
import React, { useState } from 'react';
import { MOCK_COURSES } from '../constants';
import { Search, Filter, BookOpen, Clock, Info } from 'lucide-react';

const CourseCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_COURSES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const difficultyMap: Record<string, string> = {
    'Easy': 'سهل',
    'Moderate': 'متوسط',
    'Hard': 'صعب'
  };

  const categoryMap: Record<string, string> = {
    'Major': 'تخصص',
    'General': 'جامعة',
    'Elective': 'اختياري'
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ابحث عن مساق بالاسم أو الرمز..."
            className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-sm font-medium shadow-sm">
            <Filter size={18} /> تصفية
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-md">
            طلب استثناء (Override)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-indigo-300 transition-all shadow-sm group text-right">
            <div className={`h-2 ${
              course.difficulty === 'Hard' ? 'bg-red-400' : 
              course.difficulty === 'Moderate' ? 'bg-amber-400' : 'bg-green-400'
            }`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">
                  {categoryMap[course.category]}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs">
                  <Clock size={14} /> {course.credits} ساعات
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{course.code}: {course.name}</h4>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{course.description}</p>
              
              <div className="mt-6 flex flex-wrap gap-2 justify-start">
                {course.prerequisites.length > 0 ? (
                  course.prerequisites.map(pre => (
                    <span key={pre} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      متطلب: {pre}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    بدون متطلبات سابقة
                  </span>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 py-2 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                  تفاصيل المساق
                </button>
                <button className="px-3 py-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-lg">
                  <Info size={18} />
                </button>
              </div>
              <p className="mt-2 text-[10px] font-bold text-slate-400">مستوى الصعوبة: {difficultyMap[course.difficulty]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCatalog;
