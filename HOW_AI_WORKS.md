# 🤖 AI Classifier - How It Works & Where Requests Are Displayed

## 🔄 COMPLETE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                     STUDENT SUBMITS LEAVE REQUEST                   │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           │ Enters:
                           │ - Date
                           │ - Reason (e.g., "fever and doctor advised")
                           │ - Attachments
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│            BACKEND PROCESSES WITH AI ANALYZER                        │
│            (/utils/reasonAnalyzer.js)                               │
│                                                                      │
│  1. Extract reason text                                             │
│  2. Match against 5 keyword categories                              │
│  3. Calculate scores for each category                              │
│  4. Find highest scoring category                                   │
│  5. Assign priority (High/Normal/Low)                               │
│  6. Calculate confidence percentage                                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           │ AI Analysis Result:
                           │ {
                           │   category: "Medical",
                           │   priority: "High",
                           │   score: 2,
                           │   confidence: 25.5
                           │ }
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│         SAVE TO DATABASE WITH AI FIELDS                              │
│                                                                      │
│  LeaveRequest {                                                     │
│    studentReg: 1225,                                                │
│    reason: "fever and doctor advised...",                           │
│    status: "pending",                                               │
│    aiCategory: "Medical",       ← AI Added                          │
│    aiPriority: "High",          ← AI Added                          │
│    aiScore: 2,                  ← AI Added                          │
│    aiConfidence: 25.5           ← AI Added                          │
│  }                                                                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  SAVED IN MONGODB                │
        │  Ready for teacher to see        │
        └──────────────────────────────────┘
```

---

## 📱 WHERE CLASSIFIED REQUESTS ARE DISPLAYED

### 1️⃣ TEACHER PORTAL (Browser - Frontend)

**Location:** Teacher Dashboard → Leave Requests Tab

```
┌─────────────────────────────────────────────────────────────────┐
│ 👨‍🏫 TEACHER PORTAL                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Tabs:  📬 Leave Requests  |  📊 Stats  |  ⚙️ Settings          │
│        ─────────────────                                        │
│                                                                 │
│ Current requests from all students in CSE department:          │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Student: John Doe (Reg: 1225)                           │  │
│ │ Date: 2026-02-15                                        │  │
│ │ Reason: fever and doctor advised rest                  │  │
│ │                                                          │  │
│ │ Status: 🟡 PENDING                                      │  │
│ │                                                          │  │
│ │ [APPROVE] [REJECT]                                      │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│ (More requests...)                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Current Status:** ❌ AI fields not displayed yet (need to add UI)

---

### 2️⃣ BACKEND API ENDPOINTS (JSON Response)

Teachers can fetch data using these endpoints:

#### **Endpoint A: Get All Requests (No AI Display)**
```
GET /api/teacher/CSE/leave-requests

Response includes AI fields but not displayed in UI yet:
{
  "studentReg": 1225,
  "reason": "fever...",
  "aiCategory": "Medical",    ← In response but not shown
  "aiPriority": "High",       ← In response but not shown
  "aiScore": 2,               ← In response but not shown
  "aiConfidence": 25.5        ← In response but not shown
}
```

#### **Endpoint B: Get Priority-Sorted Requests** (NEW AI)
```
GET /api/teacher/CSE/leave-requests/priority/sorted

Response SORTED by AI Priority:
[
  { studentName: "Alice", aiCategory: "Medical", aiPriority: "High", ... },
  { studentName: "Bob", aiCategory: "Emergency", aiPriority: "High", ... },
  { studentName: "Carol", aiCategory: "Suspicious", aiPriority: "Low", ... }
]
```

#### **Endpoint C: Filter by AI Category** (NEW AI)
```
GET /api/teacher/CSE/leave-requests/category/Medical

Response shows only Medical leaves:
{
  "category": "Medical",
  "stats": {
    "totalInCategory": 12,
    "approved": 10,
    "rejected": 2
  },
  "requests": [ ... ]
}
```

#### **Endpoint D: Full Analytics Dashboard** (NEW AI)
```
GET /api/teacher/CSE/ai-analytics

Response with full statistics:
{
  "totalRequests": 50,
  "avgConfidence": 68.3,
  "categoryStats": {
    "Medical": { count: 12, approved: 11, rejected: 1 },
    "Emergency": { count: 3, approved: 3, rejected: 0 },
    "Suspicious": { count: 5, approved: 0, rejected: 5 }
  }
}
```

---

## 🎯 HOW IT WORKS - DETAILED STEPS

### Step 1: Student Submits Leave

**Current HTML Form:** `smart_campus_fixed.html` lines ~1650-1750

```html
<form id="leaveForm">
  <input type="date" id="leaveDate" required />
  <textarea id="leaveReason" placeholder="Enter reason..."></textarea>
  <button onclick="submitLeaveRequest()">Submit</button>
</form>
```

**Submitted Data:**
```javascript
{
  studentReg: 1225,
  studentName: "John",
  date: "2026-02-15",
  reason: "I have fever and doctor advised rest",
  proofFile: {...},
  parentLetter: {...}
}
```

---

### Step 2: Backend Receives Request

**Code in `/server.js` (lines 85-140):**

```javascript
app.post('/api/student/leave-request', async (req, res) => {
  const { studentReg, reason, ... } = req.body;
  
  // ⭐ CALL AI ANALYZER
  const aiAnalysis = analyzeReason(reason);
  
  // ⭐ CREATE LEAVE WITH AI DATA
  const leaveRequest = new LeaveRequest({
    studentReg,
    reason,
    aiCategory: aiAnalysis.category,      // ← AI Result
    aiPriority: aiAnalysis.priority,      // ← AI Result
    aiScore: aiAnalysis.score,            // ← AI Result
    aiConfidence: aiAnalysis.confidence   // ← AI Result
  });
  
  await leaveRequest.save();
});
```

---

### Step 3: AI Analyzer Processes

**Code in `/utils/reasonAnalyzer.js`:**

```javascript
function analyzeReason(reason) {
  const text = reason.toLowerCase(); // "i have fever and doctor advised rest"
  
  // Step A: Count keyword matches per category
  // Medical keywords: fever ✓, doctor ✓ = 2 matches
  // Emergency keywords: 0 matches
  // Personal keywords: 0 matches
  // Academic keywords: 0 matches
  // Suspicious keywords: 0 matches
  
  // Step B: Find winner
  let bestMatch = "Medical"; // Has most matches (2)
  let maxScore = 2;
  
  // Step C: Assign priority based on category
  let priority = "High"; // Medical = High priority
  
  // Step D: Calculate confidence
  let confidence = (2 / 8) * 100 = 25%;
  
  return {
    category: "Medical",
    priority: "High",
    score: 2,
    confidence: 25.5
  };
}
```

---

### Step 4: Data Saved to Database

**MongoDB Document:**
```javascript
{
  _id: ObjectId("..."),
  studentReg: 1225,
  studentName: "John Doe",
  date: "2026-02-15",
  reason: "I have fever and doctor advised rest",
  status: "pending",
  
  // ← AI FIELDS AUTOMATICALLY ADDED
  aiCategory: "Medical",
  aiPriority: "High",
  aiScore: 2,
  aiConfidence: 25.5,
  
  submittedAt: 2026-02-10T10:30:00Z,
  proofFile: {...},
  parentLetter: {...}
}
```

---

### Step 5: Teacher Views Requests

**Current HTML:** `smart_campus_fixed.html` lines 2875-2950

**Function:** `displayTeacherRequests()`

```javascript
function displayTeacherRequests() {
  // Gets requests from backend
  // Currently displays:
  // - Student name
  // - Date
  // - Reason
  // - Status (pending/approved/rejected)
  // - Approve/Reject buttons
  
  // ❌ NOT DISPLAYING AI FIELDS YET
  // - aiCategory
  // - aiPriority
  // - aiScore
  // - aiConfidence
}
```

**Current Display (No AI):**
```
┌─────────────────────────────────────────┐
│ Student: John Doe                       │
│ Date: 2026-02-15                        │
│ Reason: I have fever and doctor...     │
│ Status: Pending                         │
│ [Approve] [Reject]                      │
└─────────────────────────────────────────┘
```

---

## 🚀 HOW TO SEE AI CLASSIFICATION IN ACTION

### Option 1: View in Browser DevTools

**Steps:**
1. Open teacher dashboard
2. Open Browser DevTools (F12)
3. Go to Network tab
4. Submit a leave request or refresh
5. Click on API response
6. See JSON with AI fields:
   ```json
   {
     "aiCategory": "Medical",
     "aiPriority": "High",
     "aiScore": 2,
     "aiConfidence": 25.5
   }
   ```

### Option 2: Test with cURL

```bash
# Test the analyzer
curl -X POST http://localhost:5000/api/ai/test-analyze \
  -H "Content-Type: application/json" \
  -d '{"reason": "I have fever and doctor advised rest"}'

# Response:
{
  "category": "Medical",
  "priority": "High",
  "score": 2,
  "confidence": 25.5
}
```

### Option 3: Get Analytics

```bash
# Get full analytics with AI classification
curl http://localhost:5000/api/teacher/CSE/ai-analytics | jq

# Response shows:
{
  "categoryStats": {
    "Medical": { count: 12, approved: 11 },
    "Suspicious": { count: 5, approved: 0 }
  }
}
```

---

## 🎨 WHERE TO ADD UI DISPLAY (In HTML)

### Current Code Location
File: `smart_campus_fixed.html`
Function: `displayTeacherRequests()` (lines 2875-2950)

### Add These AI Fields to Display

**Current Card:**
```html
<div class="leave-card">
  <h4>${request.studentName}</h4>
  <p>Reason: ${request.reason}</p>
  <p>Status: ${request.status}</p>
  <button onclick="approveRequest(...)">Approve</button>
  <button onclick="rejectRequest(...)">Reject</button>
</div>
```

**Enhanced Card (with AI):**
```html
<div class="leave-card">
  <h4>${request.studentName}</h4>
  
  <!-- ADD THESE AI FIELDS -->
  <span class="ai-category">${request.aiCategory}</span>
  <span class="ai-priority">${request.aiPriority}</span>
  <p>Confidence: ${request.aiConfidence}%</p>
  <!-- END AI FIELDS -->
  
  <p>Reason: ${request.reason}</p>
  <p>Status: ${request.status}</p>
  <button onclick="approveRequest(...)">Approve</button>
  <button onclick="rejectRequest(...)">Reject</button>
</div>
```

---

## 📊 DATA FLOW SUMMARY

```
Student Input
     ↓
Backend API Handler
     ↓
AI Analyzer (analyzeReason)
     ↓
Database Save (with AI fields)
     ↓
Teacher Fetches Requests
     ↓
Display in Browser (CURRENTLY NO AI DISPLAY)
     ↓
Teacher sees: name, date, reason, status
Teacher DOES NOT see: category, priority, confidence (yet)
```

---

## ✅ WHAT'S ALREADY DONE

✅ AI Analyzer logic: `/utils/reasonAnalyzer.js`
✅ Backend endpoints: `/server.js` (7 endpoints)
✅ Database fields: 4 AI fields stored in MongoDB
✅ API responses: Include AI data

---

## ❌ WHAT NEEDS TO BE DONE (Optional)

To show AI classification in the teacher dashboard UI:

1. **Modify `displayTeacherRequests()` function**
   - Add AI fields to HTML card
   - Add CSS for badges/colors

2. **Add category badge colors**
   - Medical: Blue
   - Emergency: Red
   - Personal: Green
   - Academic: Yellow
   - Suspicious: Orange

3. **Add priority sorting** (optional)
   - Show High priority first
   - Sort by confidence

4. **Add filter buttons** (optional)
   - Filter by Medical
   - Filter by Emergency
   - etc.

---

## 🎯 QUICK ANSWER

**Q: How does it work?**
A: 
1. Student submits reason
2. Backend calls AI analyzer
3. AI matches keywords → assigns category & priority
4. Saves to database with AI fields
5. Data is ready for teacher to see

**Q: Where are classified requests shown?**
A:
- ✅ In MongoDB (all AI fields stored)
- ✅ In API responses (JSON with AI data)
- ❌ NOT in HTML UI yet (not displayed to teacher yet)

**Q: How to see them?**
- Test API: `curl http://localhost:5000/api/ai/test-analyze`
- View Network tab in DevTools
- Check API responses in cURL
- Use `API_EXAMPLES.sh`

---

**The system works! It just needs UI display in the teacher dashboard.** 🎯
