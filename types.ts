
export type Language = 'en' | 'ar';

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  description: string;
  prerequisites: string[];
  category: 'Major' | 'General' | 'Elective';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  color?: string;
  reasoning?: string;
}

export interface StudentProfile {
  name: string;
  major: string;
  gpa: number;
  completedCredits: number;
  totalCreditsRequired: number;
  completedCourseCodes: string[];
  planFile?: string;
}

export enum Page {
  Auth = 'auth',
  Setup = 'setup',
  Analyzing = 'analyzing',
  Dashboard = 'dashboard',
  Results = 'results',
  StudyPlan = 'studyplan',
  Advisor = 'advisor'
}

export interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

export interface ScheduledCourse extends Course {
  slots: TimeSlot[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SemesterPlan {
  semesterName: string;
  courses: Course[];
}
