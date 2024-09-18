import mongoose, { model, Schema, models } from "mongoose";

const StorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionSmall: {
    type: String,
    required: true
  },
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
  price: {
    type: Number
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  website: {
    type: String
  },
  workingHours: {
    type: String
  },
  facebook: {
    type: String
  },
  instagram: {
    type: String
  },
  tripAdvisor: {
    type: String
  },
}, {
  timestamps: true,
});

export const Story = models.Story || model('Story', StorySchema);