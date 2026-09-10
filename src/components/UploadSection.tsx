import React, { useState, useRef } from 'react';
import { Upload, FileText, Clipboard, Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { SAMPLE_CV_HANEEN, SAMPLE_CV_OMAR } from '../data/sampleProfiles';

interface UploadPayload {
  rawText?: string;
  fileBase64?: string;
  fileName?: string;
}

interface UploadSectionProps {
  onCVUploaded: (payload: UploadPayload | string) => Promise<void>;
  onLoadSample: (sampleKey: 'haneen' | 'omar') => void;
  isLoading: boolean;
  loadingStep: string;
  lang: Language;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onCVUploaded,
  onLoadSample,
  isLoading,
  loadingStep,
  lang,
}) => {
  const [tab, setTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMsg(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setSelectedFileName(file.name);
    setErrorMsg(null);
    try {
      // If plain text file (.txt)
      if (file.name.toLowerCase().endsWith('.txt') || file.type === 'text/plain') {
        const text = await file.text();
        if (text && text.trim().length >= 10) {
          await onCVUploaded({ rawText: text, fileName: file.name });
          return;
        }
      }

      // For PDF, DOCX, Word, or binary documents: read as Base64 to preserve exact data for server parsing
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          const base64Data = result.includes(',') ? result.split(',')[1] : result;
          await onCVUploaded({
            fileBase64: base64Data,
            fileName: file.name,
            rawText: '',
          });
        } else {
          setErrorMsg(isAr ? 'تعذر قراءة محتوى الملف، يرجى المحاولة بنسخ النص ولصقه.' : 'Could not read file, please try pasting the text.');
        }
      };
      reader.onerror = () => {
        setErrorMsg(isAr ? 'حدث خطأ أثناء قراءة الملف، يمكنك لصق النص مباشرة.' : 'Error reading file, please paste text directly.');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(isAr ? 'تعذر قراءة الملف، جرب لصق النص.' : 'Could not read file, try pasting text.');
    }
  };

  const handlePasteSubmit = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 15) {
      setErrorMsg(isAr ? 'يرجى لصق نص كافٍ للسيرة الذاتية (15 حرفاً على الأقل).' : 'Please paste sufficient CV text.');
      return;
    }
    setErrorMsg(null);
    await onCVUploaded({ rawText: pastedText.trim() });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="bg-[#0F1117] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <Upload className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isAr ? 'رفع وتحليل السيرة الذاتية' : 'Upload & Analyze Your CV'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isAr
                ? 'يدعم ملفات PDF و Word (DOCX) والنصوص العادية (TXT) مع فحص ATS فوري'
                : 'Supports PDF, Word (DOCX), and plain text with instant ATS scanning'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center bg-[#0A0C10] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              id="upload-mode-file-tab"
              onClick={() => setTab('upload')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === 'upload'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isAr ? 'رفع ملف' : 'File Upload'}</span>
            </button>
            <button
              id="upload-mode-paste-tab"
              onClick={() => setTab('paste')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === 'paste'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>{isAr ? 'لصق النص' : 'Paste Text'}</span>
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading ? (
          <div className="py-16 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
              <div className="w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {isAr ? 'الذكاء الاصطناعي يحلل سيرتك الذاتية الآن...' : 'AI is analyzing your resume...'}
              </h3>
              <p className="text-xs text-blue-400 font-medium animate-pulse">
                {loadingStep || (isAr ? 'جاري استخراج المهارات، الخبرات، وفحص توافق الـ ATS...' : 'Extracting skills, experience, and running ATS check...')}
              </p>
            </div>
            <div className="max-w-xs mx-auto bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full w-3/4 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="pt-6">
            
            {/* Tab 1: Drag & Drop File */}
            {tab === 'upload' && (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                    : 'border-slate-800 hover:border-slate-700 bg-[#0A0C10] hover:bg-slate-900/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>

                <h3 className="text-base font-bold text-slate-100 mb-1">
                  {selectedFileName ? (
                    <span className="text-blue-400">{selectedFileName}</span>
                  ) : isAr ? (
                    'اسحب وأفلت ملف الـ CV هنا أو اضغط للاختيار'
                  ) : (
                    'Drag & Drop your CV file here, or browse files'
                  )}
                </h3>

                <p className="text-xs text-slate-400 mb-4">
                  {isAr ? 'صيغ الملفات المقبولة: PDF, DOCX, TXT (الحجم الأقصى 10MB)' : 'Accepted formats: PDF, DOCX, TXT (Max 10MB)'}
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 hover:border-slate-600 transition-colors">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>{isAr ? 'تصفح جهازك' : 'Choose File'}</span>
                </div>
              </div>
            )}

            {/* Tab 2: Paste Text */}
            {tab === 'paste' && (
              <div className="space-y-4">
                <textarea
                  id="cv-paste-textarea"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={
                    isAr
                      ? `الصق نص سيرتك الذاتية هنا...\n\nمثال:\nHaneen Ahmed\nFrontend Developer\nSkills: HTML, CSS, JavaScript, React, Git\nEducation: Computer Science 2024\nExperience: Frontend Intern at Tech Co...`
                      : `Paste your resume text here...\n\nExample:\nHaneen Ahmed\nFrontend Developer\nSkills: HTML, CSS, JavaScript, React, Git\nExperience: Frontend Developer Intern...`
                  }
                  rows={8}
                  className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
                />

                <div className="flex justify-end">
                  <button
                    id="submit-pasted-cv-btn"
                    onClick={handlePasteSubmit}
                    disabled={!pastedText.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-blue-600/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAr ? 'تحليل النص المدخل' : 'Analyze Text'}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Demo Pre-loaded Profiles */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-400">
                  {isAr ? 'أو جرب سيرة ذاتية جاهزة بنقرة واحدة:' : 'Or test drive with a ready sample CV:'}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="sample-cv-haneen-btn"
                    onClick={() => onLoadSample('haneen')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-300 hover:text-blue-200 text-xs font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isAr ? 'حنين أحمد (Frontend Developer)' : 'Haneen (Frontend Dev)'}</span>
                  </button>

                  <button
                    id="sample-cv-omar-btn"
                    onClick={() => onLoadSample('omar')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                  >
                    <span>{isAr ? 'عمر خالد (Full Stack)' : 'Omar (Full Stack)'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
