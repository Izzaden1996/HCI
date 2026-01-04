
import React from 'react';
import { Page, Language } from '../types';
import { 
  GraduationCap, 
  LayoutDashboard, 
  MessageSquareQuote, 
  LogOut, 
  CalendarRange, 
  CheckSquare,
  Languages
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  studentName?: string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  setCurrentPage, 
  onLogout, 
  studentName,
  language,
  setLanguage
}) => {
  const isMinimalistPage = [Page.Auth, Page.Setup, Page.Analyzing].includes(currentPage);
  const isRtl = language === 'ar';

  const translations = {
    nav: {
      dashboard: isRtl ? 'لوحة التحكم' : 'Dashboard',
      results: isRtl ? 'خطة الفصل' : 'Semester Plan',
      studyPlan: isRtl ? 'خريطة الدرجة' : 'Degree Roadmap',
      advisor: isRtl ? 'المستشار الذكي' : 'AI Advisor',
      logout: isRtl ? 'تسجيل الخروج' : 'Logout'
    },
    appTitle: isRtl ? 'ادفيز فلو AI' : 'AdviserFlow AI'
  };

  if (isMinimalistPage) {
    return (
      <div className="min-h-screen bg-slate-50" dir={isRtl ? 'rtl' : 'ltr'}>
        {children}
      </div>
    );
  }

  const navItems = [
    { id: Page.Dashboard, icon: <LayoutDashboard size={20} />, label: translations.nav.dashboard },
    { id: Page.Results, icon: <CheckSquare size={20} />, label: translations.nav.results },
    { id: Page.StudyPlan, icon: <CalendarRange size={20} />, label: translations.nav.studyPlan },
    { id: Page.Advisor, icon: <MessageSquareQuote size={20} />, label: translations.nav.advisor },
  ];

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'ST';
  };

  return (
    <div className={`flex h-screen bg-slate-50 overflow-hidden ${isRtl ? 'font-arabic' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`w-64 bg-white border-slate-200 flex flex-col shadow-sm relative z-20 ${isRtl ? 'border-l' : 'border-r'}`}>
        <div className="p-6 flex items-center gap-3 bg-indigo-600 text-white">
          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-lg font-bold">{translations.appTitle}</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPage === item.id 
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button 
              onClick={() => setLanguage(isRtl ? 'en' : 'ar')}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all text-sm font-medium"
            >
              <Languages size={18} />
              <span>{isRtl ? 'English Version' : 'النسخة العربية'}</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200 shadow-sm uppercase">
              {getInitials(studentName || 'SA')}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{studentName || 'Student Name'}</p>
              <p className="text-[10px] text-slate-400 truncate">{isRtl ? 'سنة 3 • تخصص' : 'Year 3 • Major'}</p>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={18} />
            <span>{translations.nav.logout}</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative bg-[#fbfcfe]">
        <div className="max-w-6xl mx-auto h-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
