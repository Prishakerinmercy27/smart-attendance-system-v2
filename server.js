const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { Student, Teacher, LeaveRequest, Notification, Attendance } = require('./models');
const analyzeReason = require('./utils/reasonAnalyzer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ==================== STUDENT ENDPOINTS ====================

// Student Register
app.post('/api/student/register', async (req, res) => {
  try {
    const { name, phone, dept, reg, pass } = req.body;

    // Validation
    if (!name || !reg || !pass || !dept) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (isNaN(reg) || reg < 1225 || reg > 1885) {
      return res.status(400).json({ success: false, message: 'Invalid register number' });
    }

    if (pass.length < 4) {
      return res.status(400).json({ success: false, message: 'Password too short' });
    }

    // Check if already exists
    const existing = await Student.findOne({ reg });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Register number already registered' });
    }

    const student = new Student({ name, phone, dept, reg: parseInt(reg), pass });
    await student.save();

    res.json({ success: true, message: 'Registration successful', student });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Student Login
app.post('/api/student/login', async (req, res) => {
  try {
    const { reg, pass } = req.body;

    if (!reg || !pass) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    const student = await Student.findOne({ reg: parseInt(reg) });
    if (!student) {
      return res.status(401).json({ success: false, message: 'Student not found' });
    }

    if (student.pass !== pass) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    res.json({ success: true, message: 'Login successful', student });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Submit Leave Request
app.post('/api/student/leave-request', async (req, res) => {
  try {
    const { studentReg, studentName, date, reason, proofFile, parentLetter } = req.body;

    if (!studentReg || !date || !reason) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Analyze reason using AI classifier
    const aiAnalysis = analyzeReason(reason);

    const leaveRequest = new LeaveRequest({
      studentReg: parseInt(studentReg),
      studentName,
      date,
      reason,
      proofFile,
      parentLetter,
      // Store AI analysis
      aiCategory: aiAnalysis.category,
      aiPriority: aiAnalysis.priority,
      aiScore: aiAnalysis.score,
      aiConfidence: aiAnalysis.confidence
    });

    await leaveRequest.save();
    res.json({ 
      success: true, 
      message: 'Leave request submitted', 
      leaveRequest,
      aiAnalysis: {
        category: aiAnalysis.category,
        priority: aiAnalysis.priority,
        confidence: aiAnalysis.confidence
      }
    });
  } catch (error) {
    console.error('Submit leave error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit request' });
  }
});

// Get Student Leave Requests
app.get('/api/student/:reg/leave-requests', async (req, res) => {
  try {
    const { reg } = req.params;
    const requests = await LeaveRequest.find({ studentReg: parseInt(reg) }).sort({ submittedAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Fetch leave requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

// ==================== TEACHER ENDPOINTS ====================

// Teacher Register
app.post('/api/teacher/register', async (req, res) => {
  try {
    const { name, phone, dept, pass } = req.body;

    if (!name || !phone || !dept || !pass) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (pass.length < 4) {
      return res.status(400).json({ success: false, message: 'Password too short' });
    }

    // Validate phone
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    const existing = await Teacher.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const teacher = new Teacher({ name, phone, dept, pass });
    await teacher.save();

    res.json({ success: true, message: 'Registration successful', teacher });
  } catch (error) {
    console.error('Teacher register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Teacher Login
app.post('/api/teacher/login', async (req, res) => {
  try {
    const { phone, pass } = req.body;

    if (!phone || !pass) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    const teacher = await Teacher.findOne({ phone });
    if (!teacher) {
      return res.status(401).json({ success: false, message: 'Teacher not found' });
    }

    if (teacher.pass !== pass) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    res.json({ success: true, message: 'Login successful', teacher });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Get Department Leave Requests
app.get('/api/teacher/:dept/leave-requests', async (req, res) => {
  try {
    const { dept } = req.params;

    // Get all students in the department
    const students = await Student.find({ dept });
    const studentRegs = students.map(s => s.reg);

    // Get leave requests from students in this department
    const requests = await LeaveRequest.find({ studentReg: { $in: studentRegs } }).sort({ submittedAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Fetch department requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

// Approve Leave Request
app.put('/api/teacher/approve/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approvedBy } = req.body;

    const request = await LeaveRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'approved',
        approvedBy,
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Create notification for student
    const notification = new Notification({
      studentReg: request.studentReg,
      type: 'approved',
      title: 'Leave Request Approved ✅',
      message: `Your leave request for ${request.date} has been approved by ${approvedBy}.`
    });
    await notification.save();

    res.json({ success: true, message: 'Request approved', request });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve request' });
  }
});

// Reject Leave Request
app.put('/api/teacher/reject/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rejectedBy } = req.body;

    const request = await LeaveRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'rejected',
        rejectedBy,
        rejectedAt: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Create notification for student
    const notification = new Notification({
      studentReg: request.studentReg,
      type: 'rejected',
      title: 'Leave Request Rejected ❌',
      message: `Your leave request for ${request.date} has been rejected by ${rejectedBy}.`
    });
    await notification.save();

    res.json({ success: true, message: 'Request rejected', request });
  } catch (error) {
    console.error('Reject error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject request' });
  }
});

// ==================== NOTIFICATION ENDPOINTS ====================

// Get Student Notifications
app.get('/api/student/:reg/notifications', async (req, res) => {
  try {
    const { reg } = req.params;
    const notifications = await Notification.find({ studentReg: parseInt(reg) }).sort({ timestamp: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// Mark Notification as Read
app.put('/api/notification/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json({ success: true, notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
});

// ==================== CHANGE PASSWORD ====================

// Student Change Password
app.put('/api/student/:reg/change-password', async (req, res) => {
  try {
    const { reg } = req.params;
    const { currentPass, newPass } = req.body;

    const student = await Student.findOne({ reg: parseInt(reg) });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (student.pass !== currentPass) {
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    }

    student.pass = newPass;
    await student.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

// Teacher Change Password
app.put('/api/teacher/:phone/change-password', async (req, res) => {
  try {
    const { phone } = req.params;
    const { currentPass, newPass } = req.body;

    const teacher = await Teacher.findOne({ phone });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    if (teacher.pass !== currentPass) {
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    }

    teacher.pass = newPass;
    await teacher.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

// ==================== STATS ENDPOINTS ====================

// Get Student Stats
app.get('/api/student/:reg/stats', async (req, res) => {
  try {
    const { reg } = req.params;
    const requests = await LeaveRequest.find({ studentReg: parseInt(reg) });

    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// Get Teacher Stats
app.get('/api/teacher/:dept/stats', async (req, res) => {
  try {
    const { dept } = req.params;
    const students = await Student.find({ dept });
    const studentRegs = students.map(s => s.reg);
    const requests = await LeaveRequest.find({ studentReg: { $in: studentRegs } });

    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ==================== ATTENDANCE ENDPOINTS ====================

// Mark Attendance (Teacher)
app.post('/api/attendance/mark', async (req, res) => {
  try {
    const { studentReg, date, status, markedBy, remarks } = req.body;

    if (!studentReg || !date || !status || !markedBy) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!['present', 'absent', 'leave'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Update or create attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { studentReg: parseInt(studentReg), date },
      {
        studentReg: parseInt(studentReg),
        date,
        status,
        markedBy,
        remarks,
        markedAt: new Date(),
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Attendance marked', attendance });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark attendance' });
  }
});

// Bulk Mark Attendance (Teacher marks multiple at once)
app.post('/api/attendance/bulk-mark', async (req, res) => {
  try {
    const { attendanceRecords, markedBy } = req.body;

    if (!attendanceRecords || !Array.isArray(attendanceRecords) || !markedBy) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const results = [];
    for (const record of attendanceRecords) {
      const { studentReg, date, status, remarks } = record;

      const attendance = await Attendance.findOneAndUpdate(
        { studentReg: parseInt(studentReg), date },
        {
          studentReg: parseInt(studentReg),
          date,
          status,
          markedBy,
          remarks: remarks || null,
          markedAt: new Date(),
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
      results.push(attendance);
    }

    res.json({ success: true, message: `Marked ${results.length} attendance records`, results });
  } catch (error) {
    console.error('Bulk mark attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark attendance' });
  }
});

// Get Student Attendance (All records or by month)
app.get('/api/attendance/student/:reg', async (req, res) => {
  try {
    const { reg } = req.params;
    const { month } = req.query; // Format: YYYY-MM

    let query = { studentReg: parseInt(reg) };
    if (month) {
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });
    res.json({ success: true, attendance });
  } catch (error) {
    console.error('Fetch attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
});

// Get Class Attendance (Teacher view)
app.get('/api/attendance/class/:dept', async (req, res) => {
  try {
    const { dept } = req.params;
    const { startDate, endDate } = req.query;

    // Get all students in department
    const students = await Student.find({ dept });
    const studentRegs = students.map(s => s.reg);

    // Get attendance records
    let query = { studentReg: { $in: studentRegs } };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    // Calculate statistics
    const stats = {};
    students.forEach(student => {
      const studentAttendance = attendance.filter(a => a.studentReg === student.reg);
      const presentDays = studentAttendance.filter(a => a.status === 'present').length;
      const absentDays = studentAttendance.filter(a => a.status === 'absent').length;
      const leaveDays = studentAttendance.filter(a => a.status === 'leave').length;
      const totalDays = studentAttendance.length;
      const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

      stats[student.reg] = {
        name: student.name,
        reg: student.reg,
        presentDays,
        absentDays,
        leaveDays,
        totalDays,
        percentage: parseFloat(percentage),
        highAttendance: percentage >= 75
      };
    });

    // Class level stats
    const totalPresent = attendance.filter(a => a.status === 'present').length;
    const totalAbsent = attendance.filter(a => a.status === 'absent').length;
    const totalLeave = attendance.filter(a => a.status === 'leave').length;
    const classAverage = attendance.length > 0 
      ? ((totalPresent / attendance.length) * 100).toFixed(2) 
      : 0;

    res.json({
      success: true,
      classStats: {
        totalStudents: students.length,
        totalRecords: attendance.length,
        presentRecords: totalPresent,
        absentRecords: totalAbsent,
        leaveRecords: totalLeave,
        classAverage: parseFloat(classAverage),
        highAttendanceCount: Object.values(stats).filter(s => s.highAttendance).length
      },
      studentStats: stats,
      rawAttendance: attendance
    });
  } catch (error) {
    console.error('Fetch class attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch class attendance' });
  }
});

// Get Single Day Attendance (All students on a date)
app.get('/api/attendance/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const attendance = await Attendance.find({ date }).populate('studentReg');
    res.json({ success: true, attendance });
  } catch (error) {
    console.error('Fetch daily attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
});

// Delete Attendance Record
app.delete('/api/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.json({ success: true, message: 'Attendance record deleted' });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete attendance' });
  }
});

// Get Attendance by Date Range (Teacher export)
app.post('/api/attendance/report', async (req, res) => {
  try {
    const { startDate, endDate, dept } = req.body;

    if (!startDate || !endDate || !dept) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    const students = await Student.find({ dept });
    const studentRegs = students.map(s => s.reg);

    const attendance = await Attendance.find({
      studentReg: { $in: studentRegs },
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1, studentReg: 1 });

    res.json({ success: true, attendance, students });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
});

// ==================== AI ANALYSIS ENDPOINTS ====================

// Get All Requests Sorted by AI Priority (Teacher Dashboard)
app.get('/api/teacher/:dept/leave-requests/priority/sorted', async (req, res) => {
  try {
    const { dept } = req.params;
    const { status } = req.query; // Optional: filter by status

    // Get all students in the department
    const students = await Student.find({ dept });
    const studentRegs = students.map(s => s.reg);

    // Build query
    let query = { studentReg: { $in: studentRegs } };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    // Sort by: AI Priority (High → Normal → Low) → Status → Date
    const priorityOrder = { 'High': 0, 'Normal': 1, 'Low': 2 };
    const requests = await LeaveRequest.find(query);

    // Sort by priority
    requests.sort((a, b) => {
      const priorityA = priorityOrder[a.aiPriority] || 999;
      const priorityB = priorityOrder[b.aiPriority] || 999;
      
      if (priorityA !== priorityB) return priorityA - priorityB;
      
      // Then by status (pending first)
      const statusOrder = { 'pending': 0, 'approved': 1, 'rejected': 2 };
      const statusA = statusOrder[a.status] || 999;
      const statusB = statusOrder[b.status] || 999;
      
      if (statusA !== statusB) return statusA - statusB;
      
      // Then by date (newest first)
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Fetch priority sorted requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

// Get Requests by AI Category (Teacher Analytics)
app.get('/api/teacher/:dept/leave-requests/category/:category', async (req, res) => {
  try {
    const { dept, category } = req.params;

    // Validate category
    const validCategories = ['Medical', 'Emergency', 'Personal', 'Academic', 'Suspicious'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    // Get all students in the department
    const students = await Student.find({ dept });
    const studentRegs = students.map(s => s.reg);

    // Get requests with matching AI category
    const requests = await LeaveRequest.find({
      studentReg: { $in: studentRegs },
      aiCategory: category
    }).sort({ submittedAt: -1 });

    // Calculate statistics
    const stats = {
      totalInCategory: requests.length,
      byStatus: {
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length
      },
      avgConfidence: requests.length > 0 
        ? (requests.reduce((sum, r) => sum + r.aiConfidence, 0) / requests.length).toFixed(2)
        : 0
    };

    res.json({ success: true, category, stats, requests });
  } catch (error) {
    console.error('Fetch category requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

// Get AI Analytics for Department
app.get('/api/teacher/:dept/ai-analytics', async (req, res) => {
  try {
    const { dept } = req.params;

    // Get all students in the department
    const students = await Student.find({ dept });
    const studentRegs = students.map(s => s.reg);

    // Get all leave requests from students in department
    const requests = await LeaveRequest.find({ studentReg: { $in: studentRegs } });

    // Calculate analytics by category
    const categoryStats = {
      Medical: {
        count: requests.filter(r => r.aiCategory === 'Medical').length,
        approved: requests.filter(r => r.aiCategory === 'Medical' && r.status === 'approved').length,
        rejected: requests.filter(r => r.aiCategory === 'Medical' && r.status === 'rejected').length,
        pending: requests.filter(r => r.aiCategory === 'Medical' && r.status === 'pending').length
      },
      Emergency: {
        count: requests.filter(r => r.aiCategory === 'Emergency').length,
        approved: requests.filter(r => r.aiCategory === 'Emergency' && r.status === 'approved').length,
        rejected: requests.filter(r => r.aiCategory === 'Emergency' && r.status === 'rejected').length,
        pending: requests.filter(r => r.aiCategory === 'Emergency' && r.status === 'pending').length
      },
      Personal: {
        count: requests.filter(r => r.aiCategory === 'Personal').length,
        approved: requests.filter(r => r.aiCategory === 'Personal' && r.status === 'approved').length,
        rejected: requests.filter(r => r.aiCategory === 'Personal' && r.status === 'rejected').length,
        pending: requests.filter(r => r.aiCategory === 'Personal' && r.status === 'pending').length
      },
      Academic: {
        count: requests.filter(r => r.aiCategory === 'Academic').length,
        approved: requests.filter(r => r.aiCategory === 'Academic' && r.status === 'approved').length,
        rejected: requests.filter(r => r.aiCategory === 'Academic' && r.status === 'rejected').length,
        pending: requests.filter(r => r.aiCategory === 'Academic' && r.status === 'pending').length
      },
      Suspicious: {
        count: requests.filter(r => r.aiCategory === 'Suspicious').length,
        approved: requests.filter(r => r.aiCategory === 'Suspicious' && r.status === 'approved').length,
        rejected: requests.filter(r => r.aiCategory === 'Suspicious' && r.status === 'rejected').length,
        pending: requests.filter(r => r.aiCategory === 'Suspicious' && r.status === 'pending').length
      }
    };

    // Calculate priority statistics
    const priorityStats = {
      High: {
        count: requests.filter(r => r.aiPriority === 'High').length,
        approved: requests.filter(r => r.aiPriority === 'High' && r.status === 'approved').length,
        rejected: requests.filter(r => r.aiPriority === 'High' && r.status === 'rejected').length,
        pending: requests.filter(r => r.aiPriority === 'High' && r.status === 'pending').length
      },
      Normal: {
        count: requests.filter(r => r.aiPriority === 'Normal').length,
        approved: requests.filter(r => r.aiPriority === 'Normal' && r.status === 'approved').length,
        rejected: requests.filter(r => r.aiPriority === 'Normal' && r.status === 'rejected').length,
        pending: requests.filter(r => r.aiPriority === 'Normal' && r.status === 'pending').length
      },
      Low: {
        count: requests.filter(r => r.aiPriority === 'Low').length,
        approved: requests.filter(r => r.aiPriority === 'Low' && r.status === 'approved').length,
        rejected: requests.filter(r => r.aiPriority === 'Low' && r.status === 'rejected').length,
        pending: requests.filter(r => r.aiPriority === 'Low' && r.status === 'pending').length
      }
    };

    // Overall confidence analysis
    const avgConfidence = requests.length > 0
      ? (requests.reduce((sum, r) => sum + r.aiConfidence, 0) / requests.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      department: dept,
      totalRequests: requests.length,
      avgConfidence: parseFloat(avgConfidence),
      categoryStats,
      priorityStats
    });
  } catch (error) {
    console.error('Fetch AI analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

// Test AI Analyzer (Debug endpoint)
app.post('/api/ai/test-analyze', async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Reason required' });
    }

    const analysis = analyzeReason(reason);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Test analyze error:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze' });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📚 API Documentation available at http://localhost:${PORT}/api/');
});
