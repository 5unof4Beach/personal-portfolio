import mongoose, { Schema, Document } from "mongoose";

// Simplified ArticleDocument interface
export interface ArticleDocument extends Document {
  content: string;
  title: string;
  description: string;
  coverImage?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  archived?: boolean;
}

const ArticleSchema = new Schema<ArticleDocument>(
  {
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"], // Re-added required validation
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [300, "Description cannot be more than 300 characters"],
    },
    coverImage: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    archived: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Article =
  mongoose.models.Article ||
  mongoose.model<ArticleDocument>("Article", ArticleSchema);

export default Article;
