import mongoose from 'mongoose';

const dailySummarySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  date: { type: Date, default: Date.now },
  summaryText: { type: String, required: true }
}, { timestamps: true });

const weeklyProgressSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  progressNotes: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
}, { timestamps: true });

export const DailySummary = mongoose.model('DailySummary', dailySummarySchema);
export const WeeklyProgress = mongoose.model('WeeklyProgress', weeklyProgressSchema);