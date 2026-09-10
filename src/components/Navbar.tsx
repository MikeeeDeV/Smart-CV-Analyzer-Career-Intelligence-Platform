import React, { useState } from 'react';
import { Sparkles, FileText, Target, Zap, Map, Bot, RefreshCw, Globe, SlidersHorizontal, Award, Layers, HelpCircle, Menu, X } from 'lucide-react';
import { Language, TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenChat: () => void;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  lang,
  onToggleLang,
  onOpenChat,
  userName = 'Haneen Ahmed',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = lang === 'ar';

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'HA';

  const navItems: { id: TabType; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: isAr ? 'لوحة القيادة' : 'Dashboard', icon: FileText },
    { id: 'job_match', label: isAr ? 'مطابقة الوظيفة' : 'Job Match', icon: Target },
    { id: 'simulator', label: isAr ? 'محاكي القبول' : 'Fit Simulator', icon: SlidersHorizontal },
    { id: 'improver', label: isAr ? 'تحسين السيرة (AI)' : 'AI Enhancer', icon: Zap },
    { id: 'readiness', label: isAr ? 'الجاهزية المهنية' : 'Readiness', icon: Award },
    { id: 'roadmap', label: isAr ? 'خارطة الطريق' : 'Career Roadmap', icon: Map },
    { id: 'interview', label: isAr ? 'محاكي المقابلات' : 'Interview Prep', icon: HelpCircle },
    { id: 'chat', label: isAr ? 'المستشار الذكي' : 'Career AI', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0F1117]/95 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo"
            onClick={() => onTabChange('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform duration-200">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  CAREER.AI
                </span>
                <span className="ui-badge-blue hidden sm:inline-flex">
                  Sleek ATS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {isAr ? 'منصة تقييم السيرة الذاتية والذكاء المهني' : 'Smart CV & Career Intelligence'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#0A0C10] p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#0A0C10] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title={isAr ? 'تغيير اللغة إلى English' : 'Switch Language to Arabic'}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAr ? 'EN' : 'العربية'}</span>
            </button>

            {/* Quick Ask AI Advisor Button */}
            <button
              id="header-ask-ai-btn"
              onClick={onOpenChat}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/20 transition-all"
            >
              <Bot className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAr ? 'المستشار الذكي' : 'Ask AI'}</span>
            </button>

            {/* Upload CV Shortcut */}
            <button
              id="header-upload-btn"
              onClick={() => onTabChange('upload')}
              className="ui-btn-primary text-xs px-3.5 py-1.5"
            >
              <span>{isAr ? '+ رفع CV جديد' : '+ Upload New CV'}</span>
            </button>

            {/* User Profile Avatar Bubble */}
            <div 
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm"
              title={userName}
            >
              {initials}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
