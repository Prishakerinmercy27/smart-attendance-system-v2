# Smart Campus - Attendance & Leave Management System
## Database Setup & Backend Server

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or MongoDB Atlas Cloud)
- npm or yarn

---

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup

#### Option A: Local MongoDB (Recommended for Development)
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
# Run the installer and follow instructions
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/smart-campus`
5. Update `.env` with your connection string

### 3. Configure Environment Variables
Update `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/smart-campus
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_change_this_in_production
```

### 4. Start the Server
```bash
npm start
```

Server will run on **http://localhost:5000**

---

## API Endpoints

### Student Endpoints

#### Register
```
POST /api/student/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "dept": "CSE",
  "reg": 1250,
  "pass": "password123"
}
```

#### Login
```
POST /api/student/login
{
  "reg": 1250,
  "pass": "password123"
}
```

#### Submit Leave Request
```
POST /api/student/leave-request
{
  "studentReg": 1250,
  "studentName": "John Doe",
  "date": "2026-02-10",
  "reason": "Medical appointment",
  "proofFile": { "name": "cert.pdf", "type": "application/pdf", "data": "base64..." },
  "parentLetter": null
}
```

#### Get Leave Requests
```
GET /api/student/{reg}/leave-requests
```

#### Get Notifications
```
GET /api/student/{reg}/notifications
```

#### Mark Notification as Read
```
PUT /api/notification/{id}/read
```

#### Change Password
```
PUT /api/student/{reg}/change-password
{
  "currentPass": "old_password",
  "newPass": "new_password"
}
```

#### Get Stats
```
GET /api/student/{reg}/stats
```

---

### Teacher Endpoints

#### Register
```
POST /api/teacher/register
{
  "name": "Dr. Smith",
  "phone": "9876543210",
  "dept": "CSE",
  "pass": "password123"
}
```

#### Login
```
POST /api/teacher/login
{
  "phone": "9876543210",
  "pass": "password123"
}
```

#### Get Department Leave Requests
```
GET /api/teacher/{dept}/leave-requests
```

#### Approve Leave Request
```
PUT /api/teacher/approve/{requestId}
{
  "approvedBy": "Dr. Smith"
}
```

#### Reject Leave Request
```
PUT /api/teacher/reject/{requestId}
{
  "rejectedBy": "Dr. Smith"
}
```

#### Change Password
```
PUT /api/teacher/{phone}/change-password
{
  "currentPass": "old_password",
  "newPass": "new_password"
}
```

#### Get Stats
```
GET /api/teacher/{dept}/stats
```

---

## Running the Application

### 1. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows (if installed as service)
# Already running in background
```

### 2. Start Backend Server
```bash
npm start
```

### 3. Open Frontend
- Open `smart_campus_fixed.html` in your browser
- Or serve it via a local server:
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server
```

Then visit: **http://localhost:8000**

---

## Database Schema

### Students Collection
```javascript
{
  _id: ObjectId,
  name: String,
  reg: Number (unique, 1225-1885),
  phone: String,
  dept: String,
  pass: String,
  createdAt: Date
}
```

### Teachers Collection
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

### LeaveRequests Collection
```javascript
{
  _id: ObjectId,
  studentReg: Number,
  studentName: String,
  date: String (YYYY-MM-DD),
  reason: String,
  status: String (pending/approved/rejected),
  proofFile: {
    name: String,
    type: String,
    data: String (base64)
  },
  parentLetter: {
    name: String,
    type: String,
    data: String (base64)
  },
  submittedAt: Date,
  approvedBy: String,
  approvedAt: Date,
  rejectedBy: String,
  rejectedAt: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  studentReg: Number,
  type: String (approved/rejected),
  title: String,
  message: String,
  timestamp: Date,
  read: Boolean
}
```

---

## Project Structure
```
project/
├── server.js              # Express server & API routes
├── models.js              # MongoDB schemas
├── package.json           # Dependencies
├── .env                   # Environment variables
├── smart_campus_fixed.html # Frontend (to be updated)
└── README.md              # This file
```

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `brew services list` (macOS)
- Check MONGODB_URI in `.env`
- Try restarting MongoDB service

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Security Notes (For Production)
1. Hash passwords with bcryptjs
2. Use JWT for authentication
3. Validate & sanitize all inputs
4. Use HTTPS
5. Add rate limiting
6. Implement proper error handling
7. Add request validation middleware
8. Use environment-specific configurations

---

## Next Steps
1. Update `smart_campus_fixed.html` to use API endpoints instead of localStorage
2. Add JWT authentication tokens
3. Implement input validation on backend
4. Add request logging & monitoring
5. Deploy to production (Heroku, AWS, DigitalOcean, etc.)

---

**Created by:** Prisha Kerin Mercy  
**Last Updated:** February 2026
