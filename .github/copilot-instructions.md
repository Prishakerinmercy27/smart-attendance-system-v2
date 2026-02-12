# Smart Campus System - AI Coding Instructions

## Project Overview
**Smart Campus** is a browser-based attendance and leave management system for educational institutions. It's a single-file HTML application (`smart_campus_fixed.html`) featuring dual-role authentication (students/teachers), real-time notifications, and document attachment support.

## Architecture

### Core Structure
- **Single-file architecture**: All UI, styling, and JavaScript logic in one 2450-line HTML file
- **Client-side only**: Uses `localStorage` for persistent data storage (no backend server)
- **Role-based system**: Two separate portals with different capabilities:
  - **Student Portal**: Submit leave requests, track status, upload documents
  - **Teacher Portal**: Review and approve/reject leave requests for their department

### Data Model
The `DB` object simulates a database with four collections:
- `students`: Registration (integer), phone, department, password, timestamps
- `teachers`: Phone-based auth, department, password
- `leaveRequests`: Student requests with status (pending/approved/rejected), attachments
- `notifications`: Real-time alerts sent to students on request status changes

**Critical pattern**: All numeric IDs/register numbers stored as integers in DB. Always convert string inputs with `parseInt()` before comparison.

## Running the Application
1. Open `smart_campus_fixed.html` directly in a browser (no build step needed)
2. Test account creation: Register number 1225-1885, any department
3. Data persists in `localStorage` - inspect via browser DevTools: `Application > Local Storage`
4. Reset data: Clear localStorage or manually delete entries

## Critical Bugs Fixed (v1.1)

### Register Number Type Mismatch
**Issue**: Register numbers stored as integers but input from forms received as strings, causing login failures.
**Solution**: Parse register input with `parseInt()` before DB queries in both `studentRegister()` and `studentLogin()`.

### Filter Button State Management
**Issue**: Filter buttons used `event.target` to set active state, which failed when filter functions called programmatically.
**Solution**: Iterate through filter buttons and match by text content instead:
```javascript
for (var i = 0; i < filterBtns.length; i++) {
  filterBtns[i].classList.remove('active');
  if (filterBtns[i].textContent.toLowerCase().includes(status)) {
    filterBtns[i].classList.add('active');
  }
}
```

### Request List Filtering
**Issue**: Filtering modified original arrays, affecting subsequent queries.
**Solution**: Use separate `filteredRequests` / `filteredDeptRequests` variables to preserve original data from DB queries.

## Project-Specific Patterns & Conventions

### Page Navigation System
```javascript
showPage(id) // Toggles .active class on page divs
// Pages hide/show with CSS: page.active { display: flex; }
```
All 6 pages managed: `#home`, `#studentLogin`, `#teacherLogin`, `#studentPortal`, `#teacherPortal`, `#changePasswordModal`

### Message/Notification Display
**Three systems** (not interchangeable):
- **Toast**: Auto-dismiss notifications (top-right) - `showToast(title, message, type, duration)`
- **Inline Messages**: Form validation - `showMessage(elementId, message, type)`
- **Notification Panel**: Student-only persistent alerts - DB-backed, shown in fixed badge

### Form Validation Patterns
- Always validate before DB operations
- File uploads: 5MB limit, base64 encoding for localStorage (see `fileToBase64()`)
- Phone validation: Regex `/^[0-9]{10}$/` expects exactly 10 digits
- Register numbers: Hardcoded range 1225-1885, must be parsed to integers

### Database Query Pattern
```javascript
DB.query(collection, condition) // Filter records
DB.insert(collection, data)      // Add with auto-persist
DB.update(collection, condition, updates) // Modify record
DB.deleteItem(collection, condition)      // Remove & persist
```
All operations artificially delayed with `setTimeout(..., 300)` to simulate server latency.

### Authentication State
- `currentUser`: Stores logged-in user object (student or teacher)
- `userType`: "student" or "teacher" enum
- Logout: Clears both, resets filters, returns to home
- No password hashing (educational demo)

## Integration Points & Data Flows

### Leave Request Lifecycle
1. Student submits form → `submitLeaveRequest()` → files to base64 → `DB.insert()`
2. Student displays filtered list → `displayLeaveRequests()` queries by `studentReg` (integer)
3. Teacher displays dept list → `displayTeacherRequests()` filters by department match
4. Teacher approves → `approveRequest()` → status + timestamp updated → notification created
5. Student receives notification → badge updates → notification panel shows details

### Department Filtering Logic
Teachers only see requests from students in their department:
```javascript
var students = DB.query('students', s => s.dept === currentUser.dept)
var studentRegs = students.map(s => s.reg)
var deptRequests = DB.query('leaveRequests', r => studentRegs.includes(r.studentReg))
```

### Filter System
- Student/teacher filters: all, pending, approved, rejected
- Variables: `currentStudentFilter`, `currentTeacherFilter`
- State persisted in memory (reset on logout)
- Button class: `.filter-btn.active`

## CSS Design System

### Color Palette (`:root` variables)
- Primary: `#2563eb` (blue) - main buttons, active states
- Secondary: `#8b5cf6` (purple) - gradients
- Success: `#10b981` (green) - approvals
- Danger: `#ef4444` (red) - rejections
- Dark theme throughout with glassmorphism (backdrop-filter: blur)

### Responsive Breakpoints
- `@media (max-width: 768px)`: Stats grid 2 cols, buttons single col, adjusted fonts
- Mobile-first: Fixed notification badge, toast positioning

### Animation Library
- Page transitions: `slideUp` (0.6s)
- Notifications: `slideIn` (0.3s), `slideInRight` for toasts
- Hover effects: Cards lift (+5px), buttons have shimmer overlay
- Loading: Spinning `spinner` (0.8s infinite)

## Common Development Tasks

### Add new document type (beyond proof/parent letter)
1. Add file input in leave form
2. Add file object property to `leaveData` 
3. Update display functions to show in card
4. Update file conversion logic in `submitLeaveRequest()`

### Change department list
Edit both student and teacher register forms:
```javascript
<option value="CSE">Computer Science (CSE)</option>
// Add/remove departments here
```

### Modify approval workflow
- Change `status` enum (currently: pending/approved/rejected)
- Update `.badge.pending/approved/rejected` CSS classes
- Modify filter buttons and display logic

## File Size & Performance Notes
- **2450 lines**: Monolithic single file for demo deployment
- **localStorage limit**: ~5-10MB; base64 files expand ~33%
- **No pagination**: Consider adding after ~100 requests
- **Synchronous DB**: No actual async; scaling requires proper backend
