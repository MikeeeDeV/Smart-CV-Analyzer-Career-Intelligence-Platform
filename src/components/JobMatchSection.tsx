import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ArrowLeft, Sparkles, SlidersHorizontal, BookOpen, Building2, Flame, Zap, Lightbulb } from 'lucide-react';
import { CVData, JobMatchAnalysis, Language } from '../types';
import { PRESET_JOBS, PresetJob } from '../data/sampleProfiles';

interface JobMatchSectionProps {
  cvData: CVData;
  matchAnalysis: JobMatchAnalysis | null;
  onAnalyzeJob: (jobTitle: string, jobDescription: string) => Promise<void>;
  isLoading: boolean;
  lang: Language;
  onNavigateToSimulator?: () => void;
  onNavigateToRoadmap?: () => void;
}

export const JobMatchSection: React.FC<JobMatchSectionProps> = ({
  cvData,
  matchAnalysis,
  onAnalyzeJob,
  isLoading,
  lang,
  onNavigateToSimulator,
  onNavigateToRoadmap,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('frontend_dev');
  const [customTitle, setCustomTitle] = useState('Frontend Developer');
  const [customDesc, setCustomDesc] = useState(PRESET_JOBS[0].description);
  const [isCustomMode, setIsCustomMode] = useState(false);

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const handleSelectPreset = (job: PresetJob) => {
    setSelectedPresetId(job.id);
    setCustomTitle(job.title);
    setCustomDesc(job.description);
    setIsCustomMode(false);
  };

  const handleRunAnalysis = async () => {
    await onAnalyzeJob(customTitle, customDesc);
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          label: isAr ? 'أولوية قصوى (ضرورية)' : 'High Priority',
          bg: 'bg-red-900/30 text-red-400 border border-red-500/30',
          icon: Flame,
        };
      case 'medium':
        return {
          label: isAr ? 'أولوية متوسطة (تفضيلية)' : 'Medium Priority',
          bg: 'bg-orange-900/30 text-orange-400 border border-orange-500/30',
          icon: Zap,
        };
      case 'low':
        return {
          label: isAr ? 'أولوية إضافية (ميزة إضافية)' : 'Bonus',
          bg: 'bg-blue-600/10 text-blue-400 border border-blue-500/30',
          icon: Lightbulb,
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Job Selection Card */}
      <div className="ui-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {isAr ? 'مقارنة السيرة الذاتية بإعلان الوظيفة' : 'Job vs CV Gap Analysis'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isAr
                ? 'اختر وظيفة نموذجية أو الصق الوصف الوظيفي لشركة معينة لقياس نسبة المطابقة الحقيقية'
                : 'Select a preset role or paste any real job requirements to compute exact fit %'}
            </p>
          </div>

          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="ui-btn-secondary text-xs px-3.5 py-2 self-start sm:self-auto"
          >
            {isCustomMode ? (isAr ? '← العودة للوظائف المقترحة' : '← Preset Roles') : (isAr ? '✍️ تخصيص إعلان مخصص' : '✍️ Custom Job Description')}
          </button>
        </div>

        {/* Preset Roles Row */}
        {!isCustomMode ? (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              {isAr ? 'الوظائف الشائعة الأكثر طلباً في السوق:' : 'Popular In-Demand Target Roles:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESET_JOBS.map((job) => {
                const isSelected = selectedPresetId === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectPreset(job)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500 shadow-md shadow-blue-600/10'
                        : 'ui-subcard hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="ui-badge-slate text-xs font-mono inline-block mb-2">
                        {job.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{job.company}</span>
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{job.requirements.length} {isAr ? 'متطلبات' : 'reqs'}</span>
                      {isSelected && <span className="text-blue-400 font-bold">✓ {isAr ? 'محدد' : 'Selected'}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Custom Job Input */
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {isAr ? 'المسمى الوظيفي المستهدف (Job Title)' : 'Target Job Title'}
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Frontend Developer, Full Stack Engineer..."
                className="w-full ui-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {isAr ? 'نص إعلان الوظيفة والمتطلبات (Job Description & Requirements)' : 'Job Description & Requirements'}
              </label>
              <textarea
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                rows={5}
                placeholder={isAr ? 'الصق نص متطلبات الوظيفة هنا...' : 'Paste job requirements and qualifications here...'}
                className="w-full ui-input font-mono"
              />
            </div>
          </div>
        )}

        {/* Trigger Button */}
        <div className="flex justify-end pt-2">
          <button
            id="run-match-analysis-btn"
            onClick={handleRunAnalysis}
            disabled={isLoading || !customTitle.trim()}
            className="ui-btn-primary px-5 py-2.5 disabled:opacity-50 text-xs sm:text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isLoading
                ? (isAr ? 'جاري مقارنة السيرة بالوظيفة...' : 'Matching with AI...')
                : (isAr ? `تحليل المطابقة لـ (${customTitle})` : `Analyze Match for ${customTitle}`)}
            </span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {matchAnalysis && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Match Header & Breakdown Card */}
          <div className="ui-card p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
              
              {/* Overall Match Percentage */}
              <div className="flex items-center gap-5 text-center sm:text-start">
                <div className="w-20 h-20 rounded-xl ui-subcard border-blue-500/30 p-1 shadow-md shrink-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-blue-400 font-mono tracking-tight">
                    {matchAnalysis.overallMatch}%
                  </span>
                  <span className="text-xs text-slate-400 font-semibold uppercase">
                    {isAr ? 'المطابقة' : 'Match'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {matchAnalysis.jobTitle}
                    </h3>
                    <span className="ui-badge-blue">
                      {matchAnalysis.jobCompany || 'Target Role'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                    {matchAnalysis.summary}
                  </p>
                </div>
              </div>

              {/* Action Link to Simulator */}
              {onNavigateToSimulator && (
                <button
                  id="match-to-simulator-btn"
                  onClick={onNavigateToSimulator}
                  className="ui-btn-secondary text-xs sm:text-sm shrink-0"
                >
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                  <span>{isAr ? 'تجربة محاكي إضافة المهارات (Simulator)' : 'Try Fit Simulator'}</span>
                </button>
              )}
            </div>

            {/* 4 Match Breakdown Bars */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {[
                { label: isAr ? 'مطابقة المهارات' : 'Skills Match', val: matchAnalysis.skillsMatch, color: 'from-emerald-500 to-teal-400' },
                { label: isAr ? 'مطابقة الخبرات' : 'Experience Match', val: matchAnalysis.experienceMatch, color: 'from-blue-500 to-indigo-400' },
                { label: isAr ? 'مطابقة التعليم' : 'Education Match', val: matchAnalysis.educationMatch, color: 'from-purple-500 to-pink-400' },
                { label: isAr ? 'مطابقة الكلمات' : 'Keywords Match', val: matchAnalysis.keywordsMatch, color: 'from-amber-500 to-yellow-400' },
              ].map((item, idx) => (
                <div key={idx} className="ui-subcard p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{item.label}</span>
                    <span className="font-bold text-white font-mono">{item.val}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side-by-Side: Matched Skills vs Missing Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Matched Skills (Green) */}
            <div className="ui-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {isAr ? 'المهارات المتطابقة والموجودة في سيرتك (Matched)' : 'Matched Skills in Your CV'}
                  </h4>
                </div>
                <span className="ui-badge-emerald font-mono">
                  {matchAnalysis.matchedSkills.length} ✓
                </span>
              </div>

              <p className="text-xs text-slate-400">
                {isAr ? 'هذه المهارات تم العثور عليها وتطابق متطلبات الوظيفة بدقة:' : 'These skills are present in your CV and match the job specification:'}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {matchAnalysis.matchedSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-slate-800/80 rounded-md text-xs px-3 py-1.5 text-slate-200 border border-slate-700 shadow-sm"
                  >
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills (Red/Priority Badges) */}
            <div className="ui-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {isAr ? 'المهارات الناقصة وفجوات القبول (Missing Skills)' : 'Missing Skills & Gaps'}
                  </h4>
                </div>
                <span className="ui-badge-rose font-mono">
                  {matchAnalysis.missingSkills.length} ✗
                </span>
              </div>

              <p className="text-xs text-slate-400">
                {isAr ? 'مهارات مطلوبة في الوظيفة لكنها غير مذكورة في سيرتك، مرتبة حسب الأولوية:' : 'Skills required in the job post but missing from your CV, sorted by priority:'}
              </p>

              <div className="space-y-3 pt-1">
                {matchAnalysis.missingSkills.map((missing, i) => {
                  const badge = getPriorityBadge(missing.priority);
                  const Icon = badge.icon;
                  return (
                    <div
                      key={i}
                      className="ui-subcard p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{missing.name}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md border ${badge.bg}`}>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">
                        {missing.reason}
                      </p>

                      <div className="bg-slate-800/40 p-2.5 rounded-md border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2">
                        <span className="font-bold text-blue-400 shrink-0">💡 {isAr ? 'الإجراء المقترح:' : 'Action:'}</span>
                        <span>{missing.recommendedAction}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Actionable Smart Recommendations Card */}
          {matchAnalysis.recommendations && matchAnalysis.recommendations.length > 0 && (
            <div className="ui-card p-6 space-y-4 border-blue-500/20 bg-blue-600/5">
              <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {isAr ? 'توصيات الذكاء الاصطناعي لرفع فرصة القبول إلى 90%+' : 'Smart AI Recommendations to Hit 90%+ Match'}
                  </h4>
                </div>

                {onNavigateToRoadmap && (
                  <button
                    onClick={onNavigateToRoadmap}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>{isAr ? 'عرض خارطة الطريق الكاملة' : 'View Full Roadmap'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {matchAnalysis.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="ui-subcard p-4 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span className={`text-xs font-semibold uppercase px-2.5 py-0.5 rounded-md inline-block ${
                          rec.urgency === 'high' ? 'bg-red-900/30 text-red-400 border border-red-500/20' : 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {rec.urgency === 'high' ? (isAr ? 'عاجل ومؤثر' : 'High Impact') : (isAr ? 'موصى به' : 'Recommended')}
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-white mt-1">{rec.action}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">{rec.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
