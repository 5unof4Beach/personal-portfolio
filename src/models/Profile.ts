import mongoose from 'mongoose';

export interface IProfile extends mongoose.Document {
  name: string;
  title: string;
  about: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    location: string;
    from: Date;
    to: Date;
    current: boolean;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    from: Date;
    to: Date;
    current: boolean;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    link: string;
    image: string;
  }[];
  social: {
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
  };
  contact: {
    email: string;
    phone: string;
  };
}

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    about: {
      type: String,
      required: [true, 'About section is required'],
    },
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        link: String,
        image: String,
      },
    ],
    social: {
      linkedin: String,
      github: String,
      twitter: String,
      website: String,
    },
    contact: {
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema); 
