import mongoose, { Schema, Document } from "mongoose";

export interface BannerDocument extends Document {
  title: string;
  bannerImage?: string;
  createdAt: Date;
  updatedAt: Date;
  archived?: boolean;
}

const BannerSchema = new Schema<BannerDocument>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    bannerImage: {
      type: String,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);    

const Banner = mongoose.models.Banner || mongoose.model<BannerDocument>("Banner", BannerSchema);
export default Banner;
