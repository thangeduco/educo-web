export interface Course {
    id: string;
    name: string;
    description?: string;
    weeks: Week[];
  }
  
  export interface Week {
    number: number;
    description: string;
    lessons: Lesson[];
    miniTest?: Quiz;
  }
  
  export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'exercise' | 'quiz';
    contentUrl?: string;
    downloadUrl?: string;
  }
  
  export interface Quiz {
    id: string;
    title: string;
    attempts: number;
    averageScore: number;
    bestScore: number;
  }
  
  export interface Statistics {
    completedPercent: number;
    totalScore: number;
    videoStats?: VideoStatistics;
    exerciseStats?: ExerciseStatistics;
    quizStats?: QuizStatistics;
  }
  
  export interface VideoStatistics {
    views: number;
    totalWatchTime: number;
    longestWatchPercent: number;
  }
  
  export interface ExerciseStatistics {
    submissions: number;
    averageScore: number;
    bestScore: number;
  }
  
  export interface QuizStatistics {
    attempts: number;
    averageScore: number;
    bestScore: number;
  }
  