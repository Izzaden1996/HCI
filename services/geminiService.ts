
import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, Course, SemesterPlan, Language } from "../types";

export class GeminiService {
  
  private async fileToGenerativePart(file: File) {
    return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.readAsDataURL(file);
    });
  }

  async analyzeTranscript(file: File, lang: Language = 'en'): Promise<Partial<StudentProfile> & { completedCourseCodes: string[], error?: string }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = await this.fileToGenerativePart(file);
    
    const prompt = `
      Analyze the attached image (University Transcript/Plan).
      Extract:
      1. Student Full Name.
      2. Exact Major.
      3. Cumulative GPA.
      4. Total Completed Credits.
      5. Graduation Requirement (Total Credits).
      6. A COMPLETE list of Course Codes that the student has ALREADY PASSED or is currently taking.
      
      Return ONLY a JSON object. IMPORTANT: Translate the 'name' and 'major' fields to ${lang === 'ar' ? 'Arabic' : 'English'}.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [imagePart, { text: prompt }] },
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              major: { type: Type.STRING },
              gpa: { type: Type.NUMBER },
              completedCredits: { type: Type.NUMBER },
              totalCreditsRequired: { type: Type.NUMBER },
              completedCourseCodes: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              error: { type: Type.STRING }
            },
            required: ["completedCourseCodes"]
          }
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (e: any) {
      throw new Error("Analysis failed. Please ensure the image is a clear transcript.");
    }
  }

  async generateAutomaticPlan(student: StudentProfile, lang: Language = 'en', userRequest?: string): Promise<Course[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Student Major: ${student.major}
      Current GPA: ${student.gpa}
      Completed Courses: ${student.completedCourseCodes.join(', ')}
      User Language Preference: ${lang === 'ar' ? 'Arabic' : 'English'}
      
      TASK: Generate a REALISTIC semester plan with 5-6 courses for ${student.major}.
      INSTRUCTIONS:
      1. Use REAL courses standard for this degree.
      2. EXCLUDE completed courses.
      3. Return ALL text fields (name, reasoning, category, difficulty) in ${lang === 'ar' ? 'Arabic' : 'English'}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              name: { type: Type.STRING },
              credits: { type: Type.NUMBER },
              difficulty: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["code", "name", "credits", "difficulty", "reasoning"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  }

  async generateStudyPlan(student: StudentProfile, lang: Language = 'en'): Promise<SemesterPlan[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Generate a 2-semester Degree Roadmap for a ${student.major} student.
      COMPLETED CODES: ${student.completedCourseCodes.join(', ')}
      
      The roadmap should contain REAL courses. 
      IMPORTANT: Return ALL text (semester names, course names, difficulty) in ${lang === 'ar' ? 'Arabic' : 'English'}.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              semesterName: { type: Type.STRING },
              courses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    code: { type: Type.STRING },
                    name: { type: Type.STRING },
                    credits: { type: Type.NUMBER },
                    difficulty: { type: Type.STRING }
                  },
                  required: ["code", "name", "credits", "difficulty"]
                }
              }
            },
            required: ["semesterName", "courses"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  }

  async getAdvisingResponse(prompt: string, student: StudentProfile, lang: Language = 'en') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemPrompt = `
      You are an expert Academic Advisor.
      Student Info: ${student.name}, Major: ${student.major}, GPA: ${student.gpa}.
      Language Preference: ${lang === 'ar' ? 'Arabic' : 'English'}.
      
      Always answer in ${lang === 'ar' ? 'Arabic' : 'English'}.
      Base your advice on the student's actual history and major.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });
    return response.text || (lang === 'ar' ? "عذراً، حدث خطأ." : "Sorry, an error occurred.");
  }
}

export const geminiService = new GeminiService();
