import { Material, MaterialTypes } from "./material.model";

export interface GenerationFormModel {
  subject: string;
  audience: string;
  level: string;
  topic: string;
  formats: MaterialTypes;
  templateFile: File | null;
  teachingWeeks: number;
  lecturesPerWeek: number;
  presentationsPerWeek: number;
  testQuestions: number;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: number;
  status: 'completed' | 'failed';
  formData: Omit<GenerationFormModel, 'templateFile'>;
}