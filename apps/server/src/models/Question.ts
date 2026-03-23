import mongoose, { Schema, Document } from 'mongoose';
import { QuestionCategory, QuestionType } from '@dsa-visualizer/shared';

export interface IQuestion extends Document {
  category: QuestionCategory;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  options?: string[]; // Defined if MCQ
  codeSnippet?: string; // Defined if predict-state or find-bug
  codeLanguage?: 'typescript' | 'cpp';
  correctAnswer: string; // The backend truth value
}

const QuestionSchema = new Schema<IQuestion>(
  {
    category: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    title: { type: String, required: true },
    description: { type: String, required: true },
    options: { type: [String], default: undefined },
    codeSnippet: { type: String },
    codeLanguage: { type: String, enum: ['typescript', 'cpp'] },
    correctAnswer: { type: String, required: true },
  },
  { timestamps: true }
);

// Indexes for faster random querying by category
QuestionSchema.index({ category: 1, difficulty: 1 });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
