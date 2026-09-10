import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, FileCheck, TrendingUp, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { ScoreBreakdown, Language } from '../types';

interface CVScoreOverviewProps {
  score: ScoreBreakdown;
  targetJobTitle?: string;
  lang: Language;
  onNavigateToMatch?: () => void;
  onNavigateToImprover?: () => void;
}

export const CVScoreOverview: React.FC<CVScoreOverviewProps> = ({
  score,
  targetJobTitle = 'Frontend Developer',
  lang,
  onNavigateToMatch,
  onNavigateToImprover,
}) => {
  const [showExplainModal, setShowExplainModal] = useState(false);
  const isAr = lang === 'ar';

  // Determine score tier color
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-400 from-emerald-500 to-teal-400 border-emerald-500/40 bg-emerald-500/10';
    if (val >= 65) return 'text-amber-400 from-amber-500 to-yellow-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 from-rose-500 to-red-400 border-rose-500/40 bg-rose-500/10';
  };

  const getScoreBadge = (val: number) => {
    if (val >= 85) return isAr ? 'ممتاز ومؤهل بقوة' : 'Excellent Fit';
    if (val >= 70) return isAr ? 'جيد جداً ويحتاج تحسينات محددة' : 'Strong Profile';
    return isAr ? 'يحتاج إلى تطوير مهارات وإعادة صياغة' : 'Needs Optimization';
  };

  const metricCards = [
    {
      id: 'ats',
      label: isAr ? 'توافق ATS' : 'ATS Compatibility',
      val: score.atsScore,
      desc: isAr ? 'قدرة أنظمة الفرز الآلي للشركات على قراءة السيرة' : 'Applicant tracking system parseability & keywords',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-cyan-500',
    },
    {
      id: 'content',
      label: isAr ? 'جودة المحتوى' : 'Content Quality',
      val: score.contentQuality,
      desc: isAr ? 'قوة الأفعال المستخدمة ووضوح الأدوار' : 'Action verb impact & clarity of achievements',
      icon: FileCheck,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'skills',
      label: isAr ? 'المهارات التقنية' : 'Skills Score',
      val: score.skillsScore,
      desc: isAr ? 'تغطية مهارات السوق الحديثة' : 'Coverage of in-demand market technologies',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'experience',
      label: isAr ? 'الخبرة العملية' : 'Experience Depth',
      val: score.experienceScore,
      desc: isAr ? 'المسؤوليات والنتائج المحققة' : 'Seniority progression and responsibilities',
      icon: Award,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'projects',
      label: isAr ? 'جودة المشاريع' : 'Projects Impact',
      val: score.projectsScore,
      desc: isAr ? 'قيمة المشاريع التطبيقية والتقنيات' : 'Real-world project complexity & tech stack',
      icon: Sparkles,
      color: 'from-teal-500 to-emerald-500',
    },
    {
      id: 'formatting',
      label: isAr ? 'التنسيق والهيكلة' : 'Formatting',
      val: score.formattingScore,
      desc: isAr ? 'تسلسل الأقسام وقابلية القراءة البصرية' : 'Visual hierarchy, typography, and section flow',
      icon: CheckCircle2,
      color: 'from-blue-500 to-indigo-500',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Overall Score & Summary */}
      <div className="ui-card p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left: Score Gauge */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="339.29"
                    strokeDashoffset={339.29 - (339.29 * score.overall) / 100}
                    strokeLinecap="round"
                    className={score.overall >= 80 ? 'text-blue-500 transition-all duration-1000' : 'text-orange-400 transition-all duration-1000'}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white tracking-tight">{score.overall}</span>
                  <span className="text-xs text-slate-500 font-medium">{isAr ? 'من 100' : 'out of 100'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 w-full gap-2 mt-3">
                <div className="ui-subcard p-2.5 text-center">
                  <p className="text-xs text-slate-400 uppercase font-medium">{isAr ? 'تصنيف ATS' : 'ATS Rank'}</p>
                  <p className="text-base font-bold text-emerald-400 font-mono">{score.atsScore}%</p>
                </div>
                <div className="ui-subcard p-2.5 text-center">
                  <p className="text-xs text-slate-400 uppercase font-medium">{isAr ? 'الجودة' : 'Quality'}</p>
                  <p className="text-base font-bold text-blue-400 font-mono">{score.contentQuality}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="ui-badge-blue">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{getScoreBadge(score.overall)}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isAr ? 'التقييم الشامل للسيرة الذاتية (Aggregate Score)' : 'Aggregate CV Score'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                {score.summaryFeedback || (isAr ? 'سيرتك الذاتية ممتازة ومتوافقة، لديك أساس قوي في المتطلبات الأساسية مع فرص واضحة لرفع فرص القبول.' : 'Your CV is well-structured and ATS-compliant with solid fundamentals.')}
              </p>
            </div>
          </div>

          {/* Right: Explain My Score & Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            
            {/* "Why X%?" Explain Button */}
            <button
              id="explain-score-btn"
              onClick={() => setShowExplainModal(true)}
              className="ui-btn-secondary group"
            >
              <HelpCircle className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>{isAr ? `لماذا حصلت على ${score.overall}%؟ (تحليل الأسباب)` : `Why ${score.overall}%? (Explain Score)`}</span>
            </button>

            {onNavigateToMatch && (
              <button
                id="score-to-match-btn"
                onClick={onNavigateToMatch}
                className="ui-btn-primary"
              >
                <span>{isAr ? 'مقارنة مع متطلبات الوظيفة' : 'Compare With Job'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 6 Sub-Scores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="ui-subcard-hover p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-800 text-blue-400 border border-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-200">
                    {card.label}
                  </span>
                </div>
                <span className="text-base sm:text-lg font-bold text-white font-mono">
                  {card.val}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${card.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${card.val}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ATS Intelligence Card */}
      {score.atsDetails && (
        <div className="ui-card p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {isAr ? 'حالة التوافق مع أنظمة الفلترة الآلية (ATS System)' : 'ATS Compatibility Breakdown'}
              </h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                {isAr
                  ? 'تم اجتياز معايير العناوين القياسية، وضوح الترتيب الزمني، وكثافة الكلمات المفتاحية.'
                  : 'Passed standard section header scans, reverse chronological flow & keyword parsing.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-mono text-slate-300">
            <div className="ui-subcard px-3.5 py-2">
              <span className="text-slate-400 text-xs block font-sans uppercase font-medium">{isAr ? 'كثافة الكلمات' : 'Density'}</span>
              <span className="font-bold text-blue-400">{score.atsDetails.keywordDensity}</span>
            </div>
            <div className="ui-subcard px-3.5 py-2">
              <span className="text-slate-400 text-xs block font-sans uppercase font-medium">{isAr ? 'أفعال التأثير' : 'Action Verbs'}</span>
              <span className="font-bold text-emerald-400">{score.atsDetails.actionVerbCount}+</span>
            </div>
            <div className="ui-subcard px-3.5 py-2">
              <span className="text-slate-400 text-xs block font-sans uppercase font-medium">{isAr ? 'اكتمال الأقسام' : 'Completeness'}</span>
              <span className="font-bold text-blue-400">{score.atsDetails.sectionCompleteness}%</span>
            </div>
          </div>
        </div>
      )}

      {/* "Why X%?" Modal Drawer */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="ui-card max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {isAr ? `تفسير الدرجة: لماذا حصلت على ${score.overall}%؟` : `Score Breakdown: Why ${score.overall}%?`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'تحليل دقيق لنقاط القوة المكتشفة والفجوات التي تحتاج لمعالجة' : 'Detailed algorithmic breakdown of strengths and gap areas'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowExplainModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Positives / Strengths */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs tracking-wider uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'نقاط القوة والمزايا في سيرتك الذاتية (+)' : 'Strengths & High-Scoring Areas (+)'}</span>
              </div>
              <div className="space-y-2">
                {score.positives?.map((pos, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#0A0C10] border border-emerald-500/20 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>{pos}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Negatives / Improvement Areas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs tracking-wider uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>{isAr ? 'نقاط التحسين والمهارات المفقودة (-)' : 'Areas Needing Improvement (-)'}</span>
              </div>
              <div className="space-y-2">
                {score.negatives?.map((neg, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#0A0C10] border border-orange-500/20 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="text-orange-400 font-bold font-mono">✗</span>
                    <span>{neg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>

              {onNavigateToImprover && (
                <button
                  onClick={() => {
                    setShowExplainModal(false);
                    onNavigateToImprover();
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-600/20 transition-all"
                >
                  {isAr ? 'الذهاب إلى مُحسّن السيرة الذاتية (AI)' : 'Open AI Enhancer'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
