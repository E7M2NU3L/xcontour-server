import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String, required: true }, // Contract body or clauses in plain text/HTML
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  public : {
    type : Boolean,
    default : false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Templates = mongoose.model('Template', TemplateSchema);