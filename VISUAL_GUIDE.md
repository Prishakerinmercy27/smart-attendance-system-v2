# Attendance Calendar Feature - Visual Guide

## Feature Location in Student Portal

After logging in as a student, you'll see the following layout:

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT PORTAL                           │
│                                                             │
│  Welcome, [Student Name]                        [Close]    │
│  Department: CSE | Register No: 1234                       │
│                                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │
│  │ 📊   │  │ ✅   │  │ ⏳   │  │ ❌   │                   │
│  │Total │  │Appr. │  │Pend. │  │Rej.  │                   │
│  │  12  │  │  8   │  │  2   │  │  2   │                   │
│  └──────┘  └──────┘  └──────┘  └──────┘                   │
│                                                             │
│  [📝 Apply for Leave]                                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📜 Leave Requests  |  📅 Attendance Calendar      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │ View 1: Leave Requests (Default)                   │  │
│  │ [Filter buttons: All, Pending, Approved, Rejected] │  │
│  │ [List of leave requests...]                        │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│                    [⚙️ Change Password]                    │
└─────────────────────────────────────────────────────────────┘
```

## Attendance Calendar Tab View

When you click the "📅 Attendance Calendar" tab:

```
┌─────────────────────────────────────────────────────────────┐
│                   ATTENDANCE CALENDAR                        │
│                                                             │
│  [← Previous]  February 2026  [Next →]                    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Legend:                                             │   │
│  │ 🟢 Present | 🔴 Absent | 🟠 On Leave | ⚫ Weekend │   │
│  │ 🔵 Future                                          │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  Calendar Grid (7 columns = Days of week):                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Sun  Mon  Tue  Wed  Thu  Fri  Sat                  │   │
│  │                                1    2    3    4    │   │
│  │                                                    │   │
│  │  5    6    7    8   (9)   10   11                  │   │
│  │  🟢   🟢  🟠   🟢   🟢    🔴   ⚫                   │   │
│  │                                                    │   │
│  │ 12   13   14   15   16   17   18                   │   │
│  │  🟢   🟢  🟢   🟠   🟢    🟢   ⚫                   │   │
│  │                                                    │   │
│  │ 19   20   21   22   23   24   25                   │   │
│  │  ⚫   🟢  🟢   🟢   🔴    🟢   ⚫                   │   │
│  │                                                    │   │
│  │ 26   27   28                                       │   │
│  │  🟢   🟠  🟢   (Future dates shown muted)          │   │
│  │                                                    │   │
│  │  (9) = Today with blue border                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Present    │  │    Absent    │  │  On Leave    │     │
│  │      20      │  │      3       │  │      2       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐                                          │
│  │ Attendance % │                                          │
│  │      87%     │                                          │
│  └──────────────┘                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Color Coding Reference

### Day Cell States

#### Present (Green)
```
┌────────────────┐
│      3         │
│      ✓         │
└────────────────┘
```
- Background: Green gradient
- Border: Green
- Shows checkmark (✓)

#### Absent (Red)
```
┌────────────────┐
│      5         │
│      ✕         │
└────────────────┘
```
- Background: Red gradient
- Border: Red
- Shows X mark (✕)

#### On Leave (Orange)
```
┌────────────────┐
│      7         │
│      🏥        │
└────────────────┘
```
- Background: Orange gradient
- Border: Orange
- Shows hospital emoji (🏥)

#### Weekend (Gray)
```
┌────────────────┐
│      4         │
│      —         │
└────────────────┘
```
- Background: Dark gray
- Border: Gray
- No attendance data
- Indicates Saturday/Sunday

#### Future (Muted)
```
┌────────────────┐
│     15         │
│                │
└────────────────┘
```
- Background: Very subtle
- Border: Light
- Faded appearance
- Dates ahead of today

#### Today (Highlighted)
```
┌════════════════┐
│      14        │
│      ✓         │
└════════════════┘
```
- Blue border: 2px solid
- Blue glow effect
- Indicates current date

---

## Features Explained

### 1. Month Navigation
- **Previous Button**: Go back one month
- **Next Button**: Go forward one month
- **Display**: Shows "Month Year" (e.g., "February 2026")
- **Constraints**: Can go back/forward through any available date

### 2. Day Labels
First row shows day names:
```
Sun  Mon  Tue  Wed  Thu  Fri  Sat
```

### 3. Calendar Grid
- **7 columns** (one for each day of week)
- **6 rows** (covers full month with previous/next month overflow)
- **Each cell** shows:
  - Day number (1-31)
  - Status symbol (✓, ✕, 🏥, or empty)

### 4. Legend
Visual reference showing what each color means:
- ✅ Green = Present
- ❌ Red = Absent
- ⚕️ Orange = On Leave
- ⚫ Gray = Weekend
- 🔵 Muted = Future

### 5. Statistics Cards
Four cards at bottom showing monthly summary:
1. **Present**: Count of days attended
2. **Absent**: Count of days absent
3. **On Leave**: Count of approved leave days
4. **Attendance %**: Percentage (out of weekdays only)

---

## Statistics Calculation

```
Attendance % = (Present Days / Total Weekdays) × 100

Where:
- Present Days = Days marked as "Present"
- Total Weekdays = All weekdays in month (excluding weekends)
- Only includes past dates (excludes future dates)

Example:
- February has 20 weekdays
- Student was present 18 days
- Attendance % = (18/20) × 100 = 90%
```

---

## Interactive Features

### Tab Switching
- Click "📜 Leave Requests" → Shows leave request list
- Click "📅 Attendance Calendar" → Shows attendance calendar

### Month Navigation
- Click "← Previous" → Shows last month's attendance
- Click "Next →" → Shows next month's attendance
- Month name updates dynamically

### Visual Feedback
- Tab buttons highlight when active
- Hover effects on navigation buttons
- Today's date has glowing border
- Smooth transitions between views

---

## Data Flow

```
Student Logins
    ↓
Load Student Portal
    ↓
Initialize Attendance Data
(Generate sample data if first time)
    ↓
Initialize Calendar View
(Set to current month)
    ↓
Display Attendance Calendar
    ↓
Student can:
├─ Switch between Leave Requests & Calendar
├─ Navigate previous/next months
├─ View attendance status for each day
├─ Check monthly statistics
└─ See color-coded attendance distribution
```

---

## Sample Data Generation

When a student logs in for the first time:

1. **Check** if attendance records exist
2. **If not**, generate sample data:
   - Generate for current month + previous month
   - **Exclude weekends** (Saturday & Sunday)
   - **Exclude future dates** (after today)
   - **Random distribution**:
     - 70% Present
     - 20% Absent
     - 10% On Leave

Example for February 2026 (20 weekdays):
- ~14 days marked Present ✓
- ~4 days marked Absent ✕
- ~2 days marked On Leave 🏥

---

## Mobile View

On mobile devices:
- Calendar grid adjusts size
- Day cells become smaller
- Controls stack vertically
- Legend wraps to multiple lines
- Touch-friendly button sizes
- Responsive padding and margins

---

## Keyboard & Accessibility

- Tab navigation: Use keyboard to switch tabs
- Calendar navigation: Click buttons or use keyboard shortcuts (planned feature)
- Color contrast: Meets WCAG AA standards
- Screen reader friendly: Semantic HTML structure
