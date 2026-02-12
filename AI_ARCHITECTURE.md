# 🏗️ AI Analyzer - System Architecture Diagram

## Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SMART CAMPUS AI SYSTEM                              │
└─────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                          STUDENT SUBMITS LEAVE                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                    │
                                    │ POST /api/student/leave-request
                                    │ {
                                    │   studentReg: 1225,
                                    │   reason: "I have fever..."
                                    │ }
                                    ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        BACKEND - Express Server                        ┃
┃                       (/server.js Route Handler)                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                    │
                                    │ Validate input
                                    ▼
                    ┌───────────────────────────────┐
                    │   const ai = analyzeReason()  │
                    │   (Call AI Classifier)        │
                    └───────────────────────────────┘
                                    │
                                    ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                  AI ANALYZER (/utils/reasonAnalyzer.js)                ┃
┃                                                                          ┃
┃  1. Normalize text to lowercase                                         ┃
┃  2. Check against 5 keyword categories:                                 ┃
┃     - Medical: fever, doctor, hospital, sick, medicine...              ┃
┃     - Emergency: accident, critical, death, injury...                  ┃
┃     - Personal: family, wedding, function, relative...                 ┃
┃     - Academic: exam, competition, project, seminar...                 ┃
┃     - Suspicious: trip, movie, outing, tired, bored...                 ┃
┃                                                                          ┃
┃  3. Count keyword matches per category                                  ┃
┃  4. Find category with highest score                                    ┃
┃  5. Assign priority based on category:                                  ┃
┃     - Medical/Emergency → High                                          ┃
┃     - Personal/Academic → Normal                                        ┃
┃     - Suspicious → Low                                                  ┃
┃  6. Calculate confidence: score / text_length * 100                      ┃
┃                                                                          ┃
┃  Returns: {                                                              ┃
┃    category: "Medical",                                                 ┃
┃    priority: "High",                                                    ┃
┃    score: 2,                                                            ┃
┃    confidence: 25.5                                                     ┃
┃  }                                                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                    │
                                    │ Return analysis
                                    ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    SAVE TO DATABASE (MongoDB)                          ┃
┃                                                                          ┃
┃  LeaveRequest {                                                         ┃
┃    _id: ObjectId,                                                       ┃
┃    studentReg: 1225,                                                    ┃
┃    studentName: "John Doe",                                             ┃
┃    reason: "I have fever...",                                           ┃
┃    status: "pending",                                                   ┃
┃                                                                          ┃
┃    // AI Fields (NEW)                                                   ┃
┃    aiCategory: "Medical",          ← Added by AI                        ┃
┃    aiPriority: "High",             ← Added by AI                        ┃
┃    aiScore: 2,                     ← Added by AI                        ┃
┃    aiConfidence: 25.5,             ← Added by AI                        ┃
┃                                                                          ┃
┃    date: "2026-02-15",                                                  ┃
┃    submittedAt: Date,                                                   ┃
┃    proofFile: {...},                                                    ┃
┃    parentLetter: {...}                                                  ┃
┃  }                                                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                    │
                                    │ Saved!
                                    ▼
                         ┌──────────────────────┐
                         │ Return Success JSON  │
                         │ with AI analysis     │
                         └──────────────────────┘

```

---

## Teacher Dashboard Data Flow

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        TEACHER DASHBOARD VIEWS                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────────────────────────────────────────────────┐
│                    VIEW 1: PRIORITY SORTED QUEUE                        │
│                                                                         │
│  GET /api/teacher/CSE/leave-requests/priority/sorted                   │
│           │                                                             │
│           └─→ Database Query: Find all requests from CSE students      │
│                          │                                              │
│                          └─→ Sort by: aiPriority (High→Normal→Low)    │
│                                       status (pending→approved→reject) │
│                                       date (newest first)              │
│                          │                                              │
│                          └─→ Return sorted array                       │
│           │                                                             │
│           └─→ UI displays in order:                                    │
│                                                                         │
│           HIGH PRIORITY (2 requests)                                    │
│           ├─ Medical: "fever, doctor advised rest" 🏥 [APPROVE][REJECT]│
│           ├─ Emergency: "accident, critical condition" 🚨 [APPROVE][REJECT]
│                                                                         │
│           NORMAL PRIORITY (3 requests)                                  │
│           ├─ Personal: "sister's wedding" 👨‍👩‍👧 [APPROVE][REJECT]        │
│           ├─ Personal: "family function" 👨‍👩‍👧 [APPROVE][REJECT]         │
│           ├─ Academic: "competition participation" 📚 [APPROVE][REJECT]│
│                                                                         │
│           LOW PRIORITY (1 request)                                      │
│           ├─ Suspicious: "going to movie trip" ⚠️ [APPROVE][REJECT]   │
│                                                                         │
│   ✅ Medical/Emergency at TOP - Teacher approves immediately!         │
│   ⚠️  Suspicious at BOTTOM - Teacher reviews more carefully!          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                   VIEW 2: CATEGORY FILTER & ANALYSIS                   │
│                                                                         │
│  GET /api/teacher/CSE/leave-requests/category/Medical                 │
│           │                                                             │
│           └─→ Database Query: Find all Medical leaves for CSE          │
│                          │                                              │
│                          └─→ Return stats + requests                   │
│           │                                                             │
│           └─→ UI displays MEDICAL ANALYSIS:                            │
│                                                                         │
│        MEDICAL LEAVE REQUESTS (15 total)                                │
│        ┌─────────────────────────────────────┐                         │
│        │ Pending:    3                        │                        │
│        │ Approved:   11 (73%)                 │                        │
│        │ Rejected:   1                        │                        │
│        │ Avg Confidence: 72.5%                │                        │
│        └─────────────────────────────────────┘                         │
│                                                                         │
│        [Request 1] [Request 2] ... [Request 15]                         │
│                                                                         │
│   ✅ "Medical leaves have 73% approval rate"                          │
│   ✅ "Most are approved - teachers trust medical leaves"               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                   VIEW 3: FULL AI ANALYTICS DASHBOARD                  │
│                                                                         │
│  GET /api/teacher/CSE/ai-analytics                                     │
│           │                                                             │
│           └─→ Database Query: All leaves from CSE department          │
│                          │                                              │
│                          └─→ Calculate stats by:                       │
│                              - Category (Medical, Emergency, etc)     │
│                              - Priority (High, Normal, Low)           │
│                              - Status (pending, approved, rejected)   │
│           │                                                             │
│           └─→ UI displays DASHBOARD:                                   │
│                                                                         │
│           ┌────────────────────────────────────────────────┐            │
│           │       DEPARTMENT: CSE (50 Total Requests)      │            │
│           ├────────────────────────────────────────────────┤            │
│           │ Avg AI Confidence: 68.3%                       │            │
│           └────────────────────────────────────────────────┘            │
│                                                                         │
│           BY CATEGORY:                                                  │
│           ┌─────────────────────────────────────────────┐              │
│           │ Medical      [████████████████░░] 12 (92%)  │ Approved    │
│           │ Emergency    [████████████████░░]  3 (100%) │ Approved    │
│           │ Personal     [██████████░░░░░░░░] 20 (75%)  │ Approved    │
│           │ Academic     [████████████░░░░░░] 10 (90%)  │ Approved    │
│           │ Suspicious   [░░░░░░░░░░░░░░░░░░]  5 (0%)   │ Rejected    │
│           └─────────────────────────────────────────────┘              │
│                                                                         │
│           BY PRIORITY:                                                  │
│           ┌─────────────────────────────────────────────┐              │
│           │ High Priority  [███████░░░░░░░░░░░] 15 req  │              │
│           │ Normal Priority[██████████░░░░░░░░░░░░] 25  │              │
│           │ Low Priority   [████░░░░░░░░░░░░░░░░░░░░░░] 10│              │
│           └─────────────────────────────────────────────┘              │
│                                                                         │
│   ✅ Insights: Medical > 90% approved, Suspicious = 0% approved        │
│   ✅ Pattern: High priority gets approved faster!                     │
│   ✅ Trends: Students mostly request Personal (40%)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Changes

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        BEFORE (Original)                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

{
  _id: ObjectId,
  studentReg: Number,
  studentName: String,
  date: String,
  reason: String,
  status: "pending" | "approved" | "rejected",
  proofFile: {...},
  parentLetter: {...},
  submittedAt: Date,
  approvedBy: String,
  approvedAt: Date,
  rejectedBy: String,
  rejectedAt: Date
}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        AFTER (With AI Fields)                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

{
  _id: ObjectId,
  studentReg: Number,
  studentName: String,
  date: String,
  reason: String,
  status: "pending" | "approved" | "rejected",
  proofFile: {...},
  parentLetter: {...},
  
  // ✨ NEW AI FIELDS ✨
  aiCategory: "Medical" | "Emergency" | "Personal" | "Academic" | "Suspicious",
  aiPriority: "High" | "Normal" | "Low",
  aiScore: Number,          // Count of keyword matches
  aiConfidence: Number,     // 0-100 percentage
  
  submittedAt: Date,
  approvedBy: String,
  approvedAt: Date,
  rejectedBy: String,
  rejectedAt: Date
}

Migration Note:
- New documents have all 4 AI fields
- Existing documents don't have AI fields (will show as null/undefined)
- Can re-analyze historical requests if needed
```

---

## API Endpoint Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         API ENDPOINTS (7 Total)                         │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ MODIFIED ENDPOINT                                                │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ POST /api/student/leave-request                                  │  │
│  │   Input: { studentReg, reason, date, ... }                       │  │
│  │   Process: Call analyzeReason()                                  │  │
│  │   Output: Includes AI analysis (category, priority, confidence)  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ NEW ENDPOINTS (AI-Specific)                                      │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │ 1. GET /api/teacher/:dept/leave-requests/priority/sorted        │  │
│  │    Returns: Requests sorted by aiPriority (High→Normal→Low)      │  │
│  │    Use Case: Priority queue dashboard                           │  │
│  │                                                                  │  │
│  │ 2. GET /api/teacher/:dept/leave-requests/category/:category     │  │
│  │    Params: Medical, Emergency, Personal, Academic, Suspicious   │  │
│  │    Returns: Filtered requests + stats (approval%, avg confidence)│  │
│  │    Use Case: Category analysis                                  │  │
│  │                                                                  │  │
│  │ 3. GET /api/teacher/:dept/ai-analytics                          │  │
│  │    Returns: Full dashboard stats                                │  │
│  │            - By category (count, approved, rejected)            │  │
│  │            - By priority (High, Normal, Low)                    │  │
│  │            - Average confidence                                 │  │
│  │    Use Case: Analytics dashboard                                │  │
│  │                                                                  │  │
│  │ 4. POST /api/ai/test-analyze                                    │  │
│  │    Input: { reason: "text to analyze" }                         │  │
│  │    Returns: { category, priority, score, confidence }           │  │
│  │    Use Case: Debug/test the analyzer                            │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Flow

```
                            ┌─────────────────────┐
                            │   FRONTEND/STUDENT  │
                            │  Submits Leave Form │
                            └──────────┬──────────┘
                                       │
                                       │ POST /api/student/leave-request
                                       ▼
                            ┌─────────────────────┐
                            │  EXPRESS.JS ROUTE   │
                            │  /server.js         │
                            └──────────┬──────────┘
                                       │
                                       │ Validates input
                                       │ Calls analyzeReason()
                                       ▼
                    ┌───────────────────────────────────┐
                    │   ANALYZER FUNCTION               │
                    │   /utils/reasonAnalyzer.js        │
                    │                                   │
                    │   - Keyword matching              │
                    │   - Category scoring              │
                    │   - Priority assignment           │
                    │   - Confidence calculation        │
                    └───────────────┬───────────────────┘
                                    │
                                    │ Returns analysis object
                                    ▼
                    ┌───────────────────────────────────┐
                    │  MONGODB SAVE                      │
                    │  LeaveRequest collection           │
                    │                                   │
                    │  Original fields + 4 AI fields    │
                    └───────────────┬───────────────────┘
                                    │
                                    │ Saved successfully
                                    ▼
                    ┌───────────────────────────────────┐
                    │  TEACHER DASHBOARD                │
                    │  Fetches via new AI endpoints     │
                    │                                   │
                    │  - Priority sorted queue          │
                    │  - Category filters               │
                    │  - Analytics dashboard            │
                    └───────────────────────────────────┘
```

---

## File Architecture

```
📦 Smart Campus Project
├── 📄 server.js
│   ├── Modified: POST /api/student/leave-request
│   │   └── Calls: analyzeReason()
│   │   └── Saves: AI fields to DB
│   │
│   ├── NEW: GET .../priority/sorted
│   ├── NEW: GET .../category/:category
│   ├── NEW: GET .../ai-analytics
│   └── NEW: POST /api/ai/test-analyze
│
├── 📄 models.js
│   └── Modified: LeaveRequest schema
│       ├── + aiCategory
│       ├── + aiPriority
│       ├── + aiScore
│       └── + aiConfidence
│
├── 📁 utils/ (NEW FOLDER)
│   └── 📄 reasonAnalyzer.js
│       ├── analyzeReason(reason)
│       ├── Category definitions (5)
│       ├── Keyword lists (50+ total)
│       └── Priority logic
│
├── 📄 AI_ANALYZER_GUIDE.md
│   └── Complete API documentation
│
├── 📄 AI_FRONTEND_INTEGRATION.md
│   └── UI implementation code
│
├── 📄 AI_IMPLEMENTATION_SUMMARY.md
│   └── Overview of everything
│
├── 📄 AI_QUICK_REFERENCE.md
│   └── Quick lookup card
│
├── 📄 test-ai-analyzer.sh
│   └── Automated test suite
│
├── 📄 API_EXAMPLES.sh
│   └── cURL example commands
│
└── 📄 ARCHITECTURE.md (this file)
    └── System design documentation
```

---

## Data Flow Summary

```
SUBMISSION STAGE
Student Input → Validation → AI Analyzer → DB Save → Success Response

RETRIEVAL STAGE  
Teacher Request → Filter by Priority/Category → Query DB → Return Data

DISPLAY STAGE
API Response → Frontend Processing → Render UI → Teacher Actions

ACTION STAGE
Teacher Approves/Rejects → Update DB Status → Notification Created → Student Notified
```

---

**This architecture is scalable, transparent, and educational!** ✨
