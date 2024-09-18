import mongoose, { model, Schema, models } from "mongoose";

const GuideSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  biography: {
    type: String,
    required: true
  },
  languages: [
    {
      type: String,
      required: true
    }

  ],
  images: [{
    type: String,
    required: true
  }],
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true
    }
  ],
  phone: {
    type: String,
    required: true
  },
  isCertified: {
    type: Boolean,
    required: true
  },
  certifications: [
    {
      type: String,
    }
  ]
}, {
  timestamps: true,
});

export const Guide = models.Guide || model('Guide', GuideSchema);