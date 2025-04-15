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
  slug: string;
  productUrl?: string;
}

const ArticleSchema = new Schema<ArticleDocument>(
  {
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
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
    productUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string | null | undefined) {
          if (!v) return true; // Allow null/undefined values
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    archived: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Add middleware to generate slug from title
ArticleSchema.pre("validate", async function (next) {
  if (this.isModified("title")) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for existing slugs and append number if needed
    let slug = baseSlug;
    let counter = 1;
    while (
      await mongoose.models.Article?.findOne({
        slug,
        _id: { $ne: this._id }, // Exclude current document when updating
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

const Article =
  mongoose.models.Article ||
  mongoose.model<ArticleDocument>("Article", ArticleSchema);

export default Article;
