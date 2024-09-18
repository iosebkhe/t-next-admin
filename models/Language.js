import mongoose, { model, models, Schema } from "mongoose";

const LanguageSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
});

export const Language = models?.Language || model('Language', LanguageSchema);