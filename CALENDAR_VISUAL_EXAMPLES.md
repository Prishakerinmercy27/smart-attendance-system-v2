# Calendar Holiday Feature - Visual Examples

## Calendar Display Examples

### January 2026 Calendar
```
┌─────────────────────────────────────────────────────────────┐
│ January 2026                                                │
├─────────────────────────────────────────────────────────────┤
│
│ Sun    Mon    Tue    Wed    Thu    Fri    Sat
│
│ 4      5      6      7      8      9      10
│ 🟣     ░░░    ░░░    ░░░    ░░░    ░░░    ░░░
│
│ 11     12     13     14     15     16     17
│ 🟣     ░░░    ░░░    🎉     ░░░    ░░░    ░░░
│                 Makar Sankranti
│
│ 18     19     20     21     22     23     24
│ 🟣     ░░░    ░░░    ░░░    ░░░    ░░░    ░░░
│
│ 25     26     27     28     29     30     31
│ 🟣     🏛️     ░░░    ░░░    ░░░    ░░░    ░░░
│        Republic Day
│
│ Legend:
│   🟣 = Sunday (Purple)
│   🏛️ = Government Holiday (Red) - Makar Sankranti, Republic Day
│   🎉 = Festival Holiday (Orange)
│   ░░░ = Saturday/Weekend (Gray)
│
└─────────────────────────────────────────────────────────────┘
```

### March 2026 Calendar (Multiple Holidays)
```
┌─────────────────────────────────────────────────────────────┐
│ March 2026                                                  │
├─────────────────────────────────────────────────────────────┤
│
│ Sun    Mon    Tue    Wed    Thu    Fri    Sat
│
│ 1      2      3      4      5      6      7
│ 🟣     ░░░    ░░░    ░░░    ░░░    ░░░    ░░░
│
│ 8      9      10     11     12     13     14
│ 🟣     ░░░    ░░░    🏛️     ░░░    ░░░    ░░░
│                        Maha Shivaratri
│
│ 15     16     17     18     19     20     21
│ 🟣     ░░░    ░░░    ░░░    ░░░    ░░░    ░░░
│
│ 22     23     24     25     26     27     28
│ 🟣     ░░░    ░░░    ░░░    ░░░    ░░░    ░░░
│
│ 29     30     31
│ 🟣     🎉     🎉
│        Holi   Holi Day 2
│
│ Legend:
│   🟣 = Sunday (Purple) - Every 7 days
│   🏛️ = Government Holiday (Red) - Maha Shivaratri (Mar 11)
│   🎉 = Festival Holiday (Orange) - Holi (Mar 29-30)
│   ░░░ = Saturday/Weekend (Gray)
│
└─────────────────────────────────────────────────────────────┘
```

### November 2026 Calendar (Diwali Cluster)
```
┌─────────────────────────────────────────────────────────────┐
│ November 2026                                               │
├─────────────────────────────────────────────────────────────┤
│
│ Sun    Mon    Tue    Wed    Thu    Fri    Sat
│
│ 1      2      3      4      5      6      7
│ 🟣     ░░░    ░░░    ░░░    ░░░    ░░░    ░░░
│
│ 8      9      10     11     12     13     14
│ 🟣     🏛️     🎉     🎉     ░░░    ░░░    ░░░
│        Diwali  Govardhan  Bhai Dooj
│                Puja
│
│ 15     16     17     18     19     20     21
│ 🟣     ░░░    ░░░    ░░░    ░░░    ░░░    ░░░
│
│ 22     23     24     25     26     27     28
│ 🟣     ░░░    ░░░    ░░░    ░░░    ░░░    ░░░
│
│ 29     30
│ 🟣     ░░░
│
│ Legend:
│   🟣 = Sunday (Purple)
│   🏛️ = Government Holiday (Red) - Diwali (Nov 8)
│   🎉 = Festival Holiday (Orange) - Related celebrations
│   ░░░ = Saturday/Weekend (Gray)
│
└─────────────────────────────────────────────────────────────┘
```

## Attendance Record Examples

### Case 1: Regular Weekday with Attendance
```
Day Cell:
┌──────────────────────┐
│        15            │  ← Day number (14px bold)
├──────────────────────┤
│        ✓             │  ← Attendance status (Present = ✓)
└──────────────────────┘

Style: Green background with checkmark
Class: calendar-day present
```

### Case 2: Government Holiday
```
Day Cell:
┌──────────────────────┐
│        26            │  ← Day number
├──────────────────────┤
│        🏛️             │  ← Government holiday indicator
│    Republic Day      │  ← Full name on hover (tooltip)
└──────────────────────┘

Style: Red bold border, strong gradient background
Class: calendar-day government-holiday
Color: #fca5a5 text on #ef4444 border
```

### Case 3: Festival Holiday
```
Day Cell:
┌──────────────────────┐
│        29            │  ← Day number
├──────────────────────┤
│        🎉             │  ← Festival indicator
│       Holi           │  ← Full name on hover
└──────────────────────┘

Style: Orange bold border, gradient background
Class: calendar-day festival-holiday
Color: #fcd34d text on #f59e0b border
```

### Case 4: Sunday
```
Day Cell:
┌──────────────────────┐
│        20            │  ← Day number
├──────────────────────┤
│                      │  ← No status/indicator
└──────────────────────┘

Style: Purple background, lighter appearance
Class: calendar-day sunday
Color: #d8b4fe text on #a855f7 border
```

### Case 5: Holiday with Attendance (Precedence)
```
Day Cell:
┌──────────────────────┐
│        26            │  ← Day number
├──────────────────────┤
│        🏛️             │  ← Holiday indicator takes precedence
└──────────────────────┘

Note: If attendance recorded on holiday date, holiday marking
takes priority. Attendance status is hidden but still stored
in database.

Example scenario:
- Attendance marked: Present on Jan 26 (Republic Day)
- Display: Shows 🏛️ (government holiday)
- Database: Still has attendance record
- Calculation: Excluded from attendance percentage
```

### Case 6: Saturday (Weekend)
```
Day Cell:
┌──────────────────────┐
│        12            │  ← Day number
├──────────────────────┤
│                      │  ← No indicator
└──────────────────────┘

Style: Gray background, dimmed appearance
Class: calendar-day weekend
Color: #94a3b8 text on #64748b border
Excluded: From attendance calculations
```

### Case 7: Today's Date
```
Day Cell:
┌──────────────────────┐
│        16            │  ← Day number
├──────────────────────┤ ← BLUE BORDER (2px thick)
│        ✓             │  ← Status if recorded
└──────────────────────┘ ← Glow effect

Style: Blue border with shadow glow
Class: calendar-day today (+ any status class)
Color: Blue highlight with 0.3 opacity glow
Box-shadow: 0 0 12px rgba(37, 99, 235, 0.3)
```

### Case 8: Future Date
```
Day Cell:
┌──────────────────────┐
│        31            │  ← Day number (dimmed)
├──────────────────────┤
│                      │  ← No status
└──────────────────────┘

Style: Very light gray, nearly invisible
Class: calendar-day future
Color: #64748b text on minimal border
Meaning: Date hasn't occurred yet, no attendance records
```

## Color Reference

### CSS Color Values

| State | Background | Border | Text | Example |
|-------|-----------|--------|------|---------|
| Present | rgba(16,185,129,0.3) | #10b981 | #10b981 | ✓ |
| Absent | rgba(239,68,68,0.3) | #ef4444 | #ef4444 | ✕ |
| On Leave | rgba(245,158,11,0.3) | #f59e0b | #f59e0b | 🏥 |
| Sunday | rgba(168,85,247,0.15) | #a855f7 | #d8b4fe | 🟣 |
| Govt Holiday | rgba(239,68,68,0.4) | #ef4444 | #fca5a5 | 🏛️ |
| Festival | rgba(245,158,11,0.4) | #f59e0b | #fcd34d | 🎉 |
| Weekend | rgba(100,116,139,0.2) | #64748b | #94a3b8 | ░░░ |
| Future | rgba(255,255,255,0.02) | rgba(255,255,255,0.05) | #64748b | ░░░ |
| Today | Same as base | #2563eb | Same | 🔵 |

## Responsive Design Examples

### Desktop View (Full Width)
```
┌────────────────────────────────────────────────────┐
│ Sun      Mon      Tue      Wed      Thu      Fri   │
│  1 🟣     2        3        4        5        6    │
│  8 🟣     9        10       11 🏛️   12       13    │
│ 15 🟣    16       17       18       19       20    │
│ 22 🟣    23       24       25       26       27    │
│ 29 🟣    30       31                               │
│                                                    │
│ [Previous Month]              [Next Month]        │
└────────────────────────────────────────────────────┘
```

### Tablet View (Compact)
```
┌──────────────────────────────┐
│ S    M    T    W    T    F   │
│ 1🟣  2    3    4    5    6   │
│ 8🟣  9   10   11🏛️  12   13  │
│15🟣 16   17   18   19   20   │
│22🟣 23   24   25   26   27   │
│29🟣 30   31                  │
└──────────────────────────────┘
```

### Mobile View (Stack Layout)
```
┌─────────────────┐
│  S  M  T  W  T │
│  F  S           │
│ 1  2  3  4  5  │
│ 6  7  8  9 10  │
│11🏛️12 13 14 15  │
│16 17 18 19 20  │
│21 22 23 24 25  │
│26 27 28 29 30  │
│31              │
│ [Prev] [Next]  │
└─────────────────┘
```

## Tooltip Examples

### Hover on Government Holiday
```
HTML Hover Event:
<div class="calendar-day government-holiday" 
     title="Republic Day">
  26
  <div class="holiday-label">🏛️</div>
</div>

Display Result:
┌──────────────────┐
│   Republic Day   │  ← Browser tooltip
│                  │
│      26          │
│      🏛️          │
└──────────────────┘
```

### Hover on Festival Holiday
```
HTML Hover Event:
<div class="calendar-day festival-holiday" 
     title="Holi">
  29
  <div class="holiday-label">🎉</div>
</div>

Display Result:
┌──────────────────┐
│       Holi       │  ← Browser tooltip
│                  │
│      29          │
│      🎉          │
└──────────────────┘
```

## Data Structure Examples

### Holiday Object Format
```javascript
// Government Holiday
{
  date: '2026-01-26',        // YYYY-MM-DD format
  name: 'Republic Day'       // Display name
}

// Festival Holiday
{
  date: '2026-03-29',        // YYYY-MM-DD format
  name: 'Holi'               // Display name
}

// Returned by getHolidayName()
{
  name: 'Republic Day',      // Holiday name
  type: 'government'         // 'government' or 'festival'
}
```

### Date String Format
```javascript
// Format used throughout
'2026-01-26'  // YYYY-MM-DD with zero-padding

// Generated by getDateString()
getDateString(2026, 0, 26)  // Returns '2026-01-26'

// Month is 0-indexed (Jan = 0, Dec = 11)
getDateString(2026, 11, 25) // Returns '2026-12-25' (Christmas)
```

## Animation Examples

### Hover Effects
```css
Hover on any calendar day:
1. Subtle lift effect (+1px)
2. Border brightens
3. Background slightly lighter
4. Transition time: 0.3s

.calendar-day {
  transition: all 0.3s;
}

.calendar-day:hover {
  /* Slight visual feedback */
}
```

### Month Navigation
```css
When clicking Previous/Next:
1. Calendar fades out (0.2s)
2. New month data loads
3. Calendar fades in (0.3s)
4. Holidays immediately visible
```

---

## Integration Example

### Complete Calendar Display Flow
```
1. User navigates to Attendance tab
2. displayAttendanceCalendar() called
3. For each day in month:
   a) Get attendance record from DB
   b) Get holiday info via getHolidayName()
   c) Determine CSS classes (priority: govt → festival → sunday → weekend → status → future)
   d) Create day element via addCalendarDay()
4. All holidays marked and displayed
5. Statistics calculated (excluding holidays)
6. User sees:
   - Colored calendar with holidays
   - Can hover for full names
   - Can navigate months
   - See their attendance status
```

### Code Path Example
```
User views calendar for March 2026

displayAttendanceCalendar(2026, 2)
  ├─ Get attendance records
  ├─ For day 29:
  │  ├─ dateStr = '2026-03-29'
  │  ├─ currentDate = new Date(2026, 2, 29)
  │  ├─ holidayInfo = getHolidayName('2026-03-29')
  │  │  ├─ Check GOVERNMENT_HOLIDAYS_2026
  │  │  │  └─ NO match
  │  │  └─ Check FESTIVAL_HOLIDAYS_2026
  │  │     └─ FOUND: { name: 'Holi', type: 'festival' }
  │  │
  │  ├─ Return { name: 'Holi', type: 'festival' }
  │  ├─ classes = 'festival-holiday'
  │  └─ addCalendarDay(..., 'festival-holiday', null, holidayInfo)
  │
  └─ Create element:
     <div class="calendar-day festival-holiday" title="Holi">
       <div class="calendar-day-number">29</div>
       <div class="holiday-label" title="Holi">🎉</div>
     </div>
```

---

**Revision**: v1.0
**Created**: 2026
**Purpose**: Visual documentation of calendar holiday feature
