#!/bin/bash

# 📋 Smart Campus AI - Example cURL Requests
# Copy & paste these commands to test the AI analyzer

echo "🤖 Smart Campus AI Analyzer - cURL Examples"
echo "==========================================="
echo ""
echo "Make sure the backend is running on http://localhost:5000"
echo ""

# Color output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}1️⃣ TEST THE AI ANALYZER${NC}"
echo "=========================="
echo ""

echo -e "${GREEN}Example 1: Medical Leave${NC}"
echo 'curl -X POST http://localhost:5000/api/ai/test-analyze \'
echo '  -H "Content-Type: application/json" \'
echo "  -d '{\"reason\": \"I have high fever and my doctor advised complete rest\"}'"
echo ""

echo -e "${GREEN}Example 2: Emergency Leave${NC}"
echo 'curl -X POST http://localhost:5000/api/ai/test-analyze \'
echo '  -H "Content-Type: application/json" \'
echo "  -d '{\"reason\": \"Critical accident at home, need immediate hospital treatment\"}'"
echo ""

echo -e "${GREEN}Example 3: Suspicious Leave${NC}"
echo 'curl -X POST http://localhost:5000/api/ai/test-analyze \'
echo '  -H "Content-Type: application/json" \'
echo "  -d '{\"reason\": \"Going to watch a movie with friends, feeling tired and bored\"}'"
echo ""

echo -e "${GREEN}Example 4: Personal Leave${NC}"
echo 'curl -X POST http://localhost:5000/api/ai/test-analyze \'
echo '  -H "Content-Type: application/json" \'
echo "  -d '{\"reason\": \"My sister is getting married, need to attend family wedding\"}'"
echo ""

echo -e "${GREEN}Example 5: Academic Leave${NC}"
echo 'curl -X POST http://localhost:5000/api/ai/test-analyze \'
echo '  -H "Content-Type: application/json" \'
echo "  -d '{\"reason\": \"Participating in national coding olympiad competition\"}'"
echo ""

echo -e "${YELLOW}2️⃣ SUBMIT LEAVE REQUEST (With AI Analysis)${NC}"
echo "=========================================="
echo ""

echo -e "${GREEN}Example: Submit leave request${NC}"
echo 'curl -X POST http://localhost:5000/api/student/leave-request \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{
echo '    "studentReg": 1225,
echo '    "studentName": "John Doe",
echo '    "date": "2026-02-15",
echo '    "reason": "I have fever and doctor advised rest",
echo '    "proofFile": null,
echo '    "parentLetter": null
echo '  }'"'"
echo ""

echo -e "${YELLOW}3️⃣ GET AI-SORTED REQUESTS (High → Normal → Low Priority)${NC}"
echo "========================================================"
echo ""

echo -e "${GREEN}Get all requests sorted by AI priority${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/leave-requests/priority/sorted"
echo ""

echo -e "${GREEN}Get pending requests only (sorted by priority)${NC}"
echo "curl 'http://localhost:5000/api/teacher/CSE/leave-requests/priority/sorted?status=pending'"
echo ""

echo -e "${YELLOW}4️⃣ FILTER BY CATEGORY${NC}"
echo "===================="
echo ""

echo -e "${GREEN}Get all MEDICAL leaves${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/leave-requests/category/Medical"
echo ""

echo -e "${GREEN}Get all EMERGENCY leaves${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/leave-requests/category/Emergency"
echo ""

echo -e "${GREEN}Get all SUSPICIOUS leaves${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/leave-requests/category/Suspicious"
echo ""

echo -e "${GREEN}Get all PERSONAL leaves${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/leave-requests/category/Personal"
echo ""

echo -e "${GREEN}Get all ACADEMIC leaves${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/leave-requests/category/Academic"
echo ""

echo -e "${YELLOW}5️⃣ AI ANALYTICS DASHBOARD${NC}"
echo "=========================="
echo ""

echo -e "${GREEN}Get full AI analytics for a department${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/ai-analytics"
echo ""

echo -e "${GREEN}Pretty print JSON response${NC}"
echo 'curl http://localhost:5000/api/teacher/CSE/ai-analytics | jq'
echo ""

echo -e "${YELLOW}6️⃣ RESPONSE EXAMPLES${NC}"
echo "==================="
echo ""

echo -e "${GREEN}AI Analysis Response Format:${NC}"
cat << 'EOF'
{
  "category": "Medical",
  "priority": "High",
  "score": 2,
  "confidence": 25.5,
  "categoryScores": {
    "Medical": 2,
    "Emergency": 0,
    "Personal": 0,
    "Academic": 0,
    "Suspicious": 0
  }
}
EOF
echo ""

echo -e "${GREEN}Analytics Response Format:${NC}"
cat << 'EOF'
{
  "success": true,
  "department": "CSE",
  "totalRequests": 50,
  "avgConfidence": 68.3,
  "categoryStats": {
    "Medical": {
      "count": 12,
      "approved": 11,
      "rejected": 1,
      "pending": 0
    },
    ...
  },
  "priorityStats": {
    "High": {
      "count": 15,
      "approved": 14,
      "rejected": 0,
      "pending": 1
    },
    ...
  }
}
EOF
echo ""

echo -e "${YELLOW}7️⃣ USEFUL QUERIES${NC}"
echo "=================="
echo ""

echo -e "${GREEN}Get analytics with jq filter (Medical only)${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/ai-analytics | jq '.categoryStats.Medical'"
echo ""

echo -e "${GREEN}Get average confidence${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/ai-analytics | jq '.avgConfidence'"
echo ""

echo -e "${GREEN}Get count of high priority requests${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/ai-analytics | jq '.priorityStats.High.count'"
echo ""

echo -e "${GREEN}Get medical leave approval rate${NC}"
echo 'curl http://localhost:5000/api/teacher/CSE/ai-analytics | jq '"'"'(.categoryStats.Medical.approved / .categoryStats.Medical.count * 100)'"'"
echo ""

echo -e "${YELLOW}8️⃣ DEBUGGING${NC}"
echo "============"
echo ""

echo -e "${GREEN}Get response headers${NC}"
echo "curl -i http://localhost:5000/api/health"
echo ""

echo -e "${GREEN}Get response with verbose output${NC}"
echo "curl -v http://localhost:5000/api/teacher/CSE/ai-analytics"
echo ""

echo -e "${GREEN}Save response to file${NC}"
echo "curl http://localhost:5000/api/teacher/CSE/ai-analytics > analytics.json"
echo ""

echo -e "${YELLOW}9️⃣ TESTING SCRIPT${NC}"
echo "=================="
echo ""

echo -e "${GREEN}Run automated tests${NC}"
echo "bash test-ai-analyzer.sh"
echo ""

echo -e "${GREEN}✅ All examples ready to use!${NC}"
echo ""
echo "💡 Pro Tips:"
echo "  1. Install jq for better JSON formatting: brew install jq"
echo "  2. Use Postman for more complex testing"
echo "  3. Check server logs for debugging"
echo "  4. Modify dept name (CSE) as needed"
echo ""
