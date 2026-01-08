import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  description: { type: String, required: true },
  status: { type: String, default: 'Open' }
}, { timestamps: true });

const badgeSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  badgeType: { type: String },
  points: { type: Number },
  awardedDate: { type: Date, default: Date.now }
});

const prTrackingSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  prLink: { type: String, required: true },
  status: { type: String }
}, { timestamps: true });

const auditLogSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String }
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
export const Badge = mongoose.model('Badge', badgeSchema);
export const PRTracking = mongoose.model('PRTracking', prTrackingSchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);