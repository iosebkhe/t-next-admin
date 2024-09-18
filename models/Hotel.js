import mongoose, { model, Schema, models } from "mongoose";

const HotelSchema = new Schema({
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
  availableRooms: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  workingHours: {
    type: String,
    required: true
  },
  facebook: {
    type: String,
    required: true
  },
  instagram: {
    type: String,
    required: true
  },
  tripAdvisor: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
});

export const Hotel = models.Hotel || model('Hotel', HotelSchema);