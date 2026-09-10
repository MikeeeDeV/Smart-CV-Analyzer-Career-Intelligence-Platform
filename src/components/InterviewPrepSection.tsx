import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, ChevronDown, ChevronUp, RefreshCw, Layers, ShieldCheck, Flame, Zap } from 'lucide-react';
import { CVData, Language } from '../types';

interface InterviewPrepSectionProps {
  cvData: CVData;
  targetRole: string;
  lang: Language;
}

interface QuestionItem {
  id: string;
  category: 'technical' | 'behavioral' | 'missing_skills';
  question: string;
  whyAsked: string;
  idealAnswerGuide: string;
  keyPointsToCover: string[];
}

export const InterviewPrepSection: React.FC<InterviewPrepSectionProps> = ({
  cvData,
  targetRole = 'Frontend Developer',
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'technical' | 'behavioral' | 'missing_skills'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('q1');
  const [isLoading, setIsLoading] = useState(false);

  const defaultQuestions: QuestionItem[] = [
    {
      id: 'q1',
      category: 'technical',
      question: isAr
        ? 'كيف تضمن أداء تطبيق React عند التعامل مع قوائم بيانات ضخمة وتحديثات متكررة؟'
        : 'How do you optimize React performance when rendering large dynamic lists?',
      whyAsked: isAr
        ? 'لقياس فهمك العميق للـ Virtual DOM والـ Memoization والـ Windowing'
        : 'To evaluate depth in Virtual DOM, memoization, and virtualization',
      idealAnswerGuide: isAr
        ? 'اذكر استخدام React.memo و useMemo و useCallback لمنع إعادة التصيير غير الضرورية، واستخدام تقنية Virtualization (مثل tanstack-virtual) وتجنب تمرير inline functions مكررة.'
        : 'Explain useMemo/useCallback, component virtualization for big lists, keys best practices, and bundle splitting.',
      keyPointsToCover: [
        isAr ? 'التمييز بين useMemo و useCallback' : 'Distinguish useMemo vs useCallback',
        isAr ? 'تقنية List Virtualization' : 'Virtualization / Windowing',
        isAr ? 'فحص الأداء بأداة React Profiler' : 'Profiling with DevTools',
      ],
    },
    {
      id: 'q2',
      category: 'missing_skills',
      question: isAr
        ? 'لاحظنا أن سيرتك تركز على JavaScript، كيف ستتعامل مع مشروع يستخدم TypeScript بالكامل؟'
        : 'Your CV highlights JS; how will you quickly adapt to our strict TypeScript codebase?',
      whyAsked: isAr
        ? 'فحص قدرتك على التعلم السريع وإثبات معرفتك بالـ Interfaces والـ Type Safety'
        : 'Testing learning agility and proactive understanding of TS benefits',
      idealAnswerGuide: isAr
        ? 'أوضح أنك متمكن بالفعل من أساسيات JS و ES6، وقد بدأت تطبيق TS في مشاريع عملية مع فهم الـ Interfaces والـ Generics وكيف تحمي الكود من أخطاء الـ Runtime.'
        : 'Frame JS mastery as a solid foundation, highlight active TS projects, and emphasize how types prevent runtime regressions.',
      keyPointsToCover: [
        isAr ? 'فهم مبدأ Static Typing مقابل Dynamic' : 'Static vs Dynamic typing benefits',
        isAr ? 'الـ Generics والـ Component Props Types' : 'Generics & Component Props',
        isAr ? 'سرعة الاندماج وبناء مشاريع تجريبية' : 'Rapid onboarding track record',
      ],
    },
    {
      id: 'q3',
      category: 'behavioral',
      question: isAr
        ? 'احكِ لنا عن مشكلة تقنية معقدة واجهتك في مشروع سابق وكيف قمت بحلها؟'
        : 'Describe a challenging technical bug you encountered and how you debugged it.',
      whyAsked: isAr
        ? 'استخدام نموذج STAR (Situation, Task, Action, Result) لقياس التفكير المنطقي'
        : 'Assessing systematic debugging and STAR method articulation',
      idealAnswerGuide: isAr
        ? 'استخدم نموذج STAR: اذكر الموقف بوضوح، المشكلة في الكود، الأدوات التي استخدمتها للتشخيص (Chrome DevTools / Network tab)، والنتيجة بالأرقام.'
        : 'Use STAR format: Describe the root cause, methodical debugging with Network/Console tabs, and measured impact after fixing.',
      keyPointsToCover: [
        isAr ? 'تطبيق منهجية STAR' : 'STAR methodology',
        isAr ? 'التشخيص المنطقي وليس العشوائي' : 'Systematic troubleshooting',
        isAr ? 'النتيجة الإيجابية الملموسة' : 'Measurable positive outcome',
      ],
    },
    {
      id: 'q4',
      category: 'technical',
      question: isAr
        ? 'ما هي استراتيجيتك لإدارة الحالة (State Management) في تطبيقات الويب الكبيرة؟'
        : 'What is your strategy for state management in large-scale React apps?',
      whyAsked: isAr
        ? 'معرفة هل تفرق بين الـ Server State (APIs) والـ Client/UI State'
        : 'Differentiating Server State from Client UI State cleanly',
      idealAnswerGuide: isAr
        ? 'فصل Server State (باستخدام React Query أو SWR) عن UI State (مثل Zustand أو Context API) لتقليل التعقيد وتحسين السرعة.'
        : 'Separate Server Cache (TanStack Query) from local UI state (Zustand/Context), avoiding unnecessary global state bloat.',
      keyPointsToCover: [
        isAr ? 'Server State vs Client State' : 'Server State vs Client State',
        isAr ? 'تجنب الـ Prop Drilling' : 'Prop Drilling elimination',
        isAr ? 'الأداء وتقليل Re-renders' : 'Re-render optimization',
      ],
    },
  ];

  const [questions, setQuestions] = useState<QuestionItem[]>(defaultQuestions);

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cv/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, targetRole, lang }),
      });
      const data = await res.json();
      if (data.success && data.data?.questions) {
        setQuestions(data.data.questions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    selectedCategory === 'all' ? true : q.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      
      {/* Header Card */}
      <div className="ui-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="ui-badge-blue mb-3 inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'محاكي المقابلات الشخصية (Mock Interview)' : 'AI Interview Simulator'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'الأسئلة المتوقعة في المقابلات مع دليل الإجابة المثالي' : 'Predicted Interview Questions & Ideal Answers'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {isAr
                ? 'أسئلة مخصصة تم توليدها استناداً إلى نقاط سيرتك الذاتية والمهارات الناقصة لضمان تفوقك في المقابلة.'
                : 'Custom questions based on your profile & gap areas, complete with scoring criteria and winning answers.'}
            </p>
          </div>

          <button
            onClick={handleGenerateQuestions}
            disabled={isLoading}
            className="ui-btn-primary flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isAr ? 'توليد أسئلة ذكية جديدة' : 'Generate New Questions'}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-6 flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: isAr ? 'جميع الأسئلة' : 'All Questions' },
            { id: 'technical', label: isAr ? '💻 أسئلة تقنية (Technical)' : '💻 Technical' },
            { id: 'missing_skills', label: isAr ? '⚠️ أسئلة الفجوات والـ TypeScript' : '⚠️ Skill Gaps' },
            { id: 'behavioral', label: isAr ? '🤝 أسئلة سلوكية (STAR)' : '🤝 Behavioral (STAR)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === tab.id
                  ? 'ui-btn-primary'
                  : 'ui-btn-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isOpen = expandedId === q.id;

          return (
            <div
              key={q.id || idx}
              className={`ui-card transition-all overflow-hidden ${
                isOpen ? 'border-blue-500/50 shadow-surface-hover' : ''
              }`}
            >
              {/* Question Header */}
              <div
                onClick={() => setExpandedId(isOpen ? null : q.id)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-[var(--radius-control)] bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    Q{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug tracking-tight">
                      {q.question}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      🎯 <span className="font-semibold text-slate-300">{isAr ? 'الهدف من السؤال:' : 'Why asked:'}</span> {q.whyAsked}
                    </p>
                  </div>
                </div>

                <div className="p-1.5 rounded-[var(--radius-control)] bg-[var(--color-surface-inset)] text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Accordion Body: Ideal Answer & Key Points */}
              {isOpen && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800 space-y-4 animate-fade-in">
                  
                  {/* Ideal Answer Box */}
                  <div className="ui-subcard p-4 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAr ? 'دليل الإجابة النموذجية الفائزة (Winning Answer Strategy):' : 'Winning Answer Strategy:'}</span>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {q.idealAnswerGuide}
                    </p>
                  </div>

                  {/* Key Points to hit */}
                  {q.keyPointsToCover && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {isAr ? 'عناصر ضرورية يجب أن تحتويها إجابتك:' : 'Must-Cover Key Points:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {q.keyPointsToCover.map((pt, pIdx) => (
                          <div
                            key={pIdx}
                            className="ui-subcard p-2.5 text-xs text-slate-300 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="text-xs leading-normal">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
