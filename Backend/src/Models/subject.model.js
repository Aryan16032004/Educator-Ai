import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  Subjectname: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  units: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Create a compound index to ensure unique subjects for each user
subjectSchema.index({ Subjectname: 1, user: 1 }, { unique: true });

export const Subject = mongoose.model('Subject', subjectSchema);
