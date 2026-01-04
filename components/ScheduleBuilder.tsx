
import React, { useState, useMemo } from 'react';
import { SCHEDULE_OPTIONS } from '../constants';
import { ScheduledCourse, TimeSlot } from '../types';
import { AlertTriangle, CheckCircle2, Trash2, Calendar, Clock, Sparkles } from 'lucide-react';

const ScheduleBuilder: React.FC = () => {
  const [selectedCourses, setSelectedCourses] = useState<ScheduledCourse[]>([]);

  const daysMap: Record<string, string> = {
    'Sun': 'الأحد',
    'Mon': 'الاثنين',
    'Tue': 'الثلاثاء',
    'Wed': 'الأربعاء',
    'Thu': 'الخميس'
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'] as const;
  const hours = Array.from({ length: 9 }, (_, i) => `${i + 8}:00`);

  const conflicts = useMemo(() => {
    const allSlots: { slot: TimeSlot, course: string }[] = [];
    const foundConflicts: string[] = [];

    selectedCourses.forEach(course => {
      course.slots.forEach(slot => {
        const conflict = allSlots.find(s => 
          s.slot.day === slot.day && 
          ((slot.start >= s.slot.start && slot.start < s.slot.end) ||
           (slot.end > s.slot.start && slot.end <= s.slot.end))
        );
        if (conflict) {
          foundConflicts.push(`تضارب ${course.code} مع مادة ${conflict.course}`);
        }
        allSlots.push({ slot, course: course.code });
      });
    });
    return foundConflicts;
  }, [selectedCourses]);

  const toggleCourse = (course: ScheduledCourse) => {
    if (selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const getSlotStyle = (start: string, end: string) => {
    const startHour = parseInt(start.split(':')[0]);
    const startMin = parseInt(start.split(':')[1]);
    const endHour = parseInt(end.split(':')[0]);
    const endMin = parseInt(end.split(':')[1]);
    
    const top = (startHour - 8) * 60 + startMin;
    const height = (endHour - startHour) * 60 + (endMin - startMin);
    
    return {
      top: `${top}px`,
      height: `${height}px`
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500" dir="rtl">
      {/* Sidebar: Course Selection */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-right">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600" />
            الشعب المقترحة
          </h3>
          <div className="space-y-3">
            {SCHEDULE_OPTIONS.map(course => {
              const isSelected = selectedCourses.find(c => c.id === course.id);
              return (
                <button
                  key={course.id}
                  onClick={() => toggleCourse(course)}
                  className={`w-full text-right p-4 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                      : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm uppercase">{course.code}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                      {course.credits} ساعة
                    </span>
                  </div>
                  <p className="text-xs font-medium mb-2 truncate">{course.name}</p>
                  <div className="flex flex-wrap gap-1 justify-start">
                    {course.slots.map((s, i) => (
                      <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-indigo-500' : 'bg-slate-50'}`}>
                        {daysMap[s.day]} {s.start}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conflicts Box */}
        {conflicts.length > 0 && (
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 animate-in slide-in-from-top-4 text-right">
            <h4 className="text-red-600 font-bold text-sm flex items-center gap-2 mb-2">
              <AlertTriangle size={16} /> تضارب مكتشف
            </h4>
            <ul className="space-y-1">
              {conflicts.map((c, i) => (
                <li key={i} className="text-[11px] text-red-800 font-medium">• {c}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedCourses.length > 0 && conflicts.length === 0 && (
          <div className="bg-green-50 p-6 rounded-3xl border border-green-100 animate-in slide-in-from-top-4 text-right">
            <h4 className="text-green-600 font-bold text-sm flex items-center gap-2 mb-1">
              <CheckCircle2 size={16} /> جدول مثالي
            </h4>
            <p className="text-[11px] text-green-800">مجموع الساعات لهذا الفصل هو {selectedCourses.reduce((acc, c) => acc + c.credits, 0)} ساعة. تم التحقق بواسطة AI.</p>
          </div>
        )}
      </div>

      {/* Main: Weekly Calendar View */}
      <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <button className="text-xs font-bold text-indigo-600 hover:underline">مسح الكل</button>
          <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
             جدول خريف 2024 المقترح <Calendar size={18} />
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[600px] flex flex-row-reverse">
            {/* Time Column */}
            <div className="w-20 shrink-0 border-l border-slate-100">
              <div className="h-10 border-b border-slate-100 bg-slate-50"></div>
              {hours.map(h => (
                <div key={h} className="h-[60px] border-b border-slate-50 flex items-start justify-center pt-2">
                  <span className="text-[10px] font-bold text-slate-400">{h}</span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {days.map(day => (
              <div key={day} className="flex-1 border-l border-slate-100 relative min-h-[540px]">
                <div className="h-10 border-b border-slate-100 bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-500 uppercase tracking-widest">
                  {daysMap[day]}
                </div>
                
                {/* Horizontal Guide Lines */}
                {hours.map(h => (
                  <div key={h} className="h-[60px] border-b border-slate-50 w-full"></div>
                ))}

                {/* Scheduled Items */}
                {selectedCourses.map(course => (
                  course.slots.filter(s => s.day === day).map((slot, i) => (
                    <div
                      key={`${course.id}-${i}`}
                      className="absolute left-1 right-1 rounded-xl p-2 text-white shadow-md z-10 transition-all border border-white/20 overflow-hidden text-right"
                      style={{
                        ...getSlotStyle(slot.start, slot.end),
                        backgroundColor: course.color || '#6366f1'
                      }}
                    >
                      <p className="text-[10px] font-black leading-tight mb-0.5">{course.code}</p>
                      <p className="text-[9px] font-medium opacity-90 truncate">{course.name}</p>
                    </div>
                  ))
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-start gap-3">
          <button 
            disabled={selectedCourses.length === 0 || conflicts.length > 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            إرسال للاعتماد
          </button>
          <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-100 transition-all">
            حفظ كمسودة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBuilder;
