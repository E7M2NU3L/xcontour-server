import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema({
    title: { type: String, required: true },
    clientName: { type: String, required: true },
    currentVersion: { type: Number, default: 1 }, // Tracks the current version
    versions: [
      {
        versionNumber: { type: Number, required: true },
        content: { type: String, required: true }, // Content of the contract
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changeSummary: { type: String }, // Summary of what was updated,
        status: {
          type: String,
          enum: [
            'Draft',
            'Pending Approval',
            'Approved',
            'Active',
            'Amendment',  // Optional, if you want to track revisions separately
            'Completed',
            'Expired',
            'Terminated'  // Optional, for capturing premature termination
          ],      
          default: 'Draft',
        },
      },
    ],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // People involved
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
export const Contracts = mongoose.model('Contract', ContractSchema);
