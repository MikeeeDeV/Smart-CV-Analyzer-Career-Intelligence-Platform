import React, { useState, useEffect } from 'react';
import { Map, CheckCircle2, Clock, BookOpen, Sparkles, ArrowRight, ArrowLeft, Layers, Compass, Code, RefreshCw, Check } from 'lucide-react';
import { CVData, RoadmapStep, Language } from '../types';

interface CareerRoadmapSectionProps {
  cvData: CVData;
  targetRole: string;
  lang: Language;
}

export const CareerRoadmapSection: React.FC<CareerRoadmapSectionProps> = ({
  cvData,
  targetRole = 'Frontend Developer',
  lang,
}) => {
  const [role, setRole] = useState(targetRole);
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const isAr = lang === 'ar';

  const defaultSteps: RoadmapStep[] = [
    {
      id: 'step_1',
      skill: 'HTML5 & Modern CSS (Flexbox / Grid / Tailwind)',
      status: 'completed',
      level: 'Intermediate',
      description: isAr ? 'إتقان بناء وتنسيق الواجهات التفاعلية المتجاوبة والتصميم الموجه للأجهزة المحمولة' : 'Responsive layouts, semantic markup, and mobile-first utility styling',
      estimatedHours: 20,
      suggestedProject: isAr ? 'بناء موقع شخصي متجاوب مع دعم الوضع الليلي' : 'Responsive Developer Portfolio with Dark Mode',
      resources: ['MDN Web Docs', 'Tailwind CSS Official Guide'],
    },
    {
      id: 'step_2',
      skill: 'JavaScript (ES6+) & React Ecosystem',
      status: 'completed',
      level: 'Intermediate',
      description: isAr ? 'دورة حياة المكونات، الـ Hooks، إدارة الحالة التفاعلية ومكتبات التوجيه' : 'Component architecture, custom hooks, state management, and modern patterns',
      estimatedHours: 45,
      suggestedProject: isAr ? 'تطبيق إدارة مهام ومشاريع تفاعلي مع لوحة تحكم' : 'Interactive Task & Finance Management Dashboard',
      resources: ['React.dev documentation', 'JavaScript.info'],
    },
    {
      id: 'step_3',
      skill: 'TypeScript & Type Safety',
      status: 'current',
      level: 'Beginner',
      description: isAr ? 'الأنواع الثابتة، الواجهات (Interfaces)، الـ Generics وربطها مع مكونات React' : 'Strict typing, Interfaces, Generics, and React TS component props',
      estimatedHours: 30,
      suggestedProject: isAr ? 'متجر إلكتروني مصغر مع TypeScript وفحص المدخلات بـ Zod' : 'E-commerce Catalog with Strict TS & Zod Validation',
      resources: ['TypeScript Handbook', 'Total TypeScript Tutorials'],
    },
    {
      id: 'step_4',
      skill: 'REST APIs & Asynchronous State (TanStack Query)',
      status: 'upcoming',
      level: 'Beginner',
      description: isAr ? 'استهلاك البيانات الحية، التخزين المؤقت (Caching)، معالجة الأخطاء والتحديث الفوري' : 'Data fetching, client caching, error boundaries, and optimistic updates',
      estimatedHours: 25,
      suggestedProject: isAr ? 'تطبيق تحليل الأسهم والطقس مع بيانات حية' : 'Real-time Stock & Analytics Portal with Live Feed',
      resources: ['TanStack Query Docs', 'RESTful API Guidelines'],
    },
    {
      id: 'step_5',
      skill: 'Testing (Jest & React Testing Library)',
      status: 'upcoming',
      level: 'Beginner',
      description: isAr ? 'كتابة اختبارات الوحدة للمكونات، واختبار تفاعل المستخدم وتغطية الحالات الشائعة' : 'Unit testing, user-event simulations, and component mocking',
      estimatedHours: 20,
      suggestedProject: isAr ? 'تغطية كاملة لنماذج التسجيل وسلة الشراء باختبارات تلقائية' : 'Test Suite for Authentication and Checkout workflows',
      resources: ['React Testing Library Docs', 'Jest Guides'],
    },
    {
      id: 'step_6',
      skill: 'Next.js & Performance (Production Ready)',
      status: 'upcoming',
      level: 'Intermediate',
      description: isAr ? 'التصيير على الخادم (SSR)، إجراءات الخادم Server Actions وتحسين Core Web Vitals' : 'SSR/SSG, Server Actions, SEO, and Core Web Vitals optimization',
      estimatedHours: 35,
      suggestedProject: isAr ? 'منصة SaaS متكاملة مع تسجيل دخول ودفع إلكتروني' : 'Production SaaS application with Auth and Stripe',
      resources: ['Next.js Official Documentation', 'web.dev Performance Guide'],
    },
  ];

  useEffect(() => {
    setSteps(defaultSteps);
  }, [lang]);

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cv/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, targetRole: role, lang }),
      });
      const data = await res.json();
      if (data.success && data.data?.steps) {
        setSteps(data.data.steps);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStepStatus = (id: string) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === id) {
          const nextStatus =
            step.status === 'completed'
              ? 'current'
              : step.status === 'current'
              ? 'upcoming'
              : 'completed';
          return { ...step, status: nextStatus };
        }
        return step;
      })
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="ui-card p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="ui-badge-blue mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>{isAr ? 'خارطة الطريق المهنية المخصصة' : 'Personalized Career Roadmap'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'خطة الانتقال من مستواك الحالي إلى مرشح مثالي' : 'Your Step-by-Step Pathway to Mastery'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {isAr
                ? 'مراحل واضحة تبين أين تقف الآن (YOU ARE HERE)، وما هي المهارات والمشاريع التي تجعلك جاهزاً للقبول.'
                : 'Clear visual journey mapping your acquired skills, current focus, and upcoming target milestones.'}
            </p>
          </div>

          {/* Role generator box */}
          <div className="flex items-center gap-2 ui-subcard p-1.5 shrink-0">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white focus:outline-none max-w-[180px]"
              placeholder="Target Role"
            />
            <button
              onClick={handleGenerateRoadmap}
              disabled={isLoading}
              className="ui-btn-primary px-3.5 py-1.5 text-xs"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isAr ? 'تحديث الخطة' : 'Update'}</span>
            </button>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="pt-8 relative">
          
          {/* Vertical timeline line */}
          <div className="absolute top-12 bottom-6 left-6 rtl:left-auto rtl:right-6 w-0.5 bg-slate-800 hidden sm:block" />

          <div className="space-y-6">
            {steps.map((step, idx) => {
              const isDone = step.status === 'completed';
              const isCurrent = step.status === 'current';

              return (
                <div
                  key={step.id || idx}
                  className={`relative sm:ps-16 rtl:sm:pe-16 rtl:sm:ps-0 transition-all ${
                    isCurrent ? 'scale-[1.01]' : ''
                  }`}
                >
                  {/* Step Node Marker (Timeline Dot) */}
                  <div
                    onClick={() => toggleStepStatus(step.id)}
                    className={`hidden sm:flex absolute top-4 left-3.5 rtl:left-auto rtl:right-3.5 -translate-x-1/2 rtl:translate-x-1/2 w-6 h-6 rounded-full items-center justify-center cursor-pointer transition-colors z-10 ${
                      isDone
                        ? 'bg-emerald-500 text-[#0A0C10] shadow-md shadow-emerald-500/30'
                        : isCurrent
                        ? 'bg-blue-500 text-white ring-4 ring-blue-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                    title={isAr ? 'اضغط لتغيير الحالة' : 'Click to toggle status'}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>

                  {/* Step Content Card */}
                  <div
                    className={`p-5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-blue-600/5 border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : isDone
                        ? 'ui-subcard'
                        : 'ui-subcard opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      
                      <div className="flex items-center gap-2.5">
                        {isCurrent && (
                          <span className="ui-badge-blue font-mono">
                            {isAr ? '📍 أنت هنا (YOU ARE HERE)' : '📍 YOU ARE HERE'}
                          </span>
                        )}
                        {isDone && (
                          <span className="ui-badge-emerald font-mono">
                            ✓ {isAr ? 'تم اكتسابها' : 'Acquired'}
                          </span>
                        )}
                        {!isDone && !isCurrent && (
                          <span className="ui-badge-slate">
                            {isAr ? 'المرحلة القادمة' : 'Upcoming'}
                          </span>
                        )}

                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {step.skill}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-blue-300">
                          {step.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>~{step.estimatedHours}h</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 py-3 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Practice Project & Resources */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="ui-subcard p-3.5 space-y-1">
                        <span className="text-xs font-semibold text-blue-400 uppercase flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          <span>{isAr ? 'المشروع العملي المقترح للإتقان:' : 'Suggested Capstone Project:'}</span>
                        </span>
                        <p className="text-xs text-slate-200 font-medium">
                          {step.suggestedProject}
                        </p>
                      </div>

                      <div className="ui-subcard p-3.5 space-y-1">
                        <span className="text-xs font-semibold text-blue-400 uppercase flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{isAr ? 'أهم المصادر التعليمية الموصى بها:' : 'Recommended Resources:'}</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.resources?.map((res, rIdx) => (
                            <span key={rIdx} className="ui-badge-slate text-xs">
                              📚 {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Goal Achieved Banner */}
          <div className="sm:ps-16 rtl:sm:pe-16 rtl:sm:ps-0 pt-6">
            <div className="ui-card p-5 border-blue-500/20 bg-blue-600/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    🚀 {isAr ? 'الوصول إلى الجاهزية الكاملة للوظيفة (Job Ready!)' : 'Mastery & Job Ready'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'بإتمام هذه المراحل ستكون مؤهلاً بنسبة 95%+ وتتفوق على أغلب المتقدمين.' : 'Completing these milestones puts you in the top 5% of qualified applicants.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
