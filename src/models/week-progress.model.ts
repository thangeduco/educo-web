export interface WeekProgress {
  weekId: number;
  progress: number;
  highestScore: number;
  totalScore: number;
  worksheets: {
    worksheetId: number;
    submissionCount: number;
    highestScore: number | null;
  }[];
}

export interface WorksheetStats {
  worksheetId: number | string;
  submissionCount: number | null;
  highestScore: number | null;
}