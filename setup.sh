#!/bin/bash

# Smart Campus Backend Setup & Start Script
# Automates setup and starts the backend server

echo "🚀 Smart Campus Backend Setup"
echo "=============================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi
echo "✓ Node.js $(node --version) found"
echo ""

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✓ npm $(npm --version) found"
echo ""

# Check MongoDB
echo "✓ Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✓ MongoDB found"
    echo "  Note: Make sure MongoDB is running: mongod"
else
    echo "⚠ MongoDB not found"
    echo "  Install from https://docs.mongodb.com/manual/installation/"
    echo "  Or use MongoDB Atlas: https://mongodb.com/cloud/atlas"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✓ Dependencies installed"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✓ Dependencies already installed"
fi
echo ""

# Check .env file
echo "⚙️  Checking configuration..."
if [ ! -f ".env" ]; then
    echo "⚠ .env file not found. Creating with defaults..."
    cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/smart-campus
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
EOF
    echo "✓ .env file created with default settings"
    echo "  Edit .env to configure MongoDB connection"
else
    echo "✓ .env file found"
fi
echo ""

# Confirm startup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Start MongoDB (if using local):"
echo "   mongod"
echo ""
echo "2. Start the backend server:"
echo "   npm run dev"
echo ""
echo "3. Backend will run on: http://localhost:5000"
echo ""
echo "4. API Health Check:"
echo "   curl http://localhost:5000/api/health"
echo ""
echo "For production deployment:"
echo "   npm start"
echo ""
