
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage, StudentProfile, Language } from '../types';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

interface AdvisorChatProps {
  student: StudentProfile;
  language: Language;
}

const AdvisorChat: React.FC<AdvisorChatProps> = ({ student, language }) => {
  const isRtl = language === 'ar';
  
  const translations = {
    welcome: isRtl 
      ? `مرحباً ${student.name.split(' ')[0]}! أنا مستشارك الأكاديمي. لقد راجعت خطتك ومعدلك (${student.gpa}). أنت تبلي بلاءً حسناً! هل لديك أي أسئلة حول المواد التي اقترحتها؟`
      : `Hi ${student.name.split(' ')[0]}! I'm your academic advisor. I've reviewed your plan and GPA (${student.gpa}). You're doing great! Do you have any questions about the courses I suggested for this semester?`,
    status: isRtl ? 'متصل وجاهز للمساعدة' : 'Online & Ready to Help',
    reset: isRtl ? 'إعادة تعيين' : 'Reset',
    placeholder: isRtl ? 'اسأل مستشارك...' : 'Ask your advisor...',
    error: isRtl ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى." : "Sorry, an error occurred. Please try again."
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: translations.welcome }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = isRtl ? [
    "لماذا اخترت هذه المواد؟",
    "أريد تسجيل ساعات أكثر",
    "هل يمكنني أخذ فصول صيفية؟",
    "ما هي أصعب مادة هنا؟"
  ] : [
    "Why did you choose these courses?",
    "I want to take more credits",
    "Can I take summer courses?",
    "What is the hardest course here?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const response = await geminiService.getAdvisingResponse(textToSend, student, language);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: translations.error }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative ${isRtl ? 'font-arabic' : 'font-sans'}`}>
      <div className="p-5 bg-indigo-600 text-white flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 relative overflow-hidden">
            <Bot size={24} />
          </div>
          <div className="text-right">
            <h3 className="font-bold flex items-center gap-2">
              {isRtl ? 'مساعد ادفيز فلو' : 'AdviserFlow Assistant'}
              <span className="text-[10px] bg-green-400 text-indigo-900 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">AI</span>
            </h3>
            <p className="text-[10px] opacity-80">{translations.status}</p>
          </div>
        </div>
        <button onClick={() => setMessages([{ role: 'model', text: translations.welcome }])} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white text-xs font-bold">
          {translations.reset}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/20" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? (isRtl ? 'flex-row' : 'flex-row-reverse') : (isRtl ? 'flex-row-reverse' : 'flex-row')}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-slate-100'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-400" size={16} />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-slate-100 p-6">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2" dir={isRtl ? 'rtl' : 'ltr'}>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-medium text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all shadow-sm"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-center bg-slate-100 border border-slate-200 rounded-2xl p-2 group focus-within:bg-white focus-within:shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
          <input 
            type="text" 
            placeholder={translations.placeholder}
            className="flex-1 px-4 py-2 bg-transparent outline-none text-slate-800 text-sm font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
          >
            <Send size={18} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvisorChat;
