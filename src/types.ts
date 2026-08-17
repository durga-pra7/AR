export type AppScreen =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'home'
  | 'scanner'
  | 'ai-tutor'
  | 'analytics';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  level: number;
  streakDays: number;
  studyHoursThisWeek: number;
  dailyGoalProgress: number; // e.g. 65
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  timestamp: string;
  tag?: string;
}

export interface RecentTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  category: string;
  progressPercent: number;
  details?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ARTopicTarget {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  stages: {
    name: string;
    description: string;
    registers: string;
    highlight: string;
  }[];
}
