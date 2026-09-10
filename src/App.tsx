import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { UploadSection } from './components/UploadSection';
import { CVScoreOverview } from './components/CVScoreOverview';
import { ParsedCVViewer } from './components/ParsedCVViewer';
import { JobMatchSection } from './components/JobMatchSection';
import { JobFitSimulator } from './components/JobFitSimulator';
import { AIImprovementSection } from './components/AIImprovementSection';
import { CareerReadinessSection } from './components/CareerReadinessSection';
import { CareerRoadmapSection } from './components/CareerRoadmapSection';
import { InterviewPrepSection } from './components/InterviewPrepSection';
import { AIChatAssistant } from './components/AIChatAssistant';
import { CVData, ScoreBreakdown, JobMatchAnalysis, Language, TabType } from './types';
import {
  SAMPLE_CV_HANEEN,
  SAMPLE_CV_OMAR,
  SAMPLE_SCORE_HANEEN,
  SAMPLE_MATCH_HANEEN,
  PRESET_JOBS,
} from './data/sampleProfiles';
import { Sparkles, Bot, Upload, Target, SlidersHorizontal, Zap, Award, Compass, HelpCircle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [targetJobTitle, setTargetJobTitle] = useState('Frontend Developer');
  const [showChatModal, setShowChatModal] = useState(false);
  const [textToImprove, setTextToImprove] = useState<string | undefined>(undefined);

  // Core CV State
  const [cvData, setCvData] = useState<CVData>(SAMPLE_CV_HANEEN);
  const [scoreData, setScoreData] = useState<ScoreBreakdown>(SAMPLE_SCORE_HANEEN);
  const [matchData, setMatchData] = useState<JobMatchAnalysis | null>(SAMPLE_MATCH_HANEEN);

  // Loading States
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  const isAr = lang === 'ar';

  // Toggle Language Handler
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Load Preset Sample Profiles
  const handleLoadSample = (sampleKey: 'haneen' | 'omar') => {
    if (sampleKey === 'haneen') {
      setCvData(SAMPLE_CV_HANEEN);
      setScoreData(SAMPLE_SCORE_HANEEN);
      setMatchData(SAMPLE_MATCH_HANEEN);
      setTargetJobTitle('Frontend Developer');
    } else {
      setCvData(SAMPLE_CV_OMAR);
      setScoreData({
        overall: 89,
        atsScore: 94,
        contentQuality: 88,
        skillsScore: 92,
        experienceScore: 82,
        formattingScore: 88,
        projectsScore: 90,
        positives: [
          'Strong full-stack stack: React, Node.js, Express, PostgreSQL',
          'Good quantified metric bullets in experience',
          'Clean ATS-compliant two-page structure',
        ],
        negatives: [
          'Add Docker / Kubernetes for senior backend roles',
          'Include testing frameworks (Jest / Supertest)',
        ],
        summaryFeedback: 'Comprehensive full-stack CV with strong backend capabilities and modern tooling.',
      });
      setMatchData(null);
      setTargetJobTitle('Full Stack Developer');
    }
    setActiveTab('dashboard');
  };

  // Upload and Parse CV
  const handleCVUploaded = async (payload: { rawText?: string; fileBase64?: string; fileName?: string } | string) => {
    setIsParsing(true);
    setParsingStep(isAr ? 'جاري استخراج بيانات السيرة الذاتية بدقة...' : 'Extracting CV information...');

    const cvText = typeof payload === 'string' ? payload : (payload.rawText || '');
    const fileBase64 = typeof payload === 'object' ? payload.fileBase64 : undefined;
    const fileName = typeof payload === 'object' ? payload.fileName : undefined;

    try {
      // Step 1: Parse CV from text or binary base64
      const parseRes = await fetch('/api/cv/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText,
          fileBase64,
          fileName,
          lang,
        }),
      });

      const parseJson = await parseRes.json();
      let parsedCV: CVData;

      if (parseJson.success && parseJson.data) {
        parsedCV = {
          ...parseJson.data,
          rawText: parseJson.data.rawText || cvText || (fileName ? `Uploaded file: ${fileName}` : ''),
        };
      } else {
        // Fallback with custom extracted title/text
        parsedCV = {
          ...SAMPLE_CV_HANEEN,
          rawText: cvText || fileName || '',
        };
      }

      // Update Active CV State immediately
      setCvData(parsedCV);

      const candidateTitle = parsedCV.personalInfo?.title || targetJobTitle || 'Software Engineer';
      setTargetJobTitle(candidateTitle);

      setParsingStep(isAr ? 'جاري تقييم التوافق وفحص معايير ATS...' : 'Computing ATS & hiring metrics...');

      // Step 2: Calculate Score specifically for this candidate
      const scoreRes = await fetch('/api/cv/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData: parsedCV,
          targetJobTitle: candidateTitle,
          lang,
        }),
      });

      const scoreJson = await scoreRes.json();
      if (scoreJson.success && scoreJson.data) {
        setScoreData(scoreJson.data);
      }

      // Reset previous job matching data so it recalculates fresh for new candidate
      setMatchData(null);

      // Navigate to Dashboard
      setActiveTab('dashboard');
    } catch (e) {
      console.error('Error handling CV upload:', e);
      // Fallback
      const fallbackCV: CVData = {
        ...SAMPLE_CV_HANEEN,
        rawText: cvText || (typeof payload === 'object' ? payload.fileName : '') || '',
      };
      setCvData(fallbackCV);
      setActiveTab('dashboard');
    } finally {
      setIsParsing(false);
      setParsingStep('');
    }
  };

  // Run Job Match Analysis
  const handleAnalyzeJob = async (jobTitle: string, jobDescription: string) => {
    setIsMatching(true);
    setTargetJobTitle(jobTitle);

    try {
      const matchRes = await fetch('/api/cv/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          jobTitle,
          jobDescription,
          lang,
        }),
      });

      const json = await matchRes.json();
      if (json.success && json.data) {
        setMatchData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsMatching(false);
    }
  };

  // Apply Simulated Skills to CV
  const handleApplySimulatedSkills = (newSkills: string[]) => {
    const updatedTechnical = Array.from(
      new Set([...cvData.skills.technical, ...newSkills])
    );
    const updatedCV = {
      ...cvData,
      skills: {
        ...cvData.skills,
        technical: updatedTechnical,
      },
    };
    setCvData(updatedCV);

    // Update Match if exists
    if (matchData) {
      const remainingMissing = matchData.missingSkills.filter(
        (m) => !newSkills.includes(m.name)
      );
      const updatedMatched = Array.from(new Set([...matchData.matchedSkills, ...newSkills]));
      const newOverall = Math.min(96, matchData.overallMatch + newSkills.length * 6);

      setMatchData({
        ...matchData,
        matchedSkills: updatedMatched,
        missingSkills: remainingMissing,
        overallMatch: newOverall,
        skillsMatch: Math.min(98, matchData.skillsMatch + newSkills.length * 7),
      });
    }

    setActiveTab('dashboard');
  };

  // Apply Bullet Improvement
  const handleApplyImprovement = (original: string, improved: string) => {
    const updatedExp = cvData.experience.map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) => (b === original ? improved : b)),
    }));

    const updatedProj = cvData.projects.map((proj) => {
      if (proj.description === original) {
        return { ...proj, description: improved };
      }
      return proj;
    });

    setCvData({
      ...cvData,
      experience: updatedExp,
      projects: updatedProj,
    });
  };

  const handleOpenImprover = (text: string) => {
    setTextToImprove(text);
    setActiveTab('improver');
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E2E8F0] selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenChat={() => setShowChatModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        
        {/* TAB: Landing Hero (Upload / Overview) */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <LandingHero
              onStartUpload={() => {
                const el = document.getElementById('upload-section-root');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onLoadSample={handleLoadSample}
              lang={lang}
            />

            <div id="upload-section-root">
              <UploadSection
                onCVUploaded={handleCVUploaded}
                onLoadSample={handleLoadSample}
                isLoading={isParsing}
                loadingStep={parsingStep}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* TAB: Main Dashboard (Scores + Extracted Profile + Action Shortcuts) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Quick Action Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0F1117] p-3.5 rounded-2xl border border-slate-800 shadow-lg shadow-black/30">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">{isAr ? 'الملف الحالي:' : 'Active Profile:'}</span>
                <span className="font-medium text-white bg-[#0A0C10] px-2.5 py-1 rounded-lg border border-slate-800">
                  {cvData.personalInfo.name} ({cvData.personalInfo.title})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="dash-match-shortcut"
                  onClick={() => setActiveTab('job_match')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-medium transition-colors"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فحص مطابقة الوظيفة' : 'Job Match'}</span>
                </button>

                <button
                  id="dash-simulator-shortcut"
                  onClick={() => setActiveTab('simulator')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-medium transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{isAr ? 'محاكي القبول' : 'Fit Simulator'}</span>
                </button>

                <button
                  id="dash-improver-shortcut"
                  onClick={() => setActiveTab('improver')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مُحسّن الصياغة (AI)' : 'AI Enhancer'}</span>
                </button>

                <button
                  id="dash-new-cv-btn"
                  onClick={() => setActiveTab('upload')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isAr ? 'رفع سيرة جديدة' : 'Upload New'}</span>
                </button>
              </div>
            </div>

            {/* Score Breakdown Section */}
            <CVScoreOverview
              score={scoreData}
              targetJobTitle={targetJobTitle}
              lang={lang}
              onNavigateToMatch={() => setActiveTab('job_match')}
              onNavigateToImprover={() => setActiveTab('improver')}
            />

            {/* Extracted Profile Viewer */}
            <ParsedCVViewer
              cvData={cvData}
              onUpdateCV={setCvData}
              lang={lang}
              onOpenImprover={handleOpenImprover}
            />

          </div>
        )}

        {/* TAB: Job Match Analysis */}
        {activeTab === 'job_match' && (
          <div className="animate-fade-in">
            <JobMatchSection
              cvData={cvData}
              matchAnalysis={matchData}
              onAnalyzeJob={handleAnalyzeJob}
              isLoading={isMatching}
              lang={lang}
              onNavigateToSimulator={() => setActiveTab('simulator')}
              onNavigateToRoadmap={() => setActiveTab('roadmap')}
            />
          </div>
        )}

        {/* TAB: Fit Simulator */}
        {activeTab === 'simulator' && (
          <div className="animate-fade-in">
            <JobFitSimulator
              cvData={cvData}
              matchAnalysis={matchData}
              onApplySimulatedSkills={handleApplySimulatedSkills}
              lang={lang}
            />
          </div>
        )}

        {/* TAB: AI Bullet Enhancer */}
        {activeTab === 'improver' && (
          <div className="animate-fade-in">
            <AIImprovementSection
              cvData={cvData}
              onApplyImprovement={handleApplyImprovement}
              lang={lang}
              initialText={textToImprove}
            />
          </div>
        )}

        {/* TAB: Career Readiness */}
        {activeTab === 'readiness' && (
          <div className="animate-fade-in">
            <CareerReadinessSection
              cvData={cvData}
              onSelectRecommendedJob={(job) => {
                setTargetJobTitle(job);
                setActiveTab('job_match');
              }}
              lang={lang}
            />
          </div>
        )}

        {/* TAB: Career Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="animate-fade-in">
            <CareerRoadmapSection
              cvData={cvData}
              targetRole={targetJobTitle}
              lang={lang}
            />
          </div>
        )}

        {/* TAB: Interview Preparation */}
        {activeTab === 'interview' && (
          <div className="animate-fade-in">
            <InterviewPrepSection
              cvData={cvData}
              targetRole={targetJobTitle}
              lang={lang}
            />
          </div>
        )}

        {/* TAB: Dedicated Chat Assistant Tab */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <AIChatAssistant
              cvData={cvData}
              targetRole={targetJobTitle}
              lang={lang}
            />
          </div>
        )}

      </main>

      {/* Floating Chat Modal / Drawer (Accessible from any screen) */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="max-w-2xl w-full">
            <AIChatAssistant
              cvData={cvData}
              targetRole={targetJobTitle}
              lang={lang}
              onClose={() => setShowChatModal(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Bottom AI Quick Launcher */}
      {!showChatModal && activeTab !== 'chat' && (
        <button
          id="floating-ai-advisor-launcher"
          onClick={() => setShowChatModal(true)}
          className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all border border-blue-400/30 group"
        >
          <Bot className="w-5 h-5 text-white" />
          <span>{isAr ? 'اسأل المستشار المهني (AI)' : 'Ask AI Career Advisor'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0A0C10] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              CV
            </div>
            <span className="font-semibold text-slate-400">
              Smart CV Analyzer & Career Intelligence Platform
            </span>
          </div>
          <p className="text-slate-400">
            {isAr
              ? 'منصة تحليل السيرة الذاتية بالذكاء الاصطناعي — مدعومة بنماذج Gemini 2.5'
              : 'AI Resume Analytics & Career Roadmap — Powered by Gemini 2.5'}
          </p>
        </div>
      </footer>

    </div>
  );
}
