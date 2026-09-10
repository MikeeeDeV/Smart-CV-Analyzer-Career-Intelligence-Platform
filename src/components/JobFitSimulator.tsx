import React, { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, Sparkles, TrendingUp, Check, AlertCircle, ArrowRight, ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CVData, JobMatchAnalysis, Language } from '../types';

interface JobFitSimulatorProps {
  cvData: CVData;
  matchAnalysis: JobMatchAnalysis | null;
  onApplySimulatedSkills: (newSkills: string[]) => void;
  lang: Language;
}

export const JobFitSimulator: React.FC<JobFitSimulatorProps> = ({
  cvData,
  matchAnalysis,
  onApplySimulatedSkills,
  lang,
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const initialSkillsToSimulate = useMemo(() => {
    if (!matchAnalysis) {
      return [
        { id: 'ts', name: 'TypeScript', weight: 8, checked: false, desc: isAr ? 'كتابة أنواع ثابتة مع React' : 'Type safety & React interfaces' },
        { id: 'api', name: 'REST APIs & Fetching', weight: 6, checked: false, desc: isAr ? 'ربط ومعالجة البيانات الحية' : 'Asynchronous API integration' },
        { id: 'test', name: 'Testing (Jest / RTL)', weight: 5, checked: false, desc: isAr ? 'اختبار المكونات والوظائف' : 'Unit & Component Testing' },
        { id: 'perf', name: 'Web Performance Metrics', weight: 4, checked: false, desc: isAr ? 'تحسين Core Web Vitals' : 'Core Web Vitals & Optimization' },
      ];
    }

    return matchAnalysis.missingSkills.map((m, idx) => ({
      id: `sim_${idx}`,
      name: m.name,
      weight: m.priority === 'high' ? 8 : m.priority === 'medium' ? 5 : 3,
      checked: false,
      desc: m.reason,
    }));
  }, [matchAnalysis, isAr]);

  const [simulatedSkills, setSimulatedSkills] = useState(initialSkillsToSimulate);
  const [includeMetrics, setIncludeMetrics] = useState(false);
  const [includeProject, setIncludeProject] = useState(false);

  useEffect(() => {
    setSimulatedSkills(initialSkillsToSimulate);
  }, [initialSkillsToSimulate]);

  const baseScore = matchAnalysis?.overallMatch || 68;

  // Calculate estimated simulated score
  const estimatedScore = useMemo(() => {
    let added = 0;
    simulatedSkills.forEach((s) => {
      if (s.checked) added += s.weight;
    });
    if (includeMetrics) added += 4;
    if (includeProject) added += 6;

    return Math.min(98, baseScore + added);
  }, [baseScore, simulatedSkills, includeMetrics, includeProject]);

  const scoreDelta = estimatedScore - baseScore;

  const toggleSkill = (id: string) => {
    setSimulatedSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const handleApply = () => {
    const selected = simulatedSkills.filter((s) => s.checked).map((s) => s.name);
    if (selected.length > 0) {
      onApplySimulatedSkills(selected);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#0F1117] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isAr ? 'محاكي القبول والـ What-If Fit' : 'Interactive Fit Simulator'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'كم ستصبح نسبة قبولك إذا أضفت المهارات الناقصة؟' : 'What If You Add Missing Skills to Your CV?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              {isAr
                ? 'جرب تفعيل المهارات الناقصة وشاهد كيف تقفز نسبة المطابقة فورياً بالأرقام التقديرية.'
                : 'Toggle missing skills and see real-time score projection for your target role.'}
            </p>
          </div>

          {/* Real-time score comparison gauge */}
          <div className="flex items-center gap-4 bg-[#0A0C10] p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center px-3">
              <span className="text-xs text-slate-500 block font-medium mb-0.5">
                {isAr ? 'المطابقة الحالية' : 'Current'}
              </span>
              <span className="text-2xl font-bold text-slate-400 font-mono">
                {baseScore}%
              </span>
            </div>

            <div className="text-blue-400 font-bold text-lg">→</div>

            <div className="text-center px-3 bg-blue-600/10 rounded-lg p-2 border border-blue-500/30">
              <span className="text-xs text-blue-300 block font-bold mb-0.5 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>{isAr ? 'النسبة التقديرية' : 'Estimated'}</span>
              </span>
              <span className="text-3xl font-bold text-blue-400 font-mono">
                {estimatedScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Missing Skills Toggles */}
        <div className="lg:col-span-2 bg-[#0F1117] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-400" />
              <span>{isAr ? 'اختر المهارات التي تنوي تعلمها وإضافتها:' : 'Select Skills to Simulate Adding:'}</span>
            </h3>
            <span className="text-xs text-blue-400 font-mono font-bold">
              +{scoreDelta}% {isAr ? 'زيادة متوقعة' : 'boost'}
            </span>
          </div>

          <div className="space-y-2.5">
            {simulatedSkills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  skill.checked
                    ? 'bg-blue-600/10 border-blue-500/60 shadow-sm'
                    : 'bg-[#0A0C10] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                      skill.checked
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'border-slate-700 bg-slate-800 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {skill.name}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {skill.desc}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded-md bg-blue-600/10 text-blue-400 border border-blue-500/20 shrink-0">
                  +{skill.weight}%
                </span>
              </div>
            ))}
          </div>

          {/* Extra Enhancers */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              {isAr ? 'تحسينات إضافية على المحتوى:' : 'Additional Content Optimizations:'}
            </span>

            <div
              onClick={() => setIncludeProject(!includeProject)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                includeProject
                  ? 'bg-emerald-600/10 border-emerald-500/60'
                  : 'bg-[#0A0C10] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border ${
                    includeProject
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  {includeProject && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {isAr ? 'إضافة مشروع عملي متقدم بالتقنيات المطلوبة (React + TS + API)' : 'Add full-scale Capstone project (React + TS + API)'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'يثبت قدرتك على التطبيق الفعلي للمهارات' : 'Demonstrates production-grade capability'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">+6%</span>
            </div>

            <div
              onClick={() => setIncludeMetrics(!includeMetrics)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                includeMetrics
                  ? 'bg-emerald-600/10 border-emerald-500/60'
                  : 'bg-[#0A0C10] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border ${
                    includeMetrics
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  {includeMetrics && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {isAr ? 'صياغة الخبرات بالأرقام والنسب المئوية (Google X-Y-Z Formula)' : 'Quantify bullet points with percentages and metrics'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'مثل: تسريع التحميل بنسبة 35% وزيادة التفاعل' : 'e.g. 35% speedup, 10k+ requests handled'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">+4%</span>
            </div>
          </div>
        </div>

        {/* Right Col: Simulation Summary & Apply */}
        <div className="bg-[#0F1117] border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-lg shadow-black/30">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              {isAr ? 'ملخص المحاكاة والنتيجة' : 'Simulation Summary'}
            </h3>

            <div className="p-4 rounded-xl bg-[#0A0C10] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{isAr ? 'الدرجة الأصلية:' : 'Base Score:'}</span>
                <span className="font-mono font-bold text-slate-300">{baseScore}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{isAr ? 'الزيادة المحاكاة:' : 'Simulated Boost:'}</span>
                <span className="font-mono font-bold text-blue-400">+{scoreDelta}%</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">{isAr ? 'النتيجة المتوقعة:' : 'Projected Fit:'}</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{estimatedScore}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0C10] border border-slate-800 text-xs leading-relaxed text-slate-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>
                {isAr
                  ? 'ملاحظة: هذه الدرجة تقديرية استناداً إلى خوارزميات الفرز الآلي وتوافق الكلمات المفتاحية، وتساعدك في تحديد أولويات التعلم.'
                  : 'Note: This projected score is an algorithmic estimate to guide your learning roadmap and is not a formal hiring guarantee.'}
              </span>
            </div>
          </div>

          <button
            onClick={handleApply}
            disabled={simulatedSkills.filter((s) => s.checked).length === 0}
            className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'تطبيق هذه المهارات في سيرتي الحالية' : 'Apply Selected Skills to My CV'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
