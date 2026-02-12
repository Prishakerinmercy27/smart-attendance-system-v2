# Attendance Calendar Feature

## Overview
The Smart Campus system now includes an **Attendance Calendar View** feature in the student portal that displays when a student is present, absent, or on leave.

## Features Added

### 1. **Attendance Calendar Tab**
- New tab in the student portal: "📅 Attendance Calendar"
- Displays a full month calendar view of attendance records
- Month navigation with Previous/Next buttons
- Current date highlighted with blue border

### 2. **Attendance Status Display**
Each day in the calendar shows the attendance status with color coding:

| Status | Color | Symbol | Meaning |
|--------|-------|--------|---------|
| **Present** | Green | ✓ | Student was present |
| **Absent** | Red | ✕ | Student was absent |
| **On Leave** | Orange | 🏥 | Student was on approved leave |
| **Weekend** | Gray | — | Saturday/Sunday (no classes) |
| **Future** | Muted | — | Dates in the future (no data yet) |

### 3. **Attendance Legend**
Visual legend showing what each color means for easy reference.

### 4. **Monthly Statistics**
Dashboard cards showing:
- **Present** count for the month
- **Absent** count for the month
- **On Leave** count for the month
- **Attendance %** - calculated as (Present / Total Weekdays) × 100

### 5. **Tab Navigation**
Two tabs in the student portal:
- 📜 Leave Requests (existing feature)
- 📅 Attendance Calendar (new feature)

## Technical Implementation

### Database
- **New Collection**: `attendance` 
- **Structure**:
  ```javascript
  {
    id: timestamp,
    studentReg: integer,        // Student register number
    date: "YYYY-MM-DD",        // Date of attendance
    status: "present|absent|leave"  // Attendance status
  }
  ```

### Stored in
- `localStorage` key: `attendance`
- Persists across browser sessions

### JavaScript Functions

#### **Core Functions**
- `switchStudentTab(tab)` - Switch between Leave Requests and Attendance Calendar tabs
- `initializeAttendanceData()` - Generate sample attendance data on first load
- `initializeCalendarView()` - Set up calendar view when student logs in
- `displayAttendanceCalendar()` - Render the calendar for current month

#### **Navigation Functions**
- `previousMonth()` - Navigate to previous month
- `nextMonth()` - Navigate to next month

#### **Helper Functions**
- `addCalendarDay(calendar, day, classes, status)` - Add individual day to calendar
- `getDateString(year, month, day)` - Format date as YYYY-MM-DD
- `updateAttendanceStats(attendanceMap, year, month)` - Calculate and display statistics

## Sample Data Generation

When a student logs in for the first time:
- System automatically generates attendance records for the current and previous month
- **Weekdays only** - Weekends (Saturday/Sunday) are excluded
- **Random distribution**:
  - 70% Present
  - 20% Absent
  - 10% On Leave
- **No future dates** - Only past and current dates are included

## CSS Styling

### Key Classes
- `.tab-navigation` - Tab button container
- `.tab-btn` - Individual tab button
- `.calendar-grid` - Calendar 7×6 grid layout
- `.calendar-day` - Individual day cell
- `.calendar-day.present/absent/leave/weekend/future` - Status-based styling
- `.attendance-legend` - Color legend
- `.stats-item` - Statistics cards

### Colors Used
- Present: `#10b981` (Green)
- Absent: `#ef4444` (Red)
- On Leave: `#f59e0b` (Orange)
- Weekend: `#64748b` (Gray)
- Primary: `#2563eb` (Blue)

### Responsive Design
- Mobile-friendly grid layout
- Adjusts calendar day size on smaller screens
- Flexbox for legend and controls

## How to Use

1. **Login** as a student with valid credentials
2. **View Student Portal** after login
3. **Click "📅 Attendance Calendar"** tab
4. **View current month** attendance with color-coded days
5. **Navigate months** using Previous/Next buttons
6. **Check statistics** at the bottom for monthly summary
7. **Understand status** using the color legend

## Future Enhancements

Potential improvements:
- Integration with actual attendance system
- Export attendance report as PDF
- Semester/yearly attendance view
- Attendance insights and trends
- Mark attendance as disputed (appeal process)
- Attendance notifications when absent
- Automatic sync with QR code attendance system

## Integration Notes

The attendance calendar integrates seamlessly with:
- **Leave Request System** - Automatically shows "On Leave" when a leave request is approved
- **DB Collection** - Uses same pattern as leaveRequests collection
- **UI/UX** - Matches existing Smart Campus design system

## Browser Compatibility

Works on all modern browsers supporting:
- ES5+ JavaScript
- CSS Grid
- localStorage API
