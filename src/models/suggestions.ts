import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema({
    contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
    suggestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true }, // Suggested text
    suggestionType: {
      type: String,
      enum: ['Addition', 'Modification', 'Deletion'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    createdAt: { type: Date, default: Date.now },
  });
  
export const Suggestions = mongoose.model('Suggestion', SuggestionSchema);
  