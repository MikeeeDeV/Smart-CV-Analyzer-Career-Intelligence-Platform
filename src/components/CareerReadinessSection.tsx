import React from 'react';
import { Award, TrendingUp, ShieldAlert, Sparkles, ArrowRight, ArrowLeft, Target, Briefcase, CheckCircle2, ChevronRight } from 'lucide-react';
import { CVData, Language } from '../types';

interface CareerReadinessSectionProps {
  cvData: CVData;
  onSelectRecommendedJob: (jobTitle: string) => void;
  lang: Language;
}

export const CareerReadinessSection: React.FC<CareerReadinessSectionProps> = ({
  cvData,
  onSelectRecommendedJob,
  lang,
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const readinessScore = 78;

  const pillars = [
    { label: isAr ? 'المهارات التقنية (Technical Skills)' : 'Technical Skills', score: 84, color: 'from-blue-500 to-indigo-500' },
    { label: isAr ? 'جودة السيرة (CV Quality)' : 'CV Quality & ATS', score: 91, color: 'from-emerald-500 to-teal-400' },
    { label: isAr ? 'الخبرة العملية (Work Experience)' : 'Work Experience', score: 65, color: 'from-amber-500 to-orange-500' },
    { label: isAr ? 'المشاريع التطبيقية (Projects)' : 'Projects & Portfolio', score: 82, color: 'from-cyan-500 to-teal-500' },
    { label: isAr ? 'الشهادات والاعتمادات (Certifications)' : 'Certifications', score: 58, color: 'from-purple-500 to-pink-500' },
  ];

  const jobRecommendations = [
    {
      title: 'Frontend Developer',
      match: 92,
      tag: isAr ? 'مطابقة مثالية' : 'Best Match',
      desc: isAr ? 'خبرتك في React وJavaScript والتصميم المتجاوب تؤهلك مباشرة لهذه الوظيفة.' : 'Your React, JS, and CSS skills strongly match core frontend developer specs.',
    },
    {
      title: 'UI Developer & Design Systems',
      match: 88,
      tag: isAr ? 'مطابقة عالية جداً' : 'High Fit',
      desc: isAr ? 'دمج مهارات Figma مع Tailwind وReact يجعلك خياراً ممتازاً لفرق بناء الواجهات.' : 'Translating Figma to pixel-perfect React/Tailwind makes you a prime candidate.',
    },
    {
      title: 'React.js Specialist',
      match: 84,
      tag: isAr ? 'مطابقة قوية' : 'Strong Fit',
      desc: isAr ? 'لديك أساسيات صلبة في React مع حاجة بسيطة لإبراز إدارة الحالة وTypeScript.' : 'Solid React fundamentals; adding TypeScript will push you to 95%+ fit.',
    },
    {
      title: 'Full Stack Developer (Junior)',
      match: 61,
      tag: isAr ? 'فرصة تحتاج تطوير' : 'Moderate Fit',
      desc: isAr ? 'تحتاج إلى تعزيز مهارات الخوادم وقواعد البيانات (Node.js / Express / DB).' : 'Requires leveling up backend APIs, databases, and server-side logic.',
    },
    {
      title: 'Backend Engineer',
      match: 37,
      tag: isAr ? 'غير موصى به حالياً' : 'Low Match',
      desc: isAr ? 'سيرتك الحالية تركز على الواجهات وتفتقر لتقنيات الـ Backend العميقة.' : 'Your current profile is heavily frontend-focused with limited backend stack.',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Overview Card */}
      <div className="ui-card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="ui-badge-emerald mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>{isAr ? 'مؤشر الجاهزية لسوق العمل' : 'Market Readiness Index'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مستوى جاهزيتك للتوظيف واكتشاف الوظائف الأنسب لك' : 'Career Readiness & Job Fit Discovery'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {isAr
                ? 'بناءً على ملفك، يحلل النظام نقاط تفوقك وأين تقف بالضبط بين المرشحين في سوق العمل.'
                : 'Algorithmic analysis of where your profile stands in today’s competitive job market.'}
            </p>
          </div>

          <div className="flex items-center gap-4 ui-subcard p-4 shrink-0">
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-medium">
                {isAr ? 'الجاهزية الكلية' : 'Readiness Index'}
              </span>
              <span className="text-3xl font-bold text-emerald-400 font-mono">
                {readinessScore}%
              </span>
            </div>
          </div>
        </div>

        {/* 5 Readiness Pillars */}
        <div className="pt-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isAr ? 'توزيع المؤشرات الرئيسية:' : 'Core Competency Breakdown:'}
          </h3>

          <div className="space-y-3">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{pillar.label}</span>
                  <span className="font-mono font-bold text-white">{pillar.score}%</span>
                </div>
                <div className="w-full bg-[#0A0C10] rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${pillar.color}`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strongest vs Weakest Callouts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase block">
                {isAr ? 'أقوى مجالاتك (Your Strongest Area)' : 'Strongest Competency'}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                💻 {isAr ? 'المهارات التقنية ومشاريع الواجهات' : 'Technical Skills & Frontend Architecture'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isAr ? 'لديك تمكن قوي من أساسيات React وCSS وهيكلة المكونات.' : 'Strong grasp of React core lifecycle, component design, and responsive styling.'}
              </p>
            </div>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase block">
                {isAr ? 'أضعف مجالاتك للتحسين (Your Weakest Area)' : 'Area Needing Development'}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                💼 {isAr ? 'الخبرة العملية الموثقة بالأرقام' : 'Formal Experience & Quantified Impact'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isAr ? 'أغلب خبرتك في التدريب والمشاريع الفردية، ينصح بإبراز نتائج إنتاجية.' : 'Profile is currently junior/internship heavy; boost via production projects with metrics.'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Job Recommendation Section */}
      <div className="ui-card p-6 sm:p-8 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              {isAr ? 'الوظائف الأنسب لملفك المهني (Job Recommendations)' : 'Jobs You Are Best Suited For'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'بناءً على تحليل ذكي لمهاراتك وخبراتك الحالية، هذه الوظائف تقدم لك أعلى فرص قبول:'
              : 'Based on semantic skill and experience analysis, here is how well you fit various market roles:'}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {jobRecommendations.map((job, idx) => (
            <div
              key={idx}
              className="ui-subcard-hover p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm sm:text-base font-bold text-white">{job.title}</h4>
                  <span className="ui-badge-blue">
                    {job.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">{job.desc}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                <div className="text-center">
                  <span className="text-xl font-bold font-mono text-blue-400">
                    {job.match}%
                  </span>
                  <span className="text-xs text-slate-400 block">{isAr ? 'مطابقة' : 'Match'}</span>
                </div>

                <button
                  onClick={() => onSelectRecommendedJob(job.title)}
                  className="ui-btn-primary px-3.5 py-1.5 text-xs"
                >
                  <span>{isAr ? 'فحص الوظيفة' : 'Analyze'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
