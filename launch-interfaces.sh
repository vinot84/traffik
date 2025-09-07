#!/bin/bash

# Traafik Separate Interface Demo Setup
echo "🚓 Launching Traafik Driver-Officer Separate Interfaces..."
echo ""

echo "📱 Opening Driver Interface in Chrome..."
if command -v open >/dev/null 2>&1; then
    # Try to open in Chrome specifically
    open -a "Google Chrome" driver-interface.html 2>/dev/null || open driver-interface.html
else
    echo "Please manually open: driver-interface.html"
fi

echo ""
echo "👮‍♀️ Opening Officer Interface in Chrome (new window)..."
sleep 2  # Small delay to ensure first window opens
if command -v open >/dev/null 2>&1; then
    # Try to open in Chrome specifically
    open -a "Google Chrome" officer-interface.html 2>/dev/null || open officer-interface.html
else
    echo "Please manually open: officer-interface.html"
fi

echo ""
echo "🎯 Demo Instructions:"
echo ""
echo "Driver Interface:"
echo "  1. Login with email starting with 'd' (e.g., driver@example.com)"
echo "  2. Enter lat/lng coordinates or click 'Get Current Location'"
echo "  3. Click 'Initiate Traffic Stop' to share location"
echo "  4. Wait for officer to connect"
echo "  5. Chat with officer and pay any fines issued"
echo ""
echo "Officer Interface:"
echo "  1. Login with any email (e.g., officer@police.gov)"
echo "  2. See available driver sessions in cards"
echo "  3. Click 'Respond to Call' to connect to a driver"
echo "  4. Chat with driver and issue citations if needed"
echo ""
echo "🔄 Real-time Communication:"
echo "  • Both interfaces communicate through browser storage"
echo "  • Location matching establishes the connection"
echo "  • Messages are exchanged in real-time"
echo "  • Citations can be issued and paid instantly"
echo ""
echo "✅ Demo is ready! Try the complete workflow in both browsers."