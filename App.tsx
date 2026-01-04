
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Setup from './components/Setup';
import Analyzing from './components/Analyzing';
import Results from './components/Results';
import Dashboard from './components/Dashboard';
import StudyPlan from './components/StudyPlan';
import AdvisorChat from './components/AdvisorChat';
import { Page, StudentProfile, Language } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Auth);
  const [language, setLanguage] = useState<Language>('ar');
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentProfile>({
    name: '',
    major: 'Analyzing...',
    gpa: 0,
    completedCredits: 0,
    totalCreditsRequired: 120,
    completedCourseCodes: []
  });

  // Helper to get stored profile
  const getStoredProfile = (email: string): StudentProfile | null => {
    const data = localStorage.getItem(`profile_${email.toLowerCase()}`);
    return data ? JSON.parse(data) : null;
  };

  // Helper to save profile
  const saveProfile = (email: string, profile: StudentProfile) => {
    localStorage.setItem(`profile_${email.toLowerCase()}`, JSON.stringify(profile));
  };

  const handleAuthComplete = (userData: { name: string; email: string }) => {
    setCurrentUserEmail(userData.email);
    
    // Check if we already have an academic profile for this user
    const savedProfile = getStoredProfile(userData.email);
    
    if (savedProfile) {
      setStudent(savedProfile);
      setCurrentPage(Page.Dashboard); // Skip Setup
    } else {
      setStudent(prev => ({ ...prev, name: userData.name }));
      setCurrentPage(Page.Setup); // Go to Setup for first time
    }
  };

  const handleLogout = () => {
    setStudent({
      name: '',
      major: 'Analyzing...',
      gpa: 0,
      completedCredits: 0,
      totalCreditsRequired: 120,
      completedCourseCodes: []
    });
    setCurrentUserEmail(null);
    setLoadingError(null);
    setCurrentPage(Page.Auth);
  };

  const handleSetupComplete = async (gpa: number, file: File | null) => {
    if (!file || !currentUserEmail) return;

    setCurrentPage(Page.Analyzing);
    setLoadingError(null);

    try {
      const analysisResults = await geminiService.analyzeTranscript(file, language);
      
      const newProfile: StudentProfile = {
        name: analysisResults.name || student.name,
        major: analysisResults.major || 'General Degree',
        gpa: analysisResults.gpa || gpa,
        completedCredits: analysisResults.completedCredits || 0,
        totalCreditsRequired: analysisResults.totalCreditsRequired || 120,
        completedCourseCodes: analysisResults.completedCourseCodes || [],
        planFile: file.name
      };

      setStudent(newProfile);
      saveProfile(currentUserEmail, newProfile); // Save for future logins
      setCurrentPage(Page.Dashboard);
    } catch (error: any) {
      console.error(error);
      setLoadingError(error.message || "An unexpected error occurred during analysis.");
      
      setTimeout(() => {
        setCurrentPage(Page.Setup);
      }, 3000);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.Auth:
        return <Auth onAuthComplete={handleAuthComplete} language={language} setLanguage={setLanguage} />;
      case Page.Setup:
        return (
          <>
            {loadingError && (
              <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
                <div className="bg-red-50 border border-red-200 px-6 py-4 rounded-2xl text-red-700 text-sm font-bold shadow-xl flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  {loadingError}
                </div>
              </div>
            )}
            <Setup onComplete={handleSetupComplete} language={language} />
          </>
        );
      case Page.Analyzing:
        return <Analyzing language={language} />;
      case Page.Dashboard:
        return <Dashboard student={student} language={language} />;
      case Page.Results:
        return <Results student={student} language={language} />;
      case Page.StudyPlan:
        return <StudyPlan student={student} language={language} />;
      case Page.Advisor:
        return <AdvisorChat student={student} language={language} />;
      default:
        return <Dashboard student={student} language={language} />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage} 
      onLogout={handleLogout}
      studentName={student.name}
      language={language}
      setLanguage={setLanguage}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
