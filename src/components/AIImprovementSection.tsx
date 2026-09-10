import React, { useState } from 'react';
import { Zap, Sparkles, Copy, Check, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Layers, CheckCircle2, MessageSquare } from 'lucide-react';
import { CVData, Language } from '../types';

interface AIImprovementSectionProps {
  cvData: CVData;
  onApplyImprovement: (original: string, improved: string) => void;
  lang: Language;
  initialText?: string;
}

export const AIImprovementSection: React.FC<AIImprovementSectionProps> = ({
  cvData,
  onApplyImprovement,
  lang,
  initialText,
}) => {
  const [inputText, setInputText] = useState(
    initialText || 'Worked on website development and fixed bugs.'
  );
  const [selectedRole, setSelectedRole] = useState(cvData.personalInfo.title || 'Frontend Developer');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const [result, setResult] = useState<{
    before: string;
    improved: string;
    improvedArabic?: string;
    improvementsMade: string[];
    missingElementsAdded: string[];
  } | null>(null);

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const samplePresets = [
    {
      label: isAr ? 'مثال 1: تطوير موقع (عام)' : 'Preset 1: Basic Web Dev',
      text: 'Worked on website development.',
    },
    {
      label: isAr ? 'مثال 2: مشروع التخرج / جامعي' : 'Preset 2: University Project',
      text: 'I made a university website for students to register.',
    },
    {
      label: isAr ? 'مثال 3: ربط APIs' : 'Preset 3: API Integration',
      text: 'Connected APIs to the frontend and handled data.',
    },
    {
      label: isAr ? 'مثال 4: متجر إلكتروني' : 'Preset 4: E-Commerce UI',
      text: 'Built e-commerce UI with shopping cart.',
    },
  ];

  const handleEnhance = async (textToUse = inputText) => {
    if (!textToUse.trim()) return;
    setIsEnhancing(true);
    setApplied(false);

    try {
      const response = await fetch('/api/cv/improve-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: textToUse,
          role: selectedRole,
          lang,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setResult(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = isAr && result.improvedArabic ? result.improvedArabic : result.improved;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (!result) return;
    onApplyImprovement(
      result.before,
      isAr && result.improvedArabic ? result.improvedArabic : result.improved
    );
    setApplied(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#0F1117] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isAr ? 'مُحسّن صياغة بنود ومشاريع السيرة بالذكاء الاصطناعي' : 'AI Resume & Project Bullet Enhancer'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isAr
                ? 'حوّل الجمل البسيطة إلى إنجازات قوية مدعومة بالأرقام والكلمات المفتاحية المطلوبة في شركات التكنولوجيا'
                : 'Transform weak, passive bullet points into high-impact, metric-driven achievements'}
            </p>
          </div>
        </div>

        {/* Quick Presets Row */}
        <div className="pt-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">
            {isAr ? 'أو اختر من الأمثلة الشائعة لتجربة الصياغة الفورية:' : 'Or try a common resume sample:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(preset.text);
                  handleEnhance(preset.text);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0A0C10] hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="mt-5 space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            {isAr ? 'أدخل الجملة أو وصف المشروع الحالي:' : 'Enter original bullet point or project description:'}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder={isAr ? 'مثال: عملت على موقع الجامعة وسجلت الطلاب...' : 'e.g. Worked on website development.'}
            className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{isAr ? 'الوظيفة المستهدفة:' : 'Target Role:'}</span>
              <input
                type="text"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-[#0A0C10] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              id="improve-bullet-btn"
              onClick={() => handleEnhance(inputText)}
              disabled={isEnhancing || !inputText.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all"
            >
              {isEnhancing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isEnhancing ? (isAr ? 'جاري إعادة الصياغة...' : 'Rewriting...') : (isAr ? '✨ تحسين الصياغة بالذكاء الاصطناعي' : '✨ Enhance with AI')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Before vs After Comparison Card */}
      {result && (
        <div className="bg-[#0F1117] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>{isAr ? 'المقارنة: قبل وبعد التحسين' : 'Before & After Impact Comparison'}</span>
            </h3>
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              {isAr ? 'ATS + Impact Optimized' : 'ATS + Impact Optimized'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Before Box */}
            <div className="bg-[#0A0C10] border border-red-500/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {isAr ? 'قبل التحسين (صياغة ضعيفة / عامة)' : 'Before (Weak / Vague)'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">❌ {isAr ? 'تفتقر للأرقام والتقنيات' : 'No metrics'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 bg-[#0F1117] p-3.5 rounded-lg border border-slate-800 italic font-mono">
                "{result.before}"
              </p>
            </div>

            {/* After Box */}
            <div className="bg-[#0A0C10] border border-blue-500/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  {isAr ? 'النسخة المحسنة بالذكاء الاصطناعي (AI Improved)' : 'AI Improved Version'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">✓ {isAr ? 'أرقام + تقنيات + دور' : 'High Impact'}</span>
              </div>
              
              <p className="text-xs sm:text-sm text-white bg-[#0F1117] p-3.5 rounded-lg border border-blue-500/20 leading-relaxed font-semibold">
                "{result.improved}"
              </p>

              {result.improvedArabic && isAr && (
                <div className="pt-2 text-xs text-blue-300 bg-blue-950/20 p-2.5 rounded-lg border border-blue-900/30">
                  <span className="text-[10px] text-slate-400 block mb-0.5">{isAr ? 'الترجمة الاحترافية بالعربية:' : 'Arabic:'}</span>
                  "{result.improvedArabic}"
                </div>
              )}
            </div>

          </div>

          {/* Breakdown of What Was Added */}
          <div className="bg-[#0A0C10] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-300 block mb-1">
              {isAr ? 'ما الذي أضافه الذكاء الاصطناعي لرفع قوة الجملة؟' : 'Key Enhancements Applied:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {result.improvementsMade?.map((imp, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px]">{imp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions: Copy & Apply */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ النص' : 'Copy')}</span>
            </button>

            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-md shadow-blue-600/20 transition-all"
            >
              {applied ? <Check className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4" />}
              <span>{applied ? (isAr ? 'تم التطبيق في سيرتك!' : 'Applied to CV!') : (isAr ? 'تطبيق هذا التحسين في سيرتي' : 'Apply to My CV')}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
