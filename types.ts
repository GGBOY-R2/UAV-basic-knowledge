
export type Category = 'Basics' | 'Technology' | 'Applications' | 'Safety' | 'Regulations';

export interface KnowledgePoint {
  id: string;
  category: Category;
  title: { zh: string; en: string };
  definition: { zh: string; en: string };
  keyPoints: { zh: string[]; en: string[] };
  examples: { zh: string[]; en: string[] };
  relatedTerms: string[]; // IDs of other knowledge points
  icon?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: { zh: string; en: string };
  options: { zh: string[]; en: string[] };
  correctIndex: number;
  explanation: { zh: string; en: string };
}

export type AppState = {
  language: 'zh' | 'en';
  theme: 'light' | 'dark';
  bookmarks: string[];
  viewedTopics: string[];
  currentPage: 'home' | 'knowledge' | 'detail' | 'quiz' | 'bookmarks' | 'search';
  selectedTopicId: string | null;
  searchQuery: string;
};
