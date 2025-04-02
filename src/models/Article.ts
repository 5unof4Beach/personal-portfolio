import mongoose, { Schema, Document } from 'mongoose';

export interface ArticleDocument extends Document {
  title: string;
  content: any; // JSON content from the editor
  coverImage?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<ArticleDocument>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: Schema.Types.Mixed,
      required: [true, 'Please provide content'],
    },
    coverImage: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      }
    ],
  },
  { timestamps: true }
);

// Check if the model already exists to prevent overwriting during hot reloads
const Article = mongoose.models.Article || mongoose.model<ArticleDocument>('Article', ArticleSchema);

export default Article; 
