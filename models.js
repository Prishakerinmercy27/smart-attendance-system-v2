const mongoose = require('mongoose');

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reg: { type: Number, required: true, unique: true, min: 1225, max: 1885 },
  phone: { type: String, required: true },
  dept: { type: String, required: true },
  pass: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  dept: { type: String, required: true },
  pass: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Leave Request Schema
const leaveRequestSchema = new mongoose.Schema({
  studentReg: { type: Number, required: true },
  studentName: { type: String, required: true },
  date: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  proofFile: {
    name: String,
    type: String,
    data: String // base64 encoded
  },
  parentLetter: {
    name: String,
    type: String,
    data: String // base64 encoded
  },
  // AI Analysis Fields
  aiCategory: { type: String, enum: ['Medical', 'Emergency', 'Personal', 'Academic', 'Suspicious'], default: 'Personal' },
  aiPriority: { type: String, enum: ['High', 'Normal', 'Low'], default: 'Normal' },
  aiScore: { type: Number, default: 0 },
  aiConfidence: { type: Number, default: 0 },
  // End AI Fields
  submittedAt: { type: Date, default: Date.now },
  approvedBy: String,
  approvedAt: Date,
  rejectedBy: String,
  rejectedAt: Date
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  studentReg: { type: Number, required: true },
  type: { type: String, enum: ['approved', 'rejected', 'pending'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  studentReg: { type: Number, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, enum: ['present', 'absent', 'leave'], required: true },
  markedBy: { type: String, required: true }, // Teacher phone
  markedAt: { type: Date, default: Date.now },
  remarks: String,
  updatedAt: { type: Date, default: Date.now }
});

// Create compound index for student-date uniqueness
attendanceSchema.index({ studentReg: 1, date: 1 }, { unique: true });

module.exports = {
  Student: mongoose.model('Student', studentSchema),
  Teacher: mongoose.model('Teacher', teacherSchema),
  LeaveRequest: mongoose.model('LeaveRequest', leaveRequestSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Attendance: mongoose.model('Attendance', attendanceSchema)
};
