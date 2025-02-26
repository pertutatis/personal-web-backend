#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check command status
check_status() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

echo -e "${BLUE}Starting test suite...${NC}\n"

# Check Docker status
echo -e "${BLUE}Checking Docker status...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start containers if not running
if ! docker ps | grep -q "articles-db\|books-db"; then
    echo -e "${BLUE}Starting Docker containers...${NC}"
    docker compose up -d
    check_status "Docker compose"
    
    echo -e "${YELLOW}Waiting for containers to be ready...${NC}"
    sleep 10
fi

# Initialize test environment
echo -e "\n${BLUE}Initializing test environment...${NC}"
npm run test:init
check_status "Test environment initialization"
echo -e "${GREEN}✅ Test environment initialized${NC}\n"

# Run linting
echo -e "${BLUE}Running linting...${NC}"
npm run lint
check_status "Linting"
echo -e "${GREEN}✅ Linting passed${NC}\n"

# Run unit tests
echo -e "${BLUE}Running unit tests...${NC}"
npm run test:unit
check_status "Unit tests"
echo -e "${GREEN}✅ Unit tests passed${NC}\n"

# Run integration tests
echo -e "${BLUE}Running integration tests...${NC}"
npm run test:integration
check_status "Integration tests"
echo -e "${GREEN}✅ Integration tests passed${NC}\n"

# Show coverage reports
echo -e "${BLUE}Test Coverage Reports:${NC}"
echo -e "${YELLOW}Unit Tests Coverage:${NC}"
cat coverage/unit/lcov-report/index.html | grep -A 4 "fraction" || true
echo -e "\n${YELLOW}Integration Tests Coverage:${NC}"
cat coverage/integration/lcov-report/index.html | grep -A 4 "fraction" || true

# Clean up
echo -e "\n${BLUE}Cleaning up test environment...${NC}"
node scripts/test-teardown.js
check_status "Test environment cleanup"

echo -e "\n${GREEN}✅ All tests completed successfully!${NC}"
