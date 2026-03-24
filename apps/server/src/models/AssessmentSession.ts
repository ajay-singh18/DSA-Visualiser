import mongoose, { Schema, Document } from 'mongoose';
import { QuestionCategory } from '@dsa-visualizer/shared';

export interface IAssessmentSession extends Document {
  userId: mongoose.Types.ObjectId;
  category: QuestionCategory;
  questionIds: mongoose.Types.ObjectId[];
  startedAt: Date;
  timeLimitMinutes: number;
  submittedAt?: Date;
  answers?: Record<string, string>; // Maps questionId string to userAnswer string
  score?: number;
  total?: number;
}

const AssessmentSessionSchema = new Schema<IAssessmentSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
    startedAt: { type: Date, required: true, default: Date.now },
    timeLimitMinutes: { type: Number, required: true },
    submittedAt: { type: Date },
    answers: { type: Schema.Types.Mixed },
    score: { type: Number },
    total: { type: Number },
  },
  { timestamps: true }
);

AssessmentSessionSchema.index({ userId: 1, createdAt: -1 });

export const AssessmentSession = mongoose.model<IAssessmentSession>('AssessmentSession', AssessmentSessionSchema);
