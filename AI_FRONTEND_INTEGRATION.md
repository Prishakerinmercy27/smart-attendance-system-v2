# 🎨 AI Analyzer - Frontend Integration Guide

## Quick Implementation

Add this to your teacher dashboard to display AI analysis:

---

## 1️⃣ Display AI Category in Leave Cards

### HTML (Add to leave request card)
```html
<div class="leave-card">
  <div class="card-header">
    <span class="student-name">John Doe</span>
    <span class="ai-badge ai-medical">Medical</span>
    <span class="priority-badge priority-high">High Priority</span>
  </div>
  <p><strong>Reason:</strong> <span id="reason">I have fever and doctor advised rest</span></p>
  <p><strong>Confidence:</strong> <span id="confidence">72.5%</span></p>
</div>
```

### CSS (Add to stylesheet)
```css
/* AI Category Badges */
.ai-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 5px;
}

.ai-medical { background: #dbeafe; color: #0c4a6e; }
.ai-emergency { background: #fee2e2; color: #7f1d1d; }
.ai-personal { background: #dcfce7; color: #166534; }
.ai-academic { background: #fef3c7; color: #78350f; }
.ai-suspicious { background: #fecaca; color: #7f1d1d; }

/* Priority Badges */
.priority-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.priority-high { background: #ef4444; color: white; }
.priority-normal { background: #f59e0b; color: white; }
.priority-low { background: #6b7280; color: white; }

/* Confidence Score */
#confidence {
  font-weight: bold;
  color: #10b981;
}
```

---

## 2️⃣ Sort by AI Priority

### JavaScript Function
```javascript
// Fetch and display sorted requests
async function displayAISortedRequests(dept) {
  try {
    const response = await fetch(`/api/teacher/${dept}/leave-requests/priority/sorted`);
    const data = await response.json();

    if (!data.success) {
      console.error('Error:', data.message);
      return;
    }

    const container = document.getElementById('requestsList');
    container.innerHTML = '';

    // Group by priority
    const grouped = {
      'High': [],
      'Normal': [],
      'Low': []
    };

    data.requests.forEach(request => {
      grouped[request.aiPriority || 'Normal'].push(request);
    });

    // Display High first, then Normal, then Low
    ['High', 'Normal', 'Low'].forEach(priority => {
      if (grouped[priority].length > 0) {
        // Add priority header
        const header = document.createElement('h3');
        header.textContent = `${priority} Priority (${grouped[priority].length})`;
        header.style.marginTop = '20px';
        header.style.color = 
          priority === 'High' ? '#ef4444' : 
          priority === 'Normal' ? '#f59e0b' : '#6b7280';
        container.appendChild(header);

        // Add cards
        grouped[priority].forEach(request => {
          const card = createLeaveCard(request);
          container.appendChild(card);
        });
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Create leave card with AI info
function createLeaveCard(request) {
  const card = document.createElement('div');
  card.className = 'leave-card';
  
  const aiColor = {
    'Medical': '#0c4a6e',
    'Emergency': '#7f1d1d',
    'Personal': '#166534',
    'Academic': '#78350f',
    'Suspicious': '#7f1d1d'
  };

  const aiBg = {
    'Medical': '#dbeafe',
    'Emergency': '#fee2e2',
    'Personal': '#dcfce7',
    'Academic': '#fef3c7',
    'Suspicious': '#fecaca'
  };

  card.innerHTML = `
    <div class="card-header">
      <div class="student-info">
        <strong>${request.studentName}</strong>
        <small>Reg: ${request.studentReg}</small>
      </div>
      <div class="badges">
        <span class="ai-badge" 
              style="background: ${aiBg[request.aiCategory]}; 
                     color: ${aiColor[request.aiCategory]};">
          ${request.aiCategory}
        </span>
        <span class="priority-badge" 
              style="background: ${request.aiPriority === 'High' ? '#ef4444' : request.aiPriority === 'Normal' ? '#f59e0b' : '#6b7280'}">
          ${request.aiPriority} Priority
        </span>
      </div>
    </div>
    
    <div class="card-body">
      <p><strong>Date:</strong> ${request.date}</p>
      <p><strong>Reason:</strong> ${request.reason}</p>
      <p><strong>Status:</strong> 
        <span class="badge" style="background: ${
          request.status === 'pending' ? '#f59e0b' :
          request.status === 'approved' ? '#10b981' : '#ef4444'
        }">${request.status.toUpperCase()}</span>
      </p>
      <div class="ai-info">
        <div class="confidence-bar">
          <span>AI Confidence:</span>
          <div class="bar">
            <div class="fill" style="width: ${request.aiConfidence}%"></div>
          </div>
          <span>${request.aiConfidence.toFixed(1)}%</span>
        </div>
      </div>
    </div>
    
    <div class="card-actions">
      <button class="btn-approve" onclick="approveRequest('${request._id}')">✓ Approve</button>
      <button class="btn-reject" onclick="rejectRequest('${request._id}')">✕ Reject</button>
    </div>
  `;

  return card;
}

// CSS for confidence bar
const style = document.createElement('style');
style.innerHTML = `
  .confidence-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding: 8px;
    background: #f3f4f6;
    border-radius: 6px;
  }

  .confidence-bar .bar {
    flex: 1;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .confidence-bar .fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #06b6d4);
    transition: width 0.3s ease;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
  }

  .badges {
    display: flex;
    gap: 8px;
  }
`;
document.head.appendChild(style);
```

---

## 3️⃣ Filter by AI Category

### HTML (Category Filter Buttons)
```html
<div class="category-filters">
  <h3>Filter by Category:</h3>
  <button class="filter-btn" onclick="filterByCategory('Medical')">
    🏥 Medical
  </button>
  <button class="filter-btn" onclick="filterByCategory('Emergency')">
    🚨 Emergency
  </button>
  <button class="filter-btn" onclick="filterByCategory('Personal')">
    👨‍👩‍👧 Personal
  </button>
  <button class="filter-btn" onclick="filterByCategory('Academic')">
    📚 Academic
  </button>
  <button class="filter-btn" onclick="filterByCategory('Suspicious')">
    ⚠️ Suspicious
  </button>
  <button class="filter-btn" onclick="displayAISortedRequests(currentDept)">
    All
  </button>
</div>
```

### JavaScript Function
```javascript
async function filterByCategory(category) {
  try {
    const dept = currentDept; // Get from logged-in teacher
    const response = await fetch(
      `/api/teacher/${dept}/leave-requests/category/${category}`
    );
    const data = await response.json();

    if (!data.success) {
      console.error('Error:', data.message);
      return;
    }

    const container = document.getElementById('requestsList');
    container.innerHTML = '';

    // Show stats
    const statsDiv = document.createElement('div');
    statsDiv.className = 'category-stats';
    statsDiv.innerHTML = `
      <h3>${data.category} Leave Requests</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <h4>${data.stats.totalInCategory}</h4>
          <p>Total Requests</p>
        </div>
        <div class="stat-card">
          <h4 style="color: #f59e0b">${data.stats.byStatus.pending}</h4>
          <p>Pending</p>
        </div>
        <div class="stat-card">
          <h4 style="color: #10b981">${data.stats.byStatus.approved}</h4>
          <p>Approved</p>
        </div>
        <div class="stat-card">
          <h4 style="color: #ef4444">${data.stats.byStatus.rejected}</h4>
          <p>Rejected</p>
        </div>
        <div class="stat-card">
          <h4 style="color: #06b6d4">${parseFloat(data.stats.avgConfidence).toFixed(1)}%</h4>
          <p>Avg Confidence</p>
        </div>
      </div>
    `;
    container.appendChild(statsDiv);

    // Display requests
    data.requests.forEach(request => {
      const card = createLeaveCard(request);
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 4️⃣ AI Analytics Dashboard

### HTML (Dashboard Widget)
```html
<div class="analytics-dashboard">
  <h2>🤖 AI Analysis Dashboard</h2>
  
  <div class="dashboard-grid">
    <!-- Category Distribution -->
    <div class="chart-card">
      <h3>Leave Requests by Category</h3>
      <div id="categoryChart"></div>
    </div>

    <!-- Priority Distribution -->
    <div class="chart-card">
      <h3>Priority Distribution</h3>
      <div id="priorityChart"></div>
    </div>

    <!-- Approval Rate by Category -->
    <div class="chart-card">
      <h3>Approval Rates</h3>
      <div id="approvalChart"></div>
    </div>

    <!-- Average Confidence -->
    <div class="stat-card">
      <h1 id="avgConfidence">0%</h1>
      <p>Avg AI Confidence</p>
    </div>
  </div>
</div>
```

### JavaScript (Load Analytics)
```javascript
async function loadAIAnalytics(dept) {
  try {
    const response = await fetch(`/api/teacher/${dept}/ai-analytics`);
    const data = await response.json();

    if (!data.success) {
      console.error('Error:', data.message);
      return;
    }

    // Update confidence
    document.getElementById('avgConfidence').textContent = 
      data.avgConfidence + '%';

    // Display category stats
    const categoryStats = data.categoryStats;
    displayCategoryChart(categoryStats);
    displayApprovalChart(categoryStats);
    displayPriorityChart(data.priorityStats);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayCategoryChart(categoryStats) {
  const categories = Object.keys(categoryStats);
  const counts = categories.map(c => categoryStats[c].count);

  const colors = {
    'Medical': '#3b82f6',
    'Emergency': '#ef4444',
    'Personal': '#10b981',
    'Academic': '#f59e0b',
    'Suspicious': '#8b5cf6'
  };

  const chartDiv = document.getElementById('categoryChart');
  chartDiv.innerHTML = '';

  categories.forEach(category => {
    const count = categoryStats[category].count;
    const total = counts.reduce((a, b) => a + b, 0);
    const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;

    const bar = document.createElement('div');
    bar.style.marginBottom = '12px';
    bar.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>${category}</span>
        <span>${count} (${percentage}%)</span>
      </div>
      <div style="background: #e5e7eb; height: 20px; border-radius: 4px; overflow: hidden;">
        <div style="background: ${colors[category]}; width: ${percentage}%; height: 100%; transition: width 0.3s;"></div>
      </div>
    `;
    chartDiv.appendChild(bar);
  });
}

function displayApprovalChart(categoryStats) {
  const categories = Object.keys(categoryStats);
  const chartDiv = document.getElementById('approvalChart');
  chartDiv.innerHTML = '';

  categories.forEach(category => {
    const stats = categoryStats[category];
    const total = stats.count;
    const approvalRate = total > 0 ? ((stats.approved / total) * 100).toFixed(1) : 0;

    const bar = document.createElement('div');
    bar.style.marginBottom = '12px';
    bar.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>${category}</span>
        <span>${approvalRate}%</span>
      </div>
      <div style="background: #e5e7eb; height: 20px; border-radius: 4px; overflow: hidden;">
        <div style="background: #10b981; width: ${approvalRate}%; height: 100%;"></div>
      </div>
    `;
    chartDiv.appendChild(bar);
  });
}

function displayPriorityChart(priorityStats) {
  const priorities = ['High', 'Normal', 'Low'];
  const colors = {
    'High': '#ef4444',
    'Normal': '#f59e0b',
    'Low': '#6b7280'
  };

  const chartDiv = document.getElementById('priorityChart');
  chartDiv.innerHTML = '';

  priorities.forEach(priority => {
    const count = priorityStats[priority].count;
    const pending = priorityStats[priority].pending;

    const card = document.createElement('div');
    card.style.display = 'inline-block';
    card.style.marginRight = '15px';
    card.innerHTML = `
      <div style="padding: 12px; background: ${colors[priority]}; color: white; 
                  border-radius: 6px; text-align: center;">
        <div style="font-size: 24px; font-weight: bold;">${count}</div>
        <div>${priority} Priority</div>
        <small>${pending} pending</small>
      </div>
    `;
    chartDiv.appendChild(card);
  });
}
```

---

## 5️⃣ Real-Time AI Test Tool

### HTML (For Debugging)
```html
<div class="ai-test-tool">
  <h3>🧪 AI Analyzer Test</h3>
  <textarea id="testReason" placeholder="Enter a leave reason to test AI analysis..."></textarea>
  <button onclick="testAIAnalyzer()">Analyze</button>
  <div id="testResult"></div>
</div>
```

### JavaScript
```javascript
async function testAIAnalyzer() {
  const reason = document.getElementById('testReason').value.trim();

  if (!reason) {
    alert('Please enter a reason');
    return;
  }

  try {
    const response = await fetch('/api/ai/test-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Error:', data.message);
      return;
    }

    const analysis = data.analysis;
    const resultDiv = document.getElementById('testResult');
    
    resultDiv.innerHTML = `
      <div class="analysis-result">
        <h4>✅ Analysis Complete</h4>
        <p><strong>Category:</strong> ${analysis.category}</p>
        <p><strong>Priority:</strong> ${analysis.priority}</p>
        <p><strong>Confidence:</strong> ${analysis.confidence.toFixed(2)}%</p>
        <p><strong>Keyword Matches:</strong> ${analysis.score}</p>
        <details>
          <summary>Category Scores</summary>
          <pre>${JSON.stringify(analysis.categoryScores, null, 2)}</pre>
        </details>
      </div>
    `;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 📱 Complete Teacher Dashboard Integration

```javascript
// Initialize dashboard
async function initTeacherDashboard() {
  const dept = getCurrentDept(); // Get from localStorage/session
  
  // Load analytics
  await loadAIAnalytics(dept);
  
  // Load sorted requests
  await displayAISortedRequests(dept);
}

// Call on page load
document.addEventListener('DOMContentLoaded', initTeacherDashboard);
```

---

## 🎯 UI/UX Tips

1. **Color Coding**: Match category colors across all views
2. **Priority First**: Always sort High → Normal → Low
3. **Confidence Visual**: Show as bars or percentages
4. **Quick Actions**: Approve/Reject buttons right on card
5. **Feedback**: Toast notifications on actions
6. **Mobile**: Stack badges vertically on small screens

---

## ✅ Testing Checklist

- [ ] Category badges display correctly
- [ ] Priority sorting works
- [ ] Filter buttons switch categories
- [ ] Confidence bars animate
- [ ] Analytics load without errors
- [ ] AI test tool works
- [ ] Responsive on mobile

This integration makes the AI analysis visible and actionable! 🚀
