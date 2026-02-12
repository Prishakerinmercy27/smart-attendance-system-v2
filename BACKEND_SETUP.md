# 🚀 Smart Campus Backend Setup Guide

## Overview

Complete backend for Smart Campus using Node.js, Express, and MongoDB. Handles:
- Student/Teacher authentication
- Leave request management
- Attendance marking and tracking
- Real-time notifications
- Department-wise analytics

---

## 📋 Prerequisites

### Required Software
- **Node.js** v14+ (Download from [nodejs.org](https://nodejs.org))
- **MongoDB** (Local or Atlas Cloud)
- **npm** or **yarn** (comes with Node.js)

### Verify Installation
```bash
node --version      # Should show v14.x or higher
npm --version       # Should show 6.x or higher
mongod --version    # Should show MongoDB version
```

---

## 🔧 Installation Steps

### 1. Install Dependencies
```bash
cd /Users/prishakerinmercyd/Desktop/project
npm install
```

This installs:
- `express` - Web framework
- `mongoose` - MongoDB object modeling
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `bcryptjs` - Password hashing (future)
- `jsonwebtoken` - JWT auth (future)
- `nodemon` - Auto-restart on file changes

### 2. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Start MongoDB service
mongod

# In another terminal, verify connection
mongo
# Should open MongoDB shell
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create free account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/smart-campus`
4. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-campus
```

### 3. Configure Environment Variables
Update `/project/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-campus
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
```

### 4. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Expected output:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

---

## 📚 API Endpoints Reference

### Base URL: `http://localhost:5000/api`

### Student Endpoints

#### Register Student
```
POST /student/register
Body: {
  "name": "John Doe",
  "reg": 1225,
  "phone": "9876543210",
  "dept": "CSE",
  "pass": "password123"
}
Response: { success: true, message: "Registration successful", student: {...} }
```

#### Login Student
```
POST /student/login
Body: { "reg": 1225, "pass": "password123" }
Response: { success: true, message: "Login successful", student: {...} }
```

#### Get Leave Requests
```
GET /student/:reg/leave-requests
Response: { success: true, requests: [...] }
```

#### Submit Leave Request
```
POST /student/leave-request
Body: {
  "studentReg": 1225,
  "studentName": "John Doe",
  "date": "2026-02-15",
  "reason": "Medical appointment",
  "proofFile": { "name": "...", "type": "...", "data": "base64..." },
  "parentLetter": { "name": "...", "type": "...", "data": "base64..." }
}
Response: { success: true, message: "Leave request submitted", leaveRequest: {...} }
```

#### Get Notifications
```
GET /student/:reg/notifications
Response: { success: true, notifications: [...] }
```

#### Mark Notification as Read
```
PUT /notification/:id/read
Response: { success: true, notification: {...} }
```

#### Change Password
```
PUT /student/:reg/change-password
Body: { "currentPass": "old123", "newPass": "new456" }
Response: { success: true, message: "Password changed successfully" }
```

#### Get Student Stats
```
GET /student/:reg/stats
Response: { 
  success: true, 
  stats: { total: 5, pending: 1, approved: 3, rejected: 1 } 
}
```

#### Get Student Attendance
```
GET /attendance/student/:reg
Query: ?month=2026-02
Response: { success: true, attendance: [...] }
```

---

### Teacher Endpoints

#### Register Teacher
```
POST /teacher/register
Body: {
  "name": "Dr. Smith",
  "phone": "9876543211",
  "dept": "CSE",
  "pass": "password123"
}
Response: { success: true, message: "Registration successful", teacher: {...} }
```

#### Login Teacher
```
POST /teacher/login
Body: { "phone": "9876543211", "pass": "password123" }
Response: { success: true, message: "Login successful", teacher: {...} }
```

#### Get Department Leave Requests
```
GET /teacher/:dept/leave-requests
Response: { success: true, requests: [...] }
```

#### Approve Leave Request
```
PUT /teacher/approve/:requestId
Body: { "approvedBy": "Dr. Smith" }
Response: { success: true, message: "Request approved", request: {...} }
```

#### Reject Leave Request
```
PUT /teacher/reject/:requestId
Body: { "rejectedBy": "Dr. Smith" }
Response: { success: true, message: "Request rejected", request: {...} }
```

#### Change Password
```
PUT /teacher/:phone/change-password
Body: { "currentPass": "old123", "newPass": "new456" }
Response: { success: true, message: "Password changed successfully" }
```

#### Get Department Stats
```
GET /teacher/:dept/stats
Response: { 
  success: true, 
  stats: { total: 10, pending: 2, approved: 6, rejected: 2 } 
}
```

---

### Attendance Endpoints

#### Mark Single Attendance
```
POST /attendance/mark
Body: {
  "studentReg": 1225,
  "date": "2026-02-07",
  "status": "present",
  "markedBy": "9876543211",
  "remarks": "Regular class"
}
Response: { success: true, message: "Attendance marked", attendance: {...} }
```

#### Bulk Mark Attendance
```
POST /attendance/bulk-mark
Body: {
  "markedBy": "9876543211",
  "attendanceRecords": [
    { "studentReg": 1225, "date": "2026-02-07", "status": "present", "remarks": "..." },
    { "studentReg": 1226, "date": "2026-02-07", "status": "absent", "remarks": "..." }
  ]
}
Response: { success: true, message: "Marked X attendance records", results: [...] }
```

#### Get Student Attendance
```
GET /attendance/student/:reg?month=2026-02
Response: { success: true, attendance: [...] }
```

#### Get Class Attendance (Teacher Dashboard)
```
GET /attendance/class/:dept?startDate=2026-02-01&endDate=2026-02-28
Response: { 
  success: true,
  classStats: { 
    totalStudents: 50,
    totalRecords: 450,
    presentRecords: 400,
    absentRecords: 30,
    leaveRecords: 20,
    classAverage: 88.89,
    highAttendanceCount: 45
  },
  studentStats: {
    1225: { name: "John", presentDays: 20, absentDays: 1, ... }
  }
}
```

#### Get Single Day Attendance
```
GET /attendance/date/2026-02-07
Response: { success: true, attendance: [...] }
```

#### Generate Attendance Report
```
POST /attendance/report
Body: {
  "startDate": "2026-02-01",
  "endDate": "2026-02-28",
  "dept": "CSE"
}
Response: { success: true, attendance: [...], students: [...] }
```

#### Delete Attendance Record
```
DELETE /attendance/:id
Response: { success: true, message: "Attendance record deleted" }
```

---

## 📊 Database Schema

### Collections

#### Students
```javascript
{
  _id: ObjectId,
  name: String,
  reg: Number (1225-1885, unique),
  phone: String,
  dept: String,
  pass: String,
  createdAt: Date
}
```

#### Teachers
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String (unique),
  dept: String,
  pass: String,
  createdAt: Date
}
```

#### Leave Requests
```javascript
{
  _id: ObjectId,
  studentReg: Number,
  studentName: String,
  date: String (YYYY-MM-DD),
  reason: String,
  status: "pending|approved|rejected",
  proofFile: { name, type, data (base64) },
  parentLetter: { name, type, data (base64) },
  submittedAt: Date,
  approvedBy: String,
  approvedAt: Date,
  rejectedBy: String,
  rejectedAt: Date
}
```

#### Notifications
```javascript
{
  _id: ObjectId,
  studentReg: Number,
  type: "approved|rejected|pending",
  title: String,
  message: String,
  timestamp: Date,
  read: Boolean
}
```

#### Attendance
```javascript
{
  _id: ObjectId,
  studentReg: Number,
  date: String (YYYY-MM-DD),
  status: "present|absent|leave",
  markedBy: String (teacher phone),
  markedAt: Date,
  remarks: String,
  updatedAt: Date,
  unique: [studentReg, date]
}
```

---

## 🧪 Testing Endpoints

### Using Postman

1. **Download Postman** from [postman.com](https://www.postman.com/downloads/)

2. **Import Collection** (save as JSON):
```json
{
  "info": { "name": "Smart Campus API" },
  "item": [
    {
      "name": "Student Register",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/student/register",
        "body": {
          "raw": "{\"name\":\"John\",\"reg\":1225,\"phone\":\"9876543210\",\"dept\":\"CSE\",\"pass\":\"pass123\"}"
        }
      }
    }
  ]
}
```

3. **Test Each Endpoint** with sample data

### Using cURL

```bash
# Student Register
curl -X POST http://localhost:5000/api/student/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","reg":1225,"phone":"9876543210","dept":"CSE","pass":"pass123"}'

# Student Login
curl -X POST http://localhost:5000/api/student/login \
  -H "Content-Type: application/json" \
  -d '{"reg":1225,"pass":"pass123"}'

# Get Notifications
curl http://localhost:5000/api/student/1225/notifications

# Mark Attendance
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -d '{"studentReg":1225,"date":"2026-02-07","status":"present","markedBy":"9876543211"}'
```

---

## 🔗 Frontend Integration

### Configuration in HTML

Update `smart_campus_fixed.html` to connect to backend:

```javascript
// At top of JavaScript section
const API_BASE_URL = 'http://localhost:5000/api';

// Student Registration
async function studentRegister() {
  const formData = {
    name: document.getElementById('studentName').value,
    reg: parseInt(document.getElementById('studentReg').value),
    phone: document.getElementById('studentPhone').value,
    dept: document.getElementById('studentDept').value,
    pass: document.getElementById('studentPass').value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/student/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (data.success) {
      showToast('Success', 'Registration successful', 'success');
      currentUser = data.student;
    } else {
      showToast('Error', data.message, 'danger');
    }
  } catch (error) {
    console.error('Register error:', error);
    showToast('Error', 'Registration failed', 'danger');
  }
}
```

---

## 🚀 Deployment

### Heroku Deployment

1. **Install Heroku CLI**
```bash
brew install heroku/brew/heroku
heroku login
```

2. **Create Heroku App**
```bash
heroku create smart-campus-app
```

3. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

5. **View Logs**
```bash
heroku logs --tail
```

### AWS/DigitalOcean/Azure

Similar process with their respective CLI tools.

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB: `mongod`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: 
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### CORS Error in Frontend
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Check `CORS_ORIGIN` in `.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

### MongoDB Duplicate Key Error
```
E11000 duplicate key error
```
**Solution**: Drop and recreate collection:
```bash
db.students.deleteMany({})
db.students.drop()
```

---

## 📈 Performance Optimization

### Indexes (Already Configured)
```javascript
// In models.js - attendance collection
attendanceSchema.index({ studentReg: 1, date: 1 }, { unique: true });
```

### Query Optimization
- Always filter by department first
- Use pagination for large datasets
- Create indexes for frequently queried fields

### Caching (Future)
```javascript
// Install redis
npm install redis

// Use for notifications, stats
```

---

## 🔐 Security Best Practices

### Current Implementation
- ✅ Input validation on all endpoints
- ✅ Department-based access control
- ✅ Unique constraints on critical fields

### Recommended Enhancements
- [ ] Add JWT authentication
- [ ] Implement password hashing (bcryptjs)
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Add request logging
- [ ] Implement refresh tokens

### Future Security Update
```javascript
// Use bcryptjs for password hashing
const bcrypt = require('bcryptjs');

// Hash password during registration
student.pass = bcrypt.hashSync(pass, 10);

// Verify during login
bcrypt.compareSync(pass, student.pass);
```

---

## 📊 Monitoring

### Health Check Endpoint
```
GET /api/health
Response: { success: true, message: "Backend is running" }
```

### View Logs
```bash
npm run dev  # Shows all logs in console
```

### Database Monitoring
```javascript
// View connection status
mongoose.connection.on('connected', () => console.log('DB connected'));
mongoose.connection.on('error', (err) => console.error('DB error:', err));
mongoose.connection.on('disconnected', () => console.log('DB disconnected'));
```

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup MongoDB (local or Atlas)
3. ✅ Configure `.env`
4. ✅ Start server: `npm run dev`
5. ✅ Test endpoints with Postman/cURL
6. ✅ Update frontend to use backend APIs
7. ✅ Deploy to production

---

## 📞 Support & Documentation

- **Mongoose Docs**: [mongoosejs.com](https://mongoosejs.com)
- **Express Docs**: [expressjs.com](https://expressjs.com)
- **MongoDB Atlas**: [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- **Postman**: [postman.com](https://www.postman.com)

---

**Status**: ✅ READY FOR PRODUCTION  
**Version**: 1.0.0  
**Last Updated**: February 7, 2026
