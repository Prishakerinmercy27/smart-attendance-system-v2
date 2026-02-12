# Calendar Holiday Feature - Quick Reference

## What's New

Your attendance calendar now automatically marks and highlights:
- ✅ **Sundays** - Rest days in purple
- ✅ **Government Holidays** - 🏛️ in red (13 days in 2026)
- ✅ **Festival Holidays** - 🎉 in orange (17 days in 2026)

## Visual Legend

```
┌─────────────────────────────────────────────────────────────┐
│  CALENDAR LEGEND                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✓  Present     │ Green background with checkmark          │
│  ✕  Absent      │ Red background with X mark              │
│  🏥 On Leave    │ Orange background with medical cross    │
│                                                             │
│  🏛️ Government Holiday  │ Red bold border + emoji         │
│  🎉 Festival Holiday    │ Orange bold border + emoji      │
│  Purple border          │ Sunday (Rest day)               │
│  Gray background        │ Saturday (Weekend)              │
│  Light gray             │ Future dates (not yet occurred) │
│  Blue border            │ Today's date                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## How to Read the Calendar

### Typical Month View
```
Sun  Mon  Tue  Wed  Thu  Fri  Sat
           1    2    3    4    5
 6    7    8    9   10   11   12
13   14   15  [16]  17   18   19     ← [16] = Today (blue border)
20  [21]  22   23   24   25   26     ← [21] = Government Holiday 🏛️ (red)
27   28   29   30   31
└─ Sundays colored purple throughout
```

### Color Code Quick Reference

| Color | Meaning | Type |
|-------|---------|------|
| 🔴 Red | Government Holiday | Official national holiday |
| 🟠 Orange | Festival Holiday | Cultural/religious festival |
| 🟣 Purple | Sunday | Weekly rest day |
| ⚫ Gray | Saturday | Weekly weekend |
| 🟢 Green | Present | Attended class |
| 🔴 Red | Absent | Did not attend |
| 🟠 Orange | On Leave | Approved leave |
| ⚪ Light | Future | Date hasn't occurred yet |

## Key Features

### 1. Hover Over Any Holiday
When you hover over a government holiday or festival day:
- Tooltip appears showing the full holiday name
- Example: 2026-01-26 → "Republic Day"

### 2. Automatic Sunday Marking
All Sundays are automatically colored purple - no action needed. This helps you:
- Know when no classes are scheduled
- Plan leave requests around rest days
- Track work days vs rest days

### 3. Holiday Precedence
If a day has multiple attributes (e.g., Sunday + holiday):
- **Government Holiday** takes priority (shown in red)
- **Festival Holiday** takes priority if not government (shown in orange)
- **Sunday** shows if not a holiday (shown in purple)
- **Attendance status** shows only if recorded (green/red/orange)

### 4. Smart Attendance Calculation
The calendar intelligently handles:
- Government holidays DON'T count against attendance
- Festival holidays DON'T count against attendance
- Only actual class days count toward attendance %
- Sundays and Saturdays are excluded from calculations

## 2026 Government Holidays (13 Total)

```
Jan 26  - Republic Day 🏛️
Mar 11  - Maha Shivaratri
Mar 29  - Holi
Apr 02  - Good Friday
Apr 14  - Ambedkar Jayanti
May 01  - May Day
Aug 15  - Independence Day 🏛️
Sep 16  - Milad-un-Nabi
Oct 02  - Gandhi Jayanti 🏛️
Oct 25  - Dussehra
Nov 08  - Diwali
Nov 09  - Diwali (day 2)
Dec 25  - Christmas
```

## 2026 Festival Holidays (17 Total)

In addition to government holidays, these festivals are marked:

```
Jan 14  - Makar Sankranti
Mar 30  - Holi (day 2)
Apr 10  - Eid ul-Fitr
May 25  - Buddha Purnima
Aug 17  - Janmashtami
Oct 29  - Eid ul-Adha
Nov 09  - Govardhan Puja
Nov 10  - Bhai Dooj
```

## For Students

### Checking Your Attendance
1. Go to "Attendance" tab in your dashboard
2. Look at the calendar for your birth month/year
3. Use color coding to understand your status:
   - ✓ Green = You attended
   - ✕ Red = You were absent
   - 🏥 Orange = You were on leave
   - Red/Orange border = Holiday (doesn't affect attendance)

### Planning Leave Requests
1. Look for free days (Sundays in purple, holidays in red/orange)
2. Submit leave for regular weekdays you want off
3. No need to request leave for Sundays or government holidays
4. Your attendance % is calculated only on actual working days

### What Counts in Attendance %?
- Only Monday-Friday (excluding Saturday-Sunday)
- Excluding government holidays
- Excluding festival holidays
- Only days with actual attendance records

**Example**:
```
Month has 22 weekdays
- 5 Government holidays
- 3 Festival holidays
= 14 actual working days

If you're present 12 days:
Attendance % = 12/14 = 85.7%
```

## For Teachers

### Marking Attendance
1. When marking attendance, system highlights holidays automatically
2. Don't mark attendance for holiday dates - system recognizes them
3. Absences on government/festival holidays are ignored
4. Focus on actual working days only

### Reviewing Student Attendance
1. Red and orange highlighted days are holidays (students exempt)
2. Calculate attendance % excluding these days
3. Only count presence on actual working days
4. Use statistics panel which auto-calculates correctly

### Generating Reports
When you view attendance statistics:
- System automatically excludes holidays
- Only counts actual working days
- Gives accurate attendance percentages
- Separates weekend vs holiday absences

## Technical Details

### How Holidays Are Determined

**Sundays**: Automatically detected using JavaScript Date.getDay()
```javascript
if (date.getDay() === 0) {
  // This is a Sunday
}
```

**Government/Festival Holidays**: Pre-defined arrays for 2026
```javascript
{ date: '2026-01-26', name: 'Republic Day' }
```

**Priority Order**:
1. Government Holiday (if date matches) → Red
2. Festival Holiday (if date matches) → Orange
3. Sunday (if getDay() === 0) → Purple
4. Saturday (if getDay() === 6) → Gray
5. Attendance Status (if recorded) → Color based on status

### Calendar Grid Layout
- 7 columns (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
- Responsive design adapts to mobile/tablet/desktop
- Each day shows: number, status, and holiday indicator
- Month navigation to view different months

## Customization

### Adding New Holidays
Edit the HTML file and add to GOVERNMENT_HOLIDAYS_2026 or FESTIVAL_HOLIDAYS_2026:

```javascript
{ date: '2026-12-31', name: 'New Year\'s Eve' }
```

### Removing Holidays
Delete unwanted entries from the arrays.

### Supporting 2027
Create new arrays:
```javascript
var GOVERNMENT_HOLIDAYS_2027 = [ ... ];
var FESTIVAL_HOLIDAYS_2027 = [ ... ];
```

## Common Questions

**Q: Can I change the holiday colors?**
A: Yes! Edit the CSS classes `.calendar-day.government-holiday` and `.calendar-day.festival-holiday` in the HTML file.

**Q: Do holidays count toward attendance?**
A: No! Holidays are automatically excluded from attendance calculations.

**Q: Can I add more holidays?**
A: Yes! Add entries to GOVERNMENT_HOLIDAYS_2026 or FESTIVAL_HOLIDAYS_2026 arrays.

**Q: Why is my Sunday not highlighted?**
A: Sundays are highlighted in purple. If you don't see it, check:
- Browser's zoom level (should be 100%)
- Color blindness - purple might not be visible (can be customized)
- The calendar view is loaded (refresh page)

**Q: Are these holidays same for all institutions?**
A: The default set is for Indian institutions. Edit arrays to match your regional holidays.

**Q: What happens if a holiday falls on Saturday?**
A: The holiday takes priority and displays in red/orange instead of gray weekend color.

## Support & Updates

- Last updated: 2026
- Version: 1.1
- Covers: 2026 holidays (Indian calendar)
- Timezone: IST (Indian Standard Time)

For questions or issues contact: admin@smartcampus.edu
