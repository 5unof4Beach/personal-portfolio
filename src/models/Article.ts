import mongoose, { Schema, Document } from 'mongoose';

// Simplified ArticleDocument interface
export interface ArticleDocument extends Document {
  content: string; // Changed to simple string
  title: string; // Changed back to required
  coverImage?: string; // Already optional
  tags?: string[]; // Made optional
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<ArticleDocument>(
  {
    // Changed: Content is now the primary required field
    content: {
      type: String, 
      required: [true, 'Please provide content'],
    },
    // Make title required again
    title: {
      type: String,
      required: [true, 'Please provide a title'], // Re-added required validation
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    // coverImage remains optional
    coverImage: {
      type: String,
    },
    // tags remains optional array of strings
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
