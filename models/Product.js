import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String },
  description: {
    type: String
  },
  descriptionSmall: {
    type: String
  },

  images: [{ type: String }],
  category: { type: mongoose.Types.ObjectId, ref: 'Category' },

  properties: { type: Object },

  availableRooms: { type: Number },
  address: { type: String },
  phone: { type: String },
  website: { type: String },
  workingHours: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  tripAdvisor: { type: String },
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);