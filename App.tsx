
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BookOpen, 
  Search, 
  Home, 
  Bookmark, 
  Settings, 
  GraduationCap, 
  Sun, 
  Moon, 
  Globe, 
  ChevronRight, 
  ArrowLeft,
  Star,
  CheckCircle,
  XCircle,
  Zap,
  Cpu,
  Shield,
  FileText,
  Rocket
} from 'lucide-react';
import { AppState, Category, KnowledgePoint, QuizQuestion } from './types';
import { KNOWLEDGE_BASE, QUIZ_QUESTIONS } from './data/knowledgeBase';
import { TRANSLATIONS } from './data/translations';

const App: React.FC = () => {
  // --- State Initialization ---
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('uav_app_state');
    const defaultState: AppState = {
      language: 'zh',
      theme: 'light',
      bookmarks: [],
      viewedTopics: [],
      currentPage: 'home',
      selectedTopicId: null,
      searchQuery: '',
    };
    return saved ? JSON.parse(saved) : defaultState;
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('uav_app_state', JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  // --- Translation Helpers ---
  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    return (TRANSLATIONS[state.language] as any)[key] || key;
  };

  const getLocalizedText = (obj: { zh: string; en: string }) => {
    return obj[state.language];
  };

  const getLocalizedList = (obj: { zh: string[]; en: string[] }) => {
    return obj[state.language];
  };

  // --- Actions ---
  const setPage = (page: AppState['currentPage'], topicId: string | null = null) => {
    setState(prev => {
      const newState = { ...prev, currentPage: page, selectedTopicId: topicId };
      if (page === 'detail' && topicId && !prev.viewedTopics.includes(topicId)) {
        newState.viewedTopics = [...prev.viewedTopics, topicId];
      }
      return newState;
    });
    window.scrollTo(0, 0);
  };

  const toggleBookmark = (id: string) => {
    setState(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(id)
        ? prev.bookmarks.filter(b => b !== id)
        : [...prev.bookmarks, id]
    }));
  };

  const toggleLanguage = () => {
    setState(prev => ({ ...prev, language: prev.language === 'zh' ? 'en' : 'zh' }));
  };

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  // --- Computed Data ---
  const filteredKnowledge = useMemo(() => {
    if (!state.searchQuery) return KNOWLEDGE_BASE;
    const query = state.searchQuery.toLowerCase();
    return KNOWLEDGE_BASE.filter(item => 
      item.title.zh.toLowerCase().includes(query) || 
      item.title.en.toLowerCase().includes(query) ||
      item.definition.zh.toLowerCase().includes(query) ||
      item.definition.en.toLowerCase().includes(query)
    );
  }, [state.searchQuery]);

  const selectedTopic = useMemo(() => 
    KNOWLEDGE_BASE.find(k => k.id === state.selectedTopicId), 
    [state.selectedTopicId]
  );

  const stats = useMemo(() => ({
    total: KNOWLEDGE_BASE.length,
    learned: state.viewedTopics.length,
    bookmarks: state.bookmarks.length,
    percentage: Math.round((state.viewedTopics.length / KNOWLEDGE_BASE.length) * 100)
  }), [state.viewedTopics, state.bookmarks]);

  // --- UI Components ---

  const SidebarItem: React.FC<{ 
    page: AppState['currentPage']; 
    icon: React.ReactNode; 
    label: string 
  }> = ({ page, icon, label }) => (
    <button
      onClick={() => setPage(page)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        state.currentPage === page
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  const TopicCard: React.FC<{ topic: KnowledgePoint }> = ({ topic }) => (
    <div 
      className="group glass dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
      onClick={() => setPage('detail', topic.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${
          topic.category === 'Basics' ? 'bg-green-100 text-green-600' :
          topic.category === 'Technology' ? 'bg-blue-100 text-blue-600' :
          topic.category === 'Applications' ? 'bg-purple-100 text-purple-600' :
          topic.category === 'Safety' ? 'bg-orange-100 text-orange-600' :
          'bg-red-100 text-red-600'
        }`}>
          {topic.category === 'Basics' ? <Zap size={20} /> :
           topic.category === 'Technology' ? <Cpu size={20} /> :
           topic.category === 'Applications' ? <Rocket size={20} /> :
           topic.category === 'Safety' ? <Shield size={20} /> :
           <FileText size={20} />}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleBookmark(topic.id); }}
          className={`p-1.5 rounded-full transition-colors ${
            state.bookmarks.includes(topic.id) ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-500'
          }`}
        >
          <Star size={18} fill={state.bookmarks.includes(topic.id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:text-blue-600 transition-colors">
        {getLocalizedText(topic.title)}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
        {getLocalizedText(topic.definition)}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-500">
          {t('difficulty')}: {t(topic.difficulty.toLowerCase() as any)}
        </span>
        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );

  // --- Pages ---

  const HomePage = () => (
    <div className="space-y-10 fade-in">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            {t('exploreUAV')}
          </h1>
          <p className="text-lg text-blue-100 mb-8 font-medium">
            {t('heroSubtitle')}
          </p>
          <button 
            onClick={() => setPage('knowledge')}
            className="px-8 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('getStarted')}
          </button>
        </div>
        <div className="absolute right-[-10%] top-[-20%] opacity-20 transform rotate-12 scale-150">
           <Rocket size={400} />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">{t('categories')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Basics', 'Technology', 'Applications'].map(cat => {
              const items = KNOWLEDGE_BASE.filter(k => k.category === cat);
              return (
                <div key={cat} className="glass dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold dark:text-white">{t(cat.toLowerCase() as any)}</h3>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      {items.length} {state.language === 'zh' ? '个主题' : 'Topics'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {items.slice(0, 2).map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => setPage('detail', item.id)}
                        className="flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer text-sm font-medium"
                      >
                        <span>{getLocalizedText(item.title)}</span>
                        <ChevronRight size={14} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold mb-4 dark:text-white">{t('progress')}</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    {stats.learned}/{stats.total} {t('viewed')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {stats.percentage}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                <div style={{ width: `${stats.percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-1000"></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {state.language === 'zh' ? '保持学习，成为无人机专家！' : 'Keep learning to become a UAV expert!'}
            </p>
          </div>
          
          <button 
            onClick={() => setPage('quiz')}
            className="w-full py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl flex items-center justify-center space-x-2 font-bold hover:bg-slate-800 transition-all"
          >
            <GraduationCap size={20} />
            <span>{t('startQuiz')}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const KnowledgePage = () => (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-black dark:text-white">{t('knowledgeBase')}</h1>
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={state.searchQuery}
            onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKnowledge.map(item => (
          <TopicCard key={item.id} topic={item} />
        ))}
      </div>
      {filteredKnowledge.length === 0 && (
        <div className="text-center py-20">
          <Search size={64} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium">{t('noResults')}</p>
        </div>
      )}
    </div>
  );

  const DetailPage = () => {
    if (!selectedTopic) return null;
    return (
      <div className="max-w-4xl mx-auto fade-in pb-12">
        <button 
          onClick={() => setPage('knowledge')}
          className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t('knowledgeBase')}</span>
        </button>

        <div className="glass dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-8">
            <h1 className="text-3xl md:text-4xl font-black text-white text-center">
              {getLocalizedText(selectedTopic.title)}
            </h1>
          </div>
          
          <div className="p-8 md:p-12 space-y-10">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 dark:text-white">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                <span>{state.language === 'zh' ? '定义' : 'Definition'}</span>
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed bg-blue-50/50 dark:bg-slate-700/50 p-6 rounded-2xl italic border-l-4 border-blue-500">
                {getLocalizedText(selectedTopic.definition)}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 dark:text-white">
                  <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                  <span>{t('keyPoints')}</span>
                </h2>
                <ul className="space-y-3">
                  {getLocalizedList(selectedTopic.keyPoints).map((point, i) => (
                    <li key={i} className="flex items-start space-x-3 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 dark:text-white">
                  <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                  <span>{t('examples')}</span>
                </h2>
                <ul className="space-y-3">
                  {getLocalizedList(selectedTopic.examples).map((ex, i) => (
                    <li key={i} className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="font-medium">{ex}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {selectedTopic.relatedTerms.length > 0 && (
              <section className="pt-8 border-t border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-bold mb-6 dark:text-white">{t('relatedTerms')}</h2>
                <div className="flex flex-wrap gap-3">
                  {selectedTopic.relatedTerms.map(termId => {
                    const term = KNOWLEDGE_BASE.find(k => k.id === termId);
                    if (!term) return null;
                    return (
                      <button 
                        key={termId}
                        onClick={() => setPage('detail', termId)}
                        className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/30 transition-all shadow-sm"
                      >
                        {getLocalizedText(term.title)}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  };

  const QuizPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const question = QUIZ_QUESTIONS[currentStep];

    const handleAnswer = (index: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(index);
      if (index === question.correctIndex) {
        setScore(s => s + 1);
      }
      setShowExplanation(true);
    };

    const nextStep = () => {
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setCurrentStep(s => s + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        setIsFinished(true);
      }
    };

    if (isFinished) {
      return (
        <div className="max-w-2xl mx-auto text-center fade-in py-12">
          <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <GraduationCap size={64} />
          </div>
          <h2 className="text-3xl font-black mb-4 dark:text-white">{t('finish')}!</h2>
          <p className="text-slate-500 mb-8 text-xl">
            {t('score')}: <span className="text-blue-600 font-black">{score} / {QUIZ_QUESTIONS.length}</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => { setIsFinished(false); setCurrentStep(0); setScore(0); setSelectedOption(null); setShowExplanation(false); }}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
            >
              {state.language === 'zh' ? '重新开始' : 'Restart Quiz'}
            </button>
            <button 
              onClick={() => setPage('home')}
              className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-300 transition-all"
            >
              {t('home')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black dark:text-white">{t('quizCenter')}</h1>
          <span className="font-bold text-slate-400">
            {currentStep + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>

        <div className="glass dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl mb-6">
          <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full mb-8 overflow-hidden">
            <div 
              style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }} 
              className="bg-blue-600 h-full transition-all duration-500"
            ></div>
          </div>
          
          <h3 className="text-xl font-bold mb-8 dark:text-white leading-relaxed">
            {getLocalizedText(question.question)}
          </h3>

          <div className="space-y-4">
            {getLocalizedList(question.options).map((opt, i) => (
              <button
                key={i}
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all font-medium flex items-center justify-between ${
                  selectedOption === null 
                    ? 'border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400' 
                    : i === question.correctIndex
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : i === selectedOption
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'border-slate-100 dark:border-slate-700 opacity-50 text-slate-400'
                }`}
              >
                <span>{opt}</span>
                {selectedOption !== null && i === question.correctIndex && <CheckCircle size={20} />}
                {selectedOption !== null && i === selectedOption && i !== question.correctIndex && <XCircle size={20} />}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 fade-in">
              <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center space-x-2">
                <Zap size={16} />
                <span>{state.language === 'zh' ? '解析' : 'Explanation'}</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {getLocalizedText(question.explanation)}
              </p>
            </div>
          )}
        </div>

        {selectedOption !== null && (
          <button
            onClick={nextStep}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>{currentStep === QUIZ_QUESTIONS.length - 1 ? t('finish') : t('next')}</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    );
  };

  const SettingsPage = () => (
    <div className="max-w-2xl mx-auto fade-in">
      <h1 className="text-3xl font-black mb-10 dark:text-white">{t('settings')}</h1>
      
      <div className="space-y-6">
        <div className="glass dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="font-bold dark:text-white">{t('language')}</h3>
                <p className="text-sm text-slate-500">{state.language === 'zh' ? '切换应用语言' : 'Change app language'}</p>
              </div>
            </div>
            <button 
              onClick={toggleLanguage}
              className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              {state.language === 'zh' ? 'English' : '中文'}
            </button>
          </div>
        </div>

        <div className="glass dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl">
                {state.theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
              </div>
              <div>
                <h3 className="font-bold dark:text-white">{t('theme')}</h3>
                <p className="text-sm text-slate-500">{state.theme === 'light' ? t('light') : t('dark')}</p>
              </div>
            </div>
            <button 
              onClick={toggleTheme}
              className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              {state.theme === 'light' ? t('dark') : t('light')}
            </button>
          </div>
        </div>
        
        <div className="p-8 text-center text-slate-400 text-sm">
           SkyGuardian UAV Academy v1.0.0
           <br />
           Made for future pilots & tech enthusiasts.
        </div>
      </div>
    </div>
  );

  const BookmarksPage = () => {
    const bookmarkedTopics = KNOWLEDGE_BASE.filter(k => state.bookmarks.includes(k.id));
    return (
      <div className="fade-in">
        <h1 className="text-3xl font-black mb-8 dark:text-white">{t('bookmarks')}</h1>
        {bookmarkedTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedTopics.map(item => (
              <TopicCard key={item.id} topic={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Bookmark size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">{t('noBookmarks')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 fixed h-full z-20">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <Rocket size={24} />
          </div>
          <span className="text-xl font-black tracking-tight dark:text-white">UAV Academy</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem page="home" icon={<Home size={20} />} label={t('home')} />
          <SidebarItem page="knowledge" icon={<BookOpen size={20} />} label={t('knowledgeBase')} />
          <SidebarItem page="quiz" icon={<GraduationCap size={20} />} label={t('quizCenter')} />
          <SidebarItem page="bookmarks" icon={<Bookmark size={20} />} label={t('bookmarks')} />
          <SidebarItem page="settings" icon={<Settings size={20} />} label={t('settings')} />
        </nav>

        <div className="mt-auto glass dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
           <div className="flex items-center space-x-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold text-xs">
                {state.language === 'zh' ? '学' : 'L'}
             </div>
             <div>
               <p className="text-xs font-bold dark:text-white">Lv. 1 {state.language === 'zh' ? '学员' : 'Learner'}</p>
               <p className="text-[10px] text-slate-400">{stats.percentage}% {state.language === 'zh' ? '总进度' : 'Total Progress'}</p>
             </div>
           </div>
           <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
             <div style={{ width: `${stats.percentage}%` }} className="h-full bg-blue-600 transition-all duration-500"></div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
          <div className="flex items-center space-x-2">
             <Rocket className="text-blue-600" size={24} />
             <span className="font-black dark:text-white">UAV Academy</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400"
          >
            {state.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 flex-1 max-w-6xl mx-auto w-full">
          {state.currentPage === 'home' && <HomePage />}
          {state.currentPage === 'knowledge' && <KnowledgePage />}
          {state.currentPage === 'detail' && <DetailPage />}
          {state.currentPage === 'quiz' && <QuizPage />}
          {state.currentPage === 'bookmarks' && <BookmarksPage />}
          {state.currentPage === 'settings' && <SettingsPage />}
        </div>

        {/* Mobile Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          {[
            { id: 'home', icon: <Home size={22} />, label: t('home') },
            { id: 'knowledge', icon: <BookOpen size={22} />, label: t('knowledgeBase') },
            { id: 'quiz', icon: <GraduationCap size={22} />, label: t('quizCenter') },
            { id: 'bookmarks', icon: <Bookmark size={22} />, label: t('bookmarks') },
            { id: 'settings', icon: <Settings size={22} />, label: t('settings') }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id as any)}
              className={`flex flex-col items-center space-y-1 ${
                state.currentPage === item.id ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default App;
