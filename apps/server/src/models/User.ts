import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  bio?: string;
  github?: string;
  linkedin?: string;
  leetcode?: string;
  profileStats: {
    algorithmsVisualized: number;
    testsPassed: number;
    currentStreak: number;
    accuracy: number;
  };
  badges: string[];
  activity: {
    icon: string;
    text: string;
    date: Date;
  }[];
  raceHistory: {
    algo1: string;
    algo2: string;
    result: 'win' | 'loss';
    date: Date;
  }[];
  categoryProgress: {
    name: string;
    completed: number;
    total: number;
    color: string;
  }[];
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default
    },
    bio: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    profileStats: {
      algorithmsVisualized: { type: Number, default: 0 },
      testsPassed: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
    },
    badges: [{ type: String }],
    activity: [{
      icon: String,
      text: String,
      date: { type: Date, default: Date.now }
    }],
    raceHistory: [{
      algo1: String,
      algo2: String,
      result: { type: String, enum: ['win', 'loss'] },
      date: { type: Date, default: Date.now }
    }],
    categoryProgress: [{
      name: String,
      completed: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      color: String
    }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
