import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Upload, CheckCircle2, Sliders, Zap, Award, Target, Bot, FileText, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface LandingHeroProps {
  onStartUpload: () => void;
  onLoadSample: (sampleKey: 'haneen' | 'omar') => void;
  lang: Language;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartUpload,
  onLoadSample,
  lang,
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const workflowSteps = [
    {
      num: '01',
      title: isAr ? 'رفع السيرة الذاتية' : 'Upload CV',
      desc: isAr ? 'سحب وإفلات PDF/DOCX أو لصق النص واستخراج البيانات فورياً' : 'Drag & drop PDF/DOCX or paste text to parse sections',
      icon: Upload,
      color: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
    },
    {
      num: '02',
      title: isAr ? 'تحديد إعلان الوظيفة' : 'Target Job',
      desc: isAr ? 'اختر وظيفة مقترحة أو الصق متطلبات الوظيفة التي تريد التقديم عليها' : 'Pick a preset role or paste any job description requirements',
      icon: Target,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      num: '03',
      title: isAr ? 'التحليل بالذكاء الاصطناعي' : 'AI Analysis',
      desc: isAr ? 'فحص التوافق مع أنظمة ATS ومقارنة المهارات المطلوبة بالموجودة' : 'Scan ATS keyword compatibility & compare CV vs job skills',
      icon: Zap,
      color: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
    },
    {
      num: '04',
      title: isAr ? 'الدرجات والفجوات المهارية' : 'Get Scores & Gaps',
      desc: isAr ? 'درجة مطابقة دقيقة وفلترة المهارات الناقصة حسب الأولوية القصوى' : 'Get precision match % & prioritized missing skills breakdown',
      icon: Award,
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    },
    {
      num: '05',
      title: isAr ? 'خارطة طريق وإعادة الصياغة' : 'Improve & Roadmap',
      desc: isAr ? 'إعادة صياغة رقمية للخبرات وخارطة تعلم لتحقيق 90%+ قبول' : 'AI metric-driven rewrite + custom roadmap to hit 90%+ fit',
      icon: Sliders,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
  ];

  return (
    <div className="relative overflow-hidden pt-6 pb-12">
      {/* Background glowing accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/5 blur-3xl pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-4 pb-8">
          
          {/* Badge */}
          <div className="ui-badge-blue px-3.5 py-1.5 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'منصة التقييم والذكاء المهني المتقدمة' : 'Next-Gen Career Intelligence Platform'}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {isAr ? (
              <>
                اجعل سيرتك الذاتية <span className="text-blue-500">تعمل بذكاء</span> وتفتح لك أبواب القبول
              </>
            ) : (
              <>
                Make Your CV <span className="text-blue-500">Work Smarter</span> & Get Hired Faster
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'لا تترك سيرتك الذاتية للصدفة. حلل توافقها مع أنظمة ATS، وقارنها بالوظائف المستهدفة، واكتشف المهارات الناقصة بالأرقام والتوصيات الدقيقة وخارطة طريق للوصول لهدفك.'
              : 'Stop guessing why recruiters reject your CV. Get algorithmic ATS scoring, compare against real job descriptions, identify missing high-priority skills, and level up with AI.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="hero-upload-cta"
              onClick={onStartUpload}
              className="ui-btn-primary px-6 py-3 text-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{isAr ? 'ابدأ برفع سيرتك الذاتية الآن' : 'Upload Your CV Now'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            {/* Quick Sample CTA (Haneen Ahmed) */}
            <button
              id="hero-sample-haneen-cta"
              onClick={() => onLoadSample('haneen')}
              className="ui-btn-secondary px-4 py-3 text-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>{isAr ? 'تجربة سيرة جاهزة: حنين أحمد (Frontend)' : 'Try Sample: Haneen (Frontend)'}</span>
            </button>

            <button
              id="hero-sample-omar-cta"
              onClick={() => onLoadSample('omar')}
              className="ui-btn-secondary px-4 py-3 text-xs flex items-center gap-2 text-slate-400"
            >
              <span>{isAr ? 'سيرة: عمر خالد (Full Stack)' : 'Sample: Omar (Full Stack)'}</span>
            </button>
          </div>

          {/* Key Value Props Pill Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'فحص ATS دقيق 100%' : '100% ATS Ready Check'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'تحليل مقارنة الوظائف (CV vs Job)' : 'CV vs Job Matching'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'إعادة صياغة المشاريع بالأرقام' : 'AI Metric Bullet Enhancer'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'مستشار وظيفي AI تفاعلي' : 'Interactive Career AI'}</span>
            </div>
          </div>
        </div>

        {/* 5-Step Visual Workflow Section */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="text-center mb-8">
            <span className="ui-badge-blue px-3 py-1 inline-block uppercase tracking-wider">
              {isAr ? 'كيف تعمل المنصة؟' : 'How It Works'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 tracking-tight">
              {isAr ? 'رحلة التحول من سيرة عادية إلى مرشح مثالي' : '5 Clear Steps from Basic CV to Job-Ready Candidate'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative group ui-subcard-hover p-4.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {step.num}
                      </span>
                      <div className={`p-2 rounded-[var(--radius-control)] ${step.color} border`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 rtl:right-auto rtl:-left-2.5">
                      <div className="w-6 h-6 rounded-full bg-[var(--color-surface-subtle)] border border-slate-700 flex items-center justify-center text-slate-400 shadow-sm">
                        <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
