import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Globe, Plus, Trash2, Edit3, Check, Sparkles } from 'lucide-react';
import { CVData, Language } from '../types';

interface ParsedCVViewerProps {
  cvData: CVData;
  onUpdateCV: (updated: CVData) => void;
  lang: Language;
  onOpenImprover?: (textToImprove: string) => void;
}

export const ParsedCVViewer: React.FC<ParsedCVViewerProps> = ({
  cvData,
  onUpdateCV,
  lang,
  onOpenImprover,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'skills' | 'experience' | 'projects' | 'education'>('all');
  const [newSkillText, setNewSkillText] = useState('');
  const [skillCategory, setSkillCategory] = useState<'technical' | 'frameworks' | 'tools' | 'softSkills'>('technical');

  const isAr = lang === 'ar';

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    const updatedSkills = { ...cvData.skills };
    if (!updatedSkills[skillCategory].includes(newSkillText.trim())) {
      updatedSkills[skillCategory] = [...updatedSkills[skillCategory], newSkillText.trim()];
      onUpdateCV({ ...cvData, skills: updatedSkills });
    }
    setNewSkillText('');
  };

  const handleRemoveSkill = (category: keyof CVData['skills'], skillName: string) => {
    const updatedSkills = { ...cvData.skills };
    updatedSkills[category] = updatedSkills[category].filter((s) => s !== skillName);
    onUpdateCV({ ...cvData, skills: updatedSkills });
  };

  return (
    <div className="space-y-6">
      
      {/* Section Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
            <User className="w-5 h-5 text-blue-400" />
            <span>{isAr ? 'البيانات المستخرجة من السيرة الذاتية' : 'Parsed Resume Profile'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr ? 'تم تقسيم السيرة وتحليل عناصرها، يمكنك تعديل وإضافة أي مهارات أو بنود' : 'Extracted sections from your CV. You can edit, add skills or enhance bullets.'}
          </p>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0A0C10] p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: isAr ? 'الكل' : 'All' },
            { id: 'skills', label: isAr ? 'المهارات' : 'Skills' },
            { id: 'experience', label: isAr ? 'الخبرات' : 'Experience' },
            { id: 'projects', label: isAr ? 'المشاريع' : 'Projects' },
            { id: 'education', label: isAr ? 'التعليم' : 'Education' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeSection === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Personal Info Header Card */}
      {(activeSection === 'all' || activeSection === 'experience') && (
        <div className="ui-card p-5 sm:p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">{cvData.personalInfo.name}</h4>
              <p className="text-xs text-blue-400 font-medium">{cvData.personalInfo.title}</p>
            </div>
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 font-mono">
              {cvData.personalInfo.email && <span>📧 {cvData.personalInfo.email}</span>}
              {cvData.personalInfo.phone && <span>📱 {cvData.personalInfo.phone}</span>}
              {cvData.personalInfo.location && <span>📍 {cvData.personalInfo.location}</span>}
            </div>
          </div>
          {cvData.personalInfo.summary && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic ui-subcard p-3.5">
              "{cvData.personalInfo.summary}"
            </p>
          )}
        </div>
      )}

      {/* Skills Section */}
      {(activeSection === 'all' || activeSection === 'skills') && (
        <div className="ui-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>{isAr ? 'المهارات التقنية والأدوات المستخرجة' : 'Extracted Skills & Tech Stack'}</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {cvData.skills.technical.length +
                cvData.skills.frameworks.length +
                cvData.skills.tools.length +
                cvData.skills.softSkills.length}{' '}
              {isAr ? 'مهارة' : 'skills'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical */}
            <div className="space-y-2 ui-subcard p-3.5">
              <span className="text-xs font-bold text-blue-400 block uppercase tracking-wider">
                {isAr ? 'المهارات التقنية الأساسية (Languages & Core)' : 'Core Technical Languages'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.technical.map((skill) => (
                  <span
                    key={skill}
                    className="ui-badge-blue group"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill('technical', skill)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Frameworks */}
            <div className="space-y-2 ui-subcard p-3.5">
              <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
                {isAr ? 'أطر العمل والمكتبات (Frameworks & Libs)' : 'Frameworks & Libraries'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.frameworks.map((skill) => (
                  <span
                    key={skill}
                    className="ui-badge-emerald group"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill('frameworks', skill)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-2 ui-subcard p-3.5">
              <span className="text-xs font-bold text-orange-400 block uppercase tracking-wider">
                {isAr ? 'الأدوات والمنصات (Tools & Platforms)' : 'Tools & Platforms'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.tools.map((skill) => (
                  <span
                    key={skill}
                    className="ui-badge-amber group"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill('tools', skill)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="space-y-2 ui-subcard p-3.5">
              <span className="text-xs font-bold text-purple-400 block uppercase tracking-wider">
                {isAr ? 'المهارات الشخصية (Soft Skills)' : 'Soft Skills & Leadership'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.softSkills.map((skill) => (
                  <span
                    key={skill}
                    className="ui-badge-slate group"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill('softSkills', skill)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Add Skill Input */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder={isAr ? 'أضف مهارة جديدة (مثلاً: TypeScript, Docker)...' : 'Add new skill (e.g., TypeScript, Jest)...'}
              className="bg-[#0A0C10] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 grow max-w-sm"
            />
            <select
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value as any)}
              className="bg-[#0A0C10] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="technical">{isAr ? 'تقنية أساسية' : 'Technical'}</option>
              <option value="frameworks">{isAr ? 'إطار عمل' : 'Framework'}</option>
              <option value="tools">{isAr ? 'أداة' : 'Tool'}</option>
              <option value="softSkills">{isAr ? 'مهارة شخصية' : 'Soft Skill'}</option>
            </select>
            <button
              onClick={handleAddSkill}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة' : 'Add'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Experience Section */}
      {(activeSection === 'all' || activeSection === 'experience') && (
        <div className="ui-card p-5 sm:p-6 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>{isAr ? 'الخبرات المهنية' : 'Work Experience'}</span>
          </h4>

          <div className="space-y-4">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="ui-subcard p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h5 className="text-sm font-bold text-white">{exp.role}</h5>
                    <span className="text-xs text-blue-400 font-medium">{exp.company}</span>
                  </div>
                  <span className="ui-badge-slate text-xs font-mono self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>

                {/* Bullets */}
                <div className="space-y-2 pt-1">
                  {exp.bullets.map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      className="group flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-slate-800/30 transition-colors text-xs text-slate-300 leading-relaxed"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{bullet}</span>
                      </div>

                      {onOpenImprover && (
                        <button
                          onClick={() => onOpenImprover(bullet)}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 px-2 py-0.5 rounded-md bg-blue-600/10 border border-blue-500/20 transition-all shrink-0"
                          title={isAr ? 'تحسين هذه الجملة بالذكاء الاصطناعي' : 'Enhance with AI'}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{isAr ? 'تحسين (AI)' : 'Improve'}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {(activeSection === 'all' || activeSection === 'projects') && (
        <div className="ui-card p-5 sm:p-6 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'المشاريع التطبيقية' : 'Featured Projects'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cvData.projects.map((proj) => (
              <div key={proj.id} className="ui-subcard p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white">{proj.name}</h5>
                    {proj.critique?.metricsScore && (
                      <span className="ui-badge-emerald font-mono">
                        {proj.critique.metricsScore}% {isAr ? 'جودة الوصف' : 'Impact'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="ui-badge-slate text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {onOpenImprover && (
                  <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => onOpenImprover(proj.description)}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تحسين صياغة المشروع بالأرقام' : 'Improve Project Impact'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications */}
      {(activeSection === 'all' || activeSection === 'education') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Education */}
          <div className="ui-card p-5 sm:p-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>{isAr ? 'التعليم الأكاديمي' : 'Education'}</span>
            </h4>
            {cvData.education.map((edu) => (
              <div key={edu.id} className="ui-subcard p-3.5 space-y-1">
                <h5 className="text-xs font-bold text-white">{edu.degree}</h5>
                <p className="text-xs text-purple-300">{edu.institution}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{edu.major}</span>
                  <span className="font-mono">{edu.year}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications & Languages */}
          <div className="ui-card p-5 sm:p-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'الشهادات واللغات' : 'Certifications & Languages'}</span>
            </h4>
            
            <div className="space-y-2">
              {cvData.certifications?.map((cert, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-center gap-2 ui-subcard p-2.5">
                  <span className="text-amber-400">📜</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>

            {cvData.languages && cvData.languages.length > 0 && (
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-1 font-semibold">{isAr ? 'اللغات:' : 'Languages:'}</span>
                <div className="flex flex-wrap gap-1.5">
                  {cvData.languages.map((langItem, idx) => (
                    <span key={idx} className="ui-badge-slate text-xs">
                      🌐 {langItem}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
