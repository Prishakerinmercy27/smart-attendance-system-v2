#!/bin/bash

# 🤖 AI Analyzer - Quick Test Script
# Tests the analyzer with sample leave requests

echo "🚀 Smart Campus AI Analyzer - Test Suite"
echo "=========================================="
echo ""

# Backend URL
BACKEND_URL="http://localhost:5000"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test analyzer
test_analyze() {
  local reason="$1"
  local label="$2"
  
  echo -e "${BLUE}Test: $label${NC}"
  echo "Input: \"$reason\""
  echo ""
  
  response=$(curl -s -X POST "$BACKEND_URL/api/ai/test-analyze" \
    -H "Content-Type: application/json" \
    -d "{\"reason\": \"$reason\"}")
  
  echo "Output:"
  echo "$response" | jq '.analysis'
  echo ""
  echo "---"
  echo ""
}

# Test 1: Medical Leave
test_analyze \
  "I have fever and doctor advised rest for 2 days. Need medical consultation." \
  "Medical Leave ✅"

# Test 2: Emergency Leave
test_analyze \
  "My grandfather met with a critical accident. Rushing to hospital immediately." \
  "Emergency Leave 🚨"

# Test 3: Personal Leave
test_analyze \
  "My sister's wedding function. Need to attend family ceremony at home." \
  "Personal Leave 👨‍👩‍👧"

# Test 4: Academic Leave
test_analyze \
  "Participating in state-level coding competition and tech olympiad next week." \
  "Academic Leave 📚"

# Test 5: Suspicious Leave
test_analyze \
  "Going for a movie trip with friends. Too tired to come to college." \
  "Suspicious Leave ⚠️"

# Test 6: Mixed Keywords
test_analyze \
  "Had accident but need rest. Doctor said family support needed." \
  "Mixed Keywords 🔀"

# Test 7: Empty/Generic
test_analyze \
  "Personal reason" \
  "Generic Leave 🤷"

echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "API Endpoints to test manually:"
echo "================================"
echo ""
echo "1. Get AI sorted requests (Teacher):"
echo "   curl http://localhost:5000/api/teacher/CSE/leave-requests/priority/sorted"
echo ""
echo "2. Get requests by category:"
echo "   curl http://localhost:5000/api/teacher/CSE/leave-requests/category/Medical"
echo ""
echo "3. Get AI Analytics Dashboard:"
echo "   curl http://localhost:5000/api/teacher/CSE/ai-analytics"
echo ""
echo "4. Test the analyzer:"
echo "   curl -X POST http://localhost:5000/api/ai/test-analyze \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"reason\": \"I have fever\"}'"
echo ""
