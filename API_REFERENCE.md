# 📚 Smart Campus API Reference

## Base URL
```
http://localhost:5000/api
```

---

## 📤 Response Format

All responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🎓 Student Endpoints

### Register Student

```
POST /student/register

Request Body:
{
  "name": "John Doe",
  "reg": 1225,
  "phone": "9876543210",
  "dept": "CSE",
  "pass": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Registration successful",
  "student": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "reg": 1225,
    "phone": "9876543210",
    "dept": "CSE",
    "createdAt": "2026-02-07T10:30:00Z"
  }
}

Validation Rules:
- name: Required, non-empty
- reg: Required, 1225-1885, unique
- phone: Required, exactly 10 digits
- dept: Required, must match department list
- pass: Required, minimum 4 characters
```

### Login Student

```
POST /student/login

Request Body:
{
  "reg": 1225,
  "pass": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Login successful",
  "student": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "reg": 1225,
    "phone": "9876543210",
    "dept": "CSE"
  }
}

Status Codes:
- 200: Login successful
- 400: Missing credentials
- 401: Student not found or invalid password
- 500: Server error
```

### Get Student Leave Requests

```
GET /student/:reg/leave-requests

URL Parameters:
- reg: Student register number (integer)

Response:
{
  "success": true,
  "requests": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studentReg": 1225,
      "studentName": "John Doe",
      "date": "2026-02-15",
      "reason": "Medical appointment",
      "status": "pending",
      "submittedAt": "2026-02-07T10:30:00Z",
      "proofFile": {
        "name": "doctor_note.pdf",
        "type": "application/pdf",
        "data": "base64_encoded_file"
      }
    }
  ]
}

Filter by status: Use JavaScript filter after fetching
```

### Submit Leave Request

```
POST /student/leave-request

Request Body:
{
  "studentReg": 1225,
  "studentName": "John Doe",
  "date": "2026-02-15",
  "reason": "Medical appointment",
  "proofFile": {
    "name": "doctor_note.pdf",
    "type": "application/pdf",
    "data": "base64_encoded_content"
  },
  "parentLetter": {
    "name": "parent_letter.pdf",
    "type": "application/pdf",
    "data": "base64_encoded_content"
  }
}

Response:
{
  "success": true,
  "message": "Leave request submitted",
  "leaveRequest": { ... }
}

Validation:
- Date must be future or today
- Reason required, min 10 characters
- Files must be < 5MB
- Supported file types: PDF, JPG, PNG, DOCX
```

### Get Student Notifications

```
GET /student/:reg/notifications

URL Parameters:
- reg: Student register number

Response:
{
  "success": true,
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studentReg": 1225,
      "type": "approved",
      "title": "Leave Request Approved ✅",
      "message": "Your leave request for 2026-02-15 has been approved",
      "timestamp": "2026-02-07T11:00:00Z",
      "read": false
    }
  ]
}

Notification Types:
- "approved": Leave approved by teacher
- "rejected": Leave rejected by teacher
- "pending": New leave request status
```

### Mark Notification as Read

```
PUT /notification/:id/read

URL Parameters:
- id: Notification MongoDB ID

Response:
{
  "success": true,
  "notification": { ... }
}
```

### Change Student Password

```
PUT /student/:reg/change-password

URL Parameters:
- reg: Student register number

Request Body:
{
  "currentPass": "oldpassword123",
  "newPass": "newpassword456"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}

Validation:
- Current password must match
- New password must be different
- New password min 4 characters
```

### Get Student Statistics

```
GET /student/:reg/stats

Response:
{
  "success": true,
  "stats": {
    "total": 5,
    "pending": 1,
    "approved": 3,
    "rejected": 1
  }
}
```

### Get Student Attendance

```
GET /attendance/student/:reg?month=2026-02

URL Parameters:
- reg: Student register number
- month (optional): YYYY-MM format

Response:
{
  "success": true,
  "attendance": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studentReg": 1225,
      "date": "2026-02-07",
      "status": "present",
      "markedBy": "9876543211",
      "markedAt": "2026-02-07T09:00:00Z"
    }
  ]
}

Status Values:
- "present": Student present
- "absent": Student absent
- "leave": Student on approved leave
```

---

## 👨‍🏫 Teacher Endpoints

### Register Teacher

```
POST /teacher/register

Request Body:
{
  "name": "Dr. Smith",
  "phone": "9876543211",
  "dept": "CSE",
  "pass": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "teacher": { ... }
}

Validation:
- phone: Unique, exactly 10 digits
- dept: Must match department list
- pass: Minimum 4 characters
```

### Login Teacher

```
POST /teacher/login

Request Body:
{
  "phone": "9876543211",
  "pass": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "teacher": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dr. Smith",
    "phone": "9876543211",
    "dept": "CSE"
  }
}
```

### Get Department Leave Requests

```
GET /teacher/:dept/leave-requests

URL Parameters:
- dept: Department code (e.g., "CSE")

Response:
{
  "success": true,
  "requests": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studentReg": 1225,
      "studentName": "John Doe",
      "date": "2026-02-15",
      "reason": "Medical appointment",
      "status": "pending",
      "submittedAt": "2026-02-07T10:30:00Z"
    }
  ]
}

Filter by status: Use JavaScript filter
```

### Approve Leave Request

```
PUT /teacher/approve/:requestId

URL Parameters:
- requestId: Leave request MongoDB ID

Request Body:
{
  "approvedBy": "Dr. Smith"
}

Response:
{
  "success": true,
  "message": "Request approved",
  "request": {
    ...
    "status": "approved",
    "approvedBy": "Dr. Smith",
    "approvedAt": "2026-02-07T11:00:00Z"
  }
}

Side Effects:
- Creates notification for student
- Updates request status
```

### Reject Leave Request

```
PUT /teacher/reject/:requestId

URL Parameters:
- requestId: Leave request MongoDB ID

Request Body:
{
  "rejectedBy": "Dr. Smith"
}

Response:
{
  "success": true,
  "message": "Request rejected",
  "request": {
    ...
    "status": "rejected",
    "rejectedBy": "Dr. Smith",
    "rejectedAt": "2026-02-07T11:00:00Z"
  }
}
```

### Change Teacher Password

```
PUT /teacher/:phone/change-password

URL Parameters:
- phone: Teacher phone number

Request Body:
{
  "currentPass": "oldpassword123",
  "newPass": "newpassword456"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Get Department Statistics

```
GET /teacher/:dept/stats

Response:
{
  "success": true,
  "stats": {
    "total": 50,
    "pending": 5,
    "approved": 40,
    "rejected": 5
  }
}
```

---

## 📅 Attendance Endpoints

### Mark Single Attendance

```
POST /attendance/mark

Request Body:
{
  "studentReg": 1225,
  "date": "2026-02-07",
  "status": "present",
  "markedBy": "9876543211",
  "remarks": "Regular class"
}

Response:
{
  "success": true,
  "message": "Attendance marked",
  "attendance": {
    "_id": "507f1f77bcf86cd799439011",
    "studentReg": 1225,
    "date": "2026-02-07",
    "status": "present",
    "markedBy": "9876543211",
    "markedAt": "2026-02-07T09:00:00Z",
    "remarks": "Regular class"
  }
}

Validation:
- status: "present" | "absent" | "leave"
- date: YYYY-MM-DD format
- Can update existing records
```

### Bulk Mark Attendance

```
POST /attendance/bulk-mark

Request Body:
{
  "markedBy": "9876543211",
  "attendanceRecords": [
    { "studentReg": 1225, "date": "2026-02-07", "status": "present", "remarks": "" },
    { "studentReg": 1226, "date": "2026-02-07", "status": "absent", "remarks": "Sick leave" }
  ]
}

Response:
{
  "success": true,
  "message": "Marked 2 attendance records",
  "results": [ ... ]
}

Benefits:
- Mark multiple students at once
- Faster than individual requests
- Single database transaction
```

### Get Student Attendance

```
GET /attendance/student/:reg?month=2026-02

URL Parameters:
- reg: Student register number
- month (optional): YYYY-MM format

Response:
{
  "success": true,
  "attendance": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studentReg": 1225,
      "date": "2026-02-07",
      "status": "present",
      "markedBy": "9876543211",
      "markedAt": "2026-02-07T09:00:00Z",
      "updatedAt": "2026-02-07T14:30:00Z"
    }
  ]
}
```

### Get Class Attendance (Dashboard)

```
GET /attendance/class/:dept?startDate=2026-02-01&endDate=2026-02-28

URL Parameters:
- dept: Department code
- startDate (optional): YYYY-MM-DD
- endDate (optional): YYYY-MM-DD

Response:
{
  "success": true,
  "classStats": {
    "totalStudents": 50,
    "totalRecords": 450,
    "presentRecords": 400,
    "absentRecords": 30,
    "leaveRecords": 20,
    "classAverage": 88.89,
    "highAttendanceCount": 45
  },
  "studentStats": {
    "1225": {
      "name": "John Doe",
      "reg": 1225,
      "presentDays": 20,
      "absentDays": 1,
      "leaveDays": 0,
      "totalDays": 21,
      "percentage": 95.24,
      "highAttendance": true
    }
  },
  "rawAttendance": [ ... ]
}

Calculations:
- Class Average = (Present Records) / (Total Records) * 100
- Student % = (Present Days) / (Total Days) * 100
- High Attendance = percentage >= 75%
```

### Get Single Day Attendance

```
GET /attendance/date/:date

URL Parameters:
- date: YYYY-MM-DD

Response:
{
  "success": true,
  "attendance": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studentReg": 1225,
      "date": "2026-02-07",
      "status": "present",
      "markedBy": "9876543211"
    }
  ]
}
```

### Delete Attendance Record

```
DELETE /attendance/:id

URL Parameters:
- id: Attendance record MongoDB ID

Response:
{
  "success": true,
  "message": "Attendance record deleted"
}
```

### Generate Attendance Report

```
POST /attendance/report

Request Body:
{
  "startDate": "2026-02-01",
  "endDate": "2026-02-28",
  "dept": "CSE"
}

Response:
{
  "success": true,
  "attendance": [ ... ],
  "students": [ ... ]
}

Use Cases:
- Export to Excel/PDF
- Attendance analysis
- Email to parents
```

---

## 🏥 Health & Status Endpoints

### Health Check

```
GET /health

Response:
{
  "success": true,
  "message": "Backend is running"
}

Purpose:
- Verify backend is online
- Can be used for monitoring
- No authentication required
```

---

## 🔐 Authentication Notes

### Current Implementation
- No JWT tokens (uses session in frontend)
- Passwords stored as plain text (development only)
- Department-based access control

### Future Security
```javascript
// Will implement:
- JWT tokens for stateless authentication
- Password hashing with bcryptjs
- Refresh token rotation
- Rate limiting
- HTTPS enforcement
```

---

## ⚠️ Error Codes

| Code | Meaning |
|------|---------|
| 200 | Request successful |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (wrong credentials) |
| 404 | Resource not found |
| 500 | Server error |

---

## 📊 Data Formats

### Date Format
All dates use ISO 8601:
- Date only: `YYYY-MM-DD` (e.g., `2026-02-07`)
- Datetime: `2026-02-07T10:30:00Z`

### Status Values

**Leave Request Status:**
- `pending` - Awaiting teacher approval
- `approved` - Approved by teacher
- `rejected` - Rejected by teacher

**Attendance Status:**
- `present` - Student attended
- `absent` - Student absent
- `leave` - Student on approved leave

**Notification Type:**
- `approved` - Leave request approved
- `rejected` - Leave request rejected
- `pending` - Leave request submitted

---

## 🔗 API Testing Tools

### cURL Examples

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

# Get Class Attendance
curl "http://localhost:5000/api/attendance/class/CSE?startDate=2026-02-01&endDate=2026-02-28"
```

### Postman Collection
Create a new collection and add requests for each endpoint listed above.

---

## 📈 Rate Limiting (Future)

Currently no rate limiting. Will implement:
```
- 100 requests per minute per IP
- 50 requests per minute per user
- Authentication required for production
```

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-07 | Initial release with all endpoints |

---

**Status**: ✅ COMPLETE  
**Last Updated**: February 7, 2026
