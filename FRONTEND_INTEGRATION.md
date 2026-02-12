# 🔗 Frontend-Backend Integration Guide

## Overview

This guide explains how to connect your existing HTML frontend to the Node.js/Express backend.

---

## 📋 Changes Required in smart_campus_fixed.html

### 1. Add API Configuration

Add this at the very top of the `<script>` section (around line 1700):

```javascript
// ==================== API CONFIGURATION ====================
const API_BASE_URL = 'http://localhost:5000/api';
const USE_BACKEND = true; // Set to false to use localStorage (development mode)

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'Network error. Using local data.' };
  }
}
```

---

## 📝 Updated Functions

### Student Registration

**Replace** the `studentRegister()` function:

```javascript
async function studentRegister() {
  const name = document.getElementById('studentName').value.trim();
  const reg = document.getElementById('studentReg').value.trim();
  const phone = document.getElementById('studentPhone').value.trim();
  const dept = document.getElementById('studentDept').value.trim();
  const pass = document.getElementById('studentPass').value.trim();

  // Validation
  if (!name || !reg || !pass || !dept) {
    showMessage('studentRegMsg', 'Please fill all fields', 'danger');
    return;
  }

  const regNum = parseInt(reg);
  if (isNaN(regNum) || regNum < 1225 || regNum > 1885) {
    showMessage('studentRegMsg', 'Invalid register number (1225-1885)', 'danger');
    return;
  }

  if (pass.length < 4) {
    showMessage('studentRegMsg', 'Password must be at least 4 characters', 'danger');
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    showMessage('studentRegMsg', 'Phone must be 10 digits', 'danger');
    return;
  }

  try {
    const result = await apiCall('/student/register', 'POST', {
      name,
      reg: regNum,
      phone,
      dept,
      pass
    });

    if (result.success) {
      showMessage('studentRegMsg', 'Registration successful! Please login.', 'success');
      setTimeout(() => {
        document.getElementById('studentRegForm').reset();
        showPage('studentLogin');
      }, 1500);
    } else {
      showMessage('studentRegMsg', result.message || 'Registration failed', 'danger');
    }
  } catch (error) {
    console.error('Register error:', error);
    showMessage('studentRegMsg', 'Registration failed', 'danger');
  }
}
```

### Student Login

**Replace** the `studentLogin()` function:

```javascript
async function studentLogin() {
  const reg = document.getElementById('studentLoginReg').value.trim();
  const pass = document.getElementById('studentLoginPass').value.trim();

  if (!reg || !pass) {
    showMessage('studentLoginMsg', 'Please enter register number and password', 'danger');
    return;
  }

  const regNum = parseInt(reg);
  if (isNaN(regNum)) {
    showMessage('studentLoginMsg', 'Invalid register number', 'danger');
    return;
  }

  try {
    const result = await apiCall('/student/login', 'POST', {
      reg: regNum,
      pass
    });

    if (result.success) {
      currentUser = result.student;
      userType = 'student';
      showToast('Success', 'Login successful!', 'success');
      
      // Load student data
      loadStudentPortal();
      showPage('studentPortal');
      
      document.getElementById('studentLoginForm').reset();
    } else {
      showMessage('studentLoginMsg', result.message || 'Login failed', 'danger');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage('studentLoginMsg', 'Login failed', 'danger');
  }
}
```

### Submit Leave Request

**Replace** the `submitLeaveRequest()` function:

```javascript
async function submitLeaveRequest() {
  const date = document.getElementById('leaveDate').value;
  const reason = document.getElementById('leaveReason').value.trim();

  if (!date || !reason) {
    showMessage('leaveMsg', 'Please fill all required fields', 'danger');
    return;
  }

  const formData = {
    studentReg: currentUser.reg,
    studentName: currentUser.name,
    date,
    reason,
    proofFile: null,
    parentLetter: null
  };

  // Handle file uploads
  const proofInput = document.getElementById('proofFile');
  const parentInput = document.getElementById('parentLetterFile');

  if (proofInput && proofInput.files.length > 0) {
    const file = proofInput.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showMessage('leaveMsg', 'File size must be less than 5MB', 'danger');
      return;
    }
    formData.proofFile = await fileToBase64(file);
  }

  if (parentInput && parentInput.files.length > 0) {
    const file = parentInput.files[0];
    if (file.size > 5 * 1024 * 1024) {
      showMessage('leaveMsg', 'File size must be less than 5MB', 'danger');
      return;
    }
    formData.parentLetter = await fileToBase64(file);
  }

  try {
    const result = await apiCall('/student/leave-request', 'POST', formData);

    if (result.success) {
      showToast('Success', 'Leave request submitted!', 'success');
      document.getElementById('leaveForm').reset();
      setTimeout(() => loadStudentLeaveRequests(), 500);
    } else {
      showMessage('leaveMsg', result.message || 'Failed to submit request', 'danger');
    }
  } catch (error) {
    console.error('Submit error:', error);
    showMessage('leaveMsg', 'Failed to submit request', 'danger');
  }
}
```

### Load Student Leave Requests

**Replace** the `loadStudentLeaveRequests()` function:

```javascript
async function loadStudentLeaveRequests() {
  if (!currentUser) return;

  try {
    const result = await apiCall(`/student/${currentUser.reg}/leave-requests`);

    if (result.success) {
      displayLeaveRequests(result.requests || []);
    } else {
      console.error('Failed to load requests:', result.message);
      displayLeaveRequests([]); // Show empty if error
    }
  } catch (error) {
    console.error('Load requests error:', error);
  }
}
```

### Load Notifications

**Replace** the `loadStudentNotifications()` function:

```javascript
async function loadStudentNotifications() {
  if (!currentUser) return;

  try {
    const result = await apiCall(`/student/${currentUser.reg}/notifications`);

    if (result.success) {
      const notifications = result.notifications || [];
      updateNotificationBadge(notifications.filter(n => !n.read).length);
      displayNotifications(notifications);
    }
  } catch (error) {
    console.error('Load notifications error:', error);
  }
}
```

### Teacher Registration

**Replace** the `teacherRegister()` function:

```javascript
async function teacherRegister() {
  const name = document.getElementById('teacherName').value.trim();
  const phone = document.getElementById('teacherPhone').value.trim();
  const dept = document.getElementById('teacherDept').value.trim();
  const pass = document.getElementById('teacherPass').value.trim();

  // Validation
  if (!name || !phone || !dept || !pass) {
    showMessage('teacherRegMsg', 'Please fill all fields', 'danger');
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    showMessage('teacherRegMsg', 'Phone must be 10 digits', 'danger');
    return;
  }

  if (pass.length < 4) {
    showMessage('teacherRegMsg', 'Password must be at least 4 characters', 'danger');
    return;
  }

  try {
    const result = await apiCall('/teacher/register', 'POST', {
      name,
      phone,
      dept,
      pass
    });

    if (result.success) {
      showMessage('teacherRegMsg', 'Registration successful! Please login.', 'success');
      setTimeout(() => {
        document.getElementById('teacherRegForm').reset();
        showPage('teacherLogin');
      }, 1500);
    } else {
      showMessage('teacherRegMsg', result.message || 'Registration failed', 'danger');
    }
  } catch (error) {
    console.error('Register error:', error);
    showMessage('teacherRegMsg', 'Registration failed', 'danger');
  }
}
```

### Teacher Login

**Replace** the `teacherLogin()` function:

```javascript
async function teacherLogin() {
  const phone = document.getElementById('teacherLoginPhone').value.trim();
  const pass = document.getElementById('teacherLoginPass').value.trim();

  if (!phone || !pass) {
    showMessage('teacherLoginMsg', 'Please enter phone and password', 'danger');
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    showMessage('teacherLoginMsg', 'Invalid phone number', 'danger');
    return;
  }

  try {
    const result = await apiCall('/teacher/login', 'POST', {
      phone,
      pass
    });

    if (result.success) {
      currentUser = result.teacher;
      userType = 'teacher';
      showToast('Success', 'Login successful!', 'success');
      
      // Load teacher data
      loadTeacherPortal();
      showPage('teacherPortal');
      
      document.getElementById('teacherLoginForm').reset();
    } else {
      showMessage('teacherLoginMsg', result.message || 'Login failed', 'danger');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage('teacherLoginMsg', 'Login failed', 'danger');
  }
}
```

### Load Teacher Requests

**Replace** the `displayTeacherRequests()` function:

```javascript
async function displayTeacherRequests() {
  if (!currentUser) return;

  try {
    const result = await apiCall(`/teacher/${currentUser.dept}/leave-requests`);

    if (result.success) {
      const requests = result.requests || [];
      
      // Apply current filter
      let filtered = requests;
      if (currentTeacherFilter !== 'all') {
        filtered = requests.filter(r => r.status === currentTeacherFilter);
      }
      
      // Display filtered requests
      const container = document.getElementById('teacherRequests');
      container.innerHTML = '';
      
      if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:20px;">No leave requests</p>';
        return;
      }

      filtered.forEach(request => {
        const card = createLeaveRequestCard(request, 'teacher');
        container.appendChild(card);
      });
    }
  } catch (error) {
    console.error('Load requests error:', error);
  }
}
```

### Approve/Reject Leave Request

**Replace** the `approveRequest()` and `rejectRequest()` functions:

```javascript
async function approveRequest(requestId) {
  try {
    const result = await apiCall(`/teacher/approve/${requestId}`, 'PUT', {
      approvedBy: currentUser.name
    });

    if (result.success) {
      showToast('Success', 'Request approved!', 'success');
      displayTeacherRequests();
      updateTeacherStats();
    } else {
      showToast('Error', result.message || 'Failed to approve', 'danger');
    }
  } catch (error) {
    console.error('Approve error:', error);
    showToast('Error', 'Failed to approve request', 'danger');
  }
}

async function rejectRequest(requestId) {
  try {
    const result = await apiCall(`/teacher/reject/${requestId}`, 'PUT', {
      rejectedBy: currentUser.name
    });

    if (result.success) {
      showToast('Success', 'Request rejected!', 'success');
      displayTeacherRequests();
      updateTeacherStats();
    } else {
      showToast('Error', result.message || 'Failed to reject', 'danger');
    }
  } catch (error) {
    console.error('Reject error:', error);
    showToast('Error', 'Failed to reject request', 'danger');
  }
}
```

### Mark Attendance (NEW)

**Add this new function** for teacher attendance marking:

```javascript
async function markAttendance(studentReg, date, status) {
  try {
    const result = await apiCall('/attendance/mark', 'POST', {
      studentReg: parseInt(studentReg),
      date,
      status,
      markedBy: currentUser.phone
    });

    if (result.success) {
      showToast('Success', 'Attendance marked!', 'success');
    } else {
      showToast('Error', result.message || 'Failed to mark', 'danger');
    }
  } catch (error) {
    console.error('Mark attendance error:', error);
  }
}

async function saveAllAttendance() {
  const attendanceItems = document.querySelectorAll('.student-attendance-item');
  const records = [];

  attendanceItems.forEach(item => {
    const studentReg = item.dataset.studentReg;
    const date = document.getElementById('attendanceDatePicker').value;
    const statusBtn = item.querySelector('.status-button.active');
    
    if (statusBtn) {
      const status = statusBtn.dataset.status;
      records.push({
        studentReg: parseInt(studentReg),
        date,
        status,
        remarks: ''
      });
    }
  });

  if (records.length === 0) {
    showToast('Warning', 'Please mark attendance for at least one student', 'warning');
    return;
  }

  try {
    const result = await apiCall('/attendance/bulk-mark', 'POST', {
      attendanceRecords: records,
      markedBy: currentUser.phone
    });

    if (result.success) {
      showToast('Success', `Attendance marked for ${records.length} students!`, 'success');
      updateAttendanceDashboard();
    } else {
      showToast('Error', result.message || 'Failed to save', 'danger');
    }
  } catch (error) {
    console.error('Save attendance error:', error);
    showToast('Error', 'Failed to save attendance', 'danger');
  }
}
```

### Get Student Attendance

**Replace** the `displayAttendanceCalendar()` function:

```javascript
async function displayAttendanceCalendar() {
  if (!currentUser) return;

  try {
    const monthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const result = await apiCall(`/attendance/student/${currentUser.reg}?month=${monthStr}`);

    if (result.success) {
      const attendance = result.attendance || [];
      
      // Convert to map for easy lookup
      const attendanceMap = {};
      attendance.forEach(record => {
        attendanceMap[record.date] = record.status;
      });

      // Generate calendar with attendance data
      generateAttendanceCalendar(attendanceMap);
      updateAttendanceStats(attendance);
    }
  } catch (error) {
    console.error('Load attendance error:', error);
  }
}
```

### Update Teacher Attendance Dashboard

**Add this function** for teacher dashboard:

```javascript
async function updateAttendanceDashboard() {
  if (!currentUser || userType !== 'teacher') return;

  try {
    const startDate = document.getElementById('dashboardStartDate').value;
    const endDate = document.getElementById('dashboardEndDate').value;

    const result = await apiCall(
      `/attendance/class/${currentUser.dept}?startDate=${startDate}&endDate=${endDate}`
    );

    if (result.success) {
      displayDashboardStats(result.classStats);
      displayStudentAttendanceTable(result.studentStats);
    }
  } catch (error) {
    console.error('Load dashboard error:', error);
  }
}

function displayDashboardStats(stats) {
  document.getElementById('totalClassesCard').textContent = stats.totalStudents;
  document.getElementById('classAvgCard').textContent = stats.classAverage.toFixed(2) + '%';
  document.getElementById('totalStudentsCard').textContent = stats.totalStudents;
  document.getElementById('highAttendanceCard').textContent = stats.highAttendanceCount;
}

function displayStudentAttendanceTable(studentStats) {
  const table = document.getElementById('studentAttendanceTable');
  table.innerHTML = '';

  Object.values(studentStats).forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.reg}</td>
      <td>${student.presentDays}</td>
      <td>${student.totalDays}</td>
      <td>
        <span class="badge ${student.percentage >= 75 ? 'success' : 'warning'}">
          ${student.percentage.toFixed(2)}%
        </span>
      </td>
    `;
    table.appendChild(row);
  });
}
```

---

## 🔄 Initialization

### Update Page Load

**In the `<body onload>` or document ready:**

```javascript
// Initialize on page load
window.addEventListener('load', () => {
  // Restore session if exists
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    userType = localStorage.getItem('userType');
    
    if (userType === 'student') {
      loadStudentPortal();
      showPage('studentPortal');
    } else if (userType === 'teacher') {
      loadTeacherPortal();
      showPage('teacherPortal');
    }
  }
});

// Save session on logout
function logout() {
  currentUser = null;
  userType = null;
  currentStudentFilter = 'all';
  currentTeacherFilter = 'all';
  
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userType');
  
  showPage('home');
  showToast('Info', 'Logged out successfully', 'info');
}
```

---

## 🧪 Testing

### 1. Start Backend Server
```bash
npm run dev
```

Expected: `✅ Connected to MongoDB` and `🚀 Server running on http://localhost:5000`

### 2. Open Frontend
```bash
# Open smart_campus_fixed.html in browser
# http://localhost/smart_campus_fixed.html
# or just open the file directly
```

### 3. Test Registration
- Register new student with valid data
- Should see success message
- Data should appear in MongoDB

### 4. Test Login
- Login with registered credentials
- Should redirect to student/teacher portal

### 5. Test Features
- Submit leave request
- Check notifications
- Mark attendance (teacher)
- View attendance calendar (student)

---

## 🐛 Common Issues

### "Network error. Using local data."
- Ensure backend is running: `npm run dev`
- Check MongoDB connection in `.env`
- Check CORS in `.env`: `CORS_ORIGIN=http://localhost:3000`

### "Cannot read property 'success' of undefined"
- Backend not responding
- Check server logs: `npm run dev`
- Verify endpoint URL in API_BASE_URL

### Attendance not syncing
- Ensure date format is `YYYY-MM-DD`
- Check student register number is integer
- Verify teacher phone is correct

---

## ✅ Checklist

- [ ] Backend running on port 5000
- [ ] MongoDB connection successful
- [ ] Added API_BASE_URL to HTML
- [ ] Added apiCall() helper function
- [ ] Updated all fetch/submit functions
- [ ] Tested student registration
- [ ] Tested student login
- [ ] Tested leave request submission
- [ ] Tested teacher login
- [ ] Tested attendance marking
- [ ] Tested attendance dashboard
- [ ] Verified data in MongoDB

---

**Status**: ✅ INTEGRATION COMPLETE  
**Version**: 1.0.0
