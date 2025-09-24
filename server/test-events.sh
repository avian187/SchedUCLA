#!/bin/zsh

# Base URL
BASE_URL="http://localhost:5000/api/events"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "\n${GREEN}1. Creating a new event...${NC}"
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Study Group Meeting",
    "description": "Weekly study group for CS 35L",
    "date": "2025-06-01T15:00:00Z",
    "location": "Boelter Hall 3400",
    "organizer": "John Doe",
    "type": "academic"
  }')

# Extract the event ID from the response
EVENT_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Created event with ID: $EVENT_ID"

echo "\n${GREEN}2. Getting all events...${NC}"
curl -s -X GET $BASE_URL | json_pp

echo "\n${GREEN}3. Getting the specific event...${NC}"
curl -s -X GET "$BASE_URL/$EVENT_ID" | json_pp

echo "\n${GREEN}4. Updating the event...${NC}"
curl -s -X PUT "$BASE_URL/$EVENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Study Group Meeting",
    "description": "Updated weekly study group for CS 35L",
    "location": "Boelter Hall 4800"
  }' | json_pp

echo "\n${GREEN}5. Getting the updated event...${NC}"
curl -s -X GET "$BASE_URL/$EVENT_ID" | json_pp

echo "\n${GREEN}6. Deleting the event...${NC}"
curl -s -X DELETE "$BASE_URL/$EVENT_ID" | json_pp

echo "\n${GREEN}7. Verifying deletion (should return 404)...${NC}"
curl -s -X GET "$BASE_URL/$EVENT_ID" | json_pp

echo "\nTest completed!"
