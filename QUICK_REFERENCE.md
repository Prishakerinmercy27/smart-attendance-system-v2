# 📅 Attendance Calendar Feature - Quick Reference Card

## Feature Overview
A monthly calendar view showing student attendance with color-coded status and statistics.

---

## 🎯 Location
**Student Portal** → Click **"📅 Attendance Calendar"** tab

---

## 📋 What You See

### Calendar Grid
```
        Sun  Mon  Tue  Wed  Thu  Fri  Sat
Week 1   -    -    -    -    -    1    2
Week 2   3    4    5    6    7    8    9
Week 3  10   11   12   13   14   15   16
Week 4  17   18   19   20   21   22   23
Week 5  24   25   26   27   28  (29)  -
```

### Color Legend
```
🟢 Green  = Present (✓)
🔴 Red    = Absent (✕)
🟠 Orange = On Leave (🏥)
⚫ Gray   = Weekend (no classes)
🔵 Muted  = Future dates (no data)
```

### Statistics (Bottom)
```
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐
│ Present │  │ Absent  │  │On Leave │  │Attend. % │
│   18    │  │   2     │  │   1     │  │   87%    │
└─────────┘  └─────────┘  └─────────┘  └──────────┘
```

---

## 🎮 How to Use

| Action | How |
|--------|-----|
| **View calendar** | Click "📅 Attendance Calendar" tab |
| **Go back month** | Click "← Previous" button |
| **Go forward month** | Click "Next →" button |
| **See this month** | Month name shown at top (Feb 2026) |
| **Find today** | Blue border around today's date |
| **Understand colors** | See legend above calendar |
| **Check summary** | Look at stat cards at bottom |
| **Switch back** | Click "📜 Leave Requests" tab |

---

## 🔍 Reading the Calendar

### Day Cell Shows
```
┌─────────┐
│  Date   │  (number 1-31)
│ Status  │  (✓ ✕ 🏥 or empty)
└─────────┘
```

### Examples

**Present Day**
```
┌─────────┐
│    5    │
│    ✓    │
└─────────┘
Green background
```

**Absent Day**
```
┌─────────┐
│   15    │
│    ✕    │
└─────────┘
Red background
```

**On Leave Day**
```
┌─────────┐
│   22    │
│   🏥    │
└─────────┘
Orange background
```

**Weekend**
```
┌─────────┐
│    9    │
│    —    │
└─────────┘
Gray background
```

**Today**
```
┌─────────┐
│   (14)  │  Blue glowing border
│    ✓    │
└─────────┘
```

---

## 📊 Statistics Explained

### Present
Count of days you attended class

### Absent
Count of days you were not marked present

### On Leave
Count of days your leave was approved

### Attendance %
Formula: (Present Days ÷ Total Weekdays) × 100

**Example:**
- Present: 18 days
- Total weekdays: 20 days
- Attendance: 18 ÷ 20 × 100 = 90%

---

## 💡 Tips & Tricks

1. **Check trends** - Compare months to see improvement
2. **Monitor % goal** - Most institutions require 75% attendance
3. **Plan leave** - Review upcoming dates before requesting leave
4. **Avoid weekends** - Only weekdays count in percentage
5. **Today indicator** - Blue border helps you spot current date
6. **Mobile friendly** - Works great on phones and tablets

---

## ⚠️ Important Notes

- **Sample data only** - First login generates demo data
- **Weekdays only** - Weekends don't count toward attendance %
- **Persists locally** - Data saved in your browser
- **No future data** - Can't see attendance for future dates
- **Integration pending** - Will sync with actual attendance system

---

## 🔄 Tab Navigation

### Leave Requests Tab
- View submitted leave requests
- Filter by status (All, Pending, Approved, Rejected)
- Upload documents
- Track approval status

### Attendance Calendar Tab ← YOU ARE HERE
- Visual calendar view
- Color-coded attendance status
- Monthly statistics
- Month navigation

---

## 📱 Mobile View

Works on all devices:
- ✅ Desktop (1920px+)
- ✅ Tablet (1024px)
- ✅ Mobile (375px+)

Features adjust for screen size:
- Calendar cells resize
- Controls stack vertically
- Legend wraps to multiple lines
- Touch-friendly buttons

---

## 🎨 Color Quick Guide

| Color | Meaning | What to Do |
|-------|---------|-----------|
| 🟢 | Present | ✓ Good! Keep it up |
| 🔴 | Absent | ✕ Check reason |
| 🟠 | On Leave | 🏥 Enjoy break |
| ⚫ | Weekend | Weekend is off |
| 🔵 | Future | No data yet |

---

## ❓ FAQ

**Q: Why is the calendar empty?**
A: First time? System generates sample data automatically.

**Q: Can I edit my attendance?**
A: No, only teachers/admin can edit attendance.

**Q: Why don't weekends count?**
A: Weekends (Sat/Sun) have no classes, so they don't count.

**Q: Can I see future months?**
A: Yes, but future dates won't have attendance data yet.

**Q: Will this sync with real attendance?**
A: Yes, when the system integrates with your attendance tracking.

**Q: Is my data saved?**
A: Yes, stored in browser's localStorage automatically.

**Q: Can I download this as PDF?**
A: Not yet, but it's planned for future updates.

**Q: What if I dispute an absence?**
A: Feature coming soon! You'll be able to submit appeals.

---

## 🚀 Next Features Coming

- Export to PDF
- Annual summary view
- Attendance trends
- Appeals system
- QR code attendance
- Parent notifications

---

## 📞 Need Help?

1. Check the **legend** above the calendar
2. Look for **blue border** to find today's date
3. Click **Previous/Next** to navigate months
4. Scroll down to see **statistics cards**
5. Check documentation in project folder

---

## 📋 Attendance Checklist

- [ ] Can I view the calendar?
- [ ] Do colors make sense?
- [ ] Can I navigate months?
- [ ] Do statistics show correctly?
- [ ] Can I spot today's date?
- [ ] Works on my phone?

---

**Date Created:** February 7, 2026  
**Last Updated:** February 7, 2026  
**Status:** ✅ Active  
