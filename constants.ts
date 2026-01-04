
import { Course, ScheduledCourse } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    credits: 3,
    description: 'Foundations of programming and computer systems.',
    prerequisites: [],
    category: 'Major',
    difficulty: 'Moderate',
    color: '#6366f1'
  },
  {
    id: '2',
    code: 'MATH150',
    name: 'Calculus I',
    credits: 4,
    description: 'Differentiation and integration of algebraic and transcendental functions.',
    prerequisites: [],
    category: 'General',
    difficulty: 'Hard',
    color: '#ef4444'
  },
  {
    id: '3',
    code: 'CS201',
    name: 'Data Structures',
    credits: 3,
    description: 'Advanced programming techniques and data organization.',
    prerequisites: ['CS101'],
    category: 'Major',
    difficulty: 'Hard',
    color: '#8b5cf6'
  },
  {
    id: '4',
    code: 'ENG101',
    name: 'English Composition',
    credits: 3,
    description: 'Developing writing and analysis skills.',
    prerequisites: [],
    category: 'General',
    difficulty: 'Easy',
    color: '#10b981'
  },
  {
    id: '5',
    code: 'CS250',
    name: 'Web Development',
    credits: 3,
    description: 'Modern web technologies for frontend and backend.',
    prerequisites: ['CS101'],
    category: 'Major',
    difficulty: 'Moderate',
    color: '#f59e0b'
  },
  {
    id: '6',
    code: 'CS310',
    name: 'Algorithms',
    credits: 3,
    description: 'Analysis and design of efficient algorithms.',
    prerequisites: ['CS201', 'MATH150'],
    category: 'Major',
    difficulty: 'Hard',
    color: '#3b82f6'
  }
];

export const SCHEDULE_OPTIONS: ScheduledCourse[] = [
  { ...MOCK_COURSES[2], slots: [{ day: 'Mon', start: '09:00', end: '10:30' }, { day: 'Wed', start: '09:00', end: '10:30' }] },
  { ...MOCK_COURSES[4], slots: [{ day: 'Mon', start: '11:00', end: '12:30' }, { day: 'Wed', start: '11:00', end: '12:30' }] },
  { ...MOCK_COURSES[5], slots: [{ day: 'Tue', start: '10:00', end: '11:30' }, { day: 'Thu', start: '10:00', end: '11:30' }] },
  { ...MOCK_COURSES[1], slots: [{ day: 'Tue', start: '09:00', end: '10:30' }, { day: 'Thu', start: '09:00', end: '10:30' }] },
];

export const MOCK_STUDENT = {
  name: 'Ahmed Al-Farsi',
  major: 'Computer Science',
  gpa: 3.65,
  completedCredits: 10,
  totalCreditsRequired: 120,
  transcript: [
    { courseCode: 'CS101', grade: 'A', semester: 'Fall 2023' },
    { courseCode: 'ENG101', grade: 'B+', semester: 'Fall 2023' },
    { courseCode: 'MATH150', grade: 'A-', semester: 'Spring 2024' }
  ]
};
