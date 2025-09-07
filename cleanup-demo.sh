#!/bin/bash

# Cleanup script for Traafik demo

echo "🧹 Cleaning up Traafik demo..."

# Kill backend process if running
if [ -f .demo-backend.pid ]; then
    PID=$(cat .demo-backend.pid)
    if kill $PID 2>/dev/null; then
        echo "✅ Backend process $PID terminated"
    else
        echo "⚠️  Backend process $PID not found (may have already stopped)"
    fi
    rm -f .demo-backend.pid
fi

# Remove demo files
rm -f demo-integrated.html
rm -f backend.log
rm -f backend/src/main/resources/application-demo.properties

echo "✅ Cleanup complete!"
echo ""
echo "Demo files available:"
echo "  • driver-officer-demo.html - Interactive workflow demo"
echo "  • standalone.html - Original React demo"