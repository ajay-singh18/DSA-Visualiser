import mongoose, { Schema, Document, Types } from 'mongoose';

interface INode {
  id: string;
  label: string;
  x: number;
  y: number;
  value?: number;
}

interface IEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface ICustomLayout extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  dataType: 'array' | 'graph';
  arrayData?: number[];
  nodes?: INode[];
  edges?: IEdge[];
  isDirected?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NodeSchema = new Schema<INode>(
  { id: String, label: String, x: Number, y: Number, value: Number },
  { _id: false }
);

const EdgeSchema = new Schema<IEdge>(
  { source: String, target: String, weight: Number },
  { _id: false }
);

const CustomLayoutSchema = new Schema<ICustomLayout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dataType: {
      type: String,
      enum: ['array', 'graph'],
      required: true,
    },
    arrayData: { type: [Number] },
    nodes: { type: [NodeSchema] },
    edges: { type: [EdgeSchema] },
    isDirected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomLayout>('CustomLayout', CustomLayoutSchema);
