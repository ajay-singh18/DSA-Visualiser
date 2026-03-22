import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBookmark extends Document {
  userId: Types.ObjectId;
  layoutId: Types.ObjectId;
  algorithmKey: string;
  snapshotIndex: number;
  playbackSpeed: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    layoutId: {
      type: Schema.Types.ObjectId,
      ref: 'CustomLayout',
      required: true,
    },
    algorithmKey: { type: String, required: true },
    snapshotIndex: { type: Number, required: true, default: 0 },
    playbackSpeed: { type: Number, required: true, default: 1 },
    notes: { type: String },
  },
  { timestamps: true }
);

// One bookmark per user + layout + algorithm combo
BookmarkSchema.index(
  { userId: 1, layoutId: 1, algorithmKey: 1 },
  { unique: true }
);

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
