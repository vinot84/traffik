#!/bin/bash

# Traafik Local Demo Script for macOS (No Docker Required)
# This script sets up a complete driver-officer communication demo

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "🚀 Starting Traafik Driver-Officer Communication Demo..."
echo ""

# Check Java version
if command -v java >/dev/null 2>&1; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -ge 17 ]; then
        print_success "Java $JAVA_VERSION found ✓"
    else
        print_warning "Java version $JAVA_VERSION found. Java 17+ recommended."
    fi
else
    print_error "Java not found. Please install Java 17+ to run the backend."
    print_status "You can still run the frontend demo with: open demo-integrated.html"
    exit 1
fi

print_status "Setting up demo environment..."

# Create a simple in-memory backend configuration
cat > backend/src/main/resources/application-demo.properties << 'EOF'
# Demo configuration with H2 in-memory database
spring.application.name=traafik-backend
server.port=8080
server.servlet.context-path=/api/v1

# H2 In-Memory Database for demo
spring.datasource.url=jdbc:h2:mem:traafik;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Disable Flyway for demo
spring.flyway.enabled=false

# JWT Configuration
app.jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
app.jwt.access-token-expiration=900000
app.jwt.refresh-token-expiration=86400000

# CORS Configuration
app.cors.allowed-origins=http://localhost:3000,http://localhost:8080,file://
app.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
app.cors.allowed-headers=*
app.cors.allow-credentials=true

# Security Configuration
app.security.cookie-name=traafik-token
app.security.cookie-max-age=86400
app.security.require-https=false

# Actuator Configuration
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always

# Logging Configuration
logging.level.com.traafik=DEBUG
logging.level.org.springframework.security=INFO
logging.level.org.springframework.web=INFO
EOF

print_success "Demo configuration created ✓"

# Update build.gradle to include H2 database
if ! grep -q "h2" backend/build.gradle; then
    print_status "Adding H2 database dependency..."
    sed -i '' '/implementation.*postgresql/a\
    runtimeOnly '\''com.h2database:h2'\''
' backend/build.gradle
    print_success "H2 database dependency added ✓"
fi

# Start backend in background
print_status "Starting backend server..."
cd backend
./gradlew bootRun --args='--spring.profiles.active=demo' > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_status "Waiting for backend to be ready..."
timeout=60
counter=0
while ! curl -s http://localhost:8080/api/v1/actuator/health >/dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        print_error "Backend failed to start within $timeout seconds"
        print_status "Check backend.log for errors"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    echo -n "."
done
echo ""
print_success "Backend is ready ✓"

# Create integrated demo HTML with backend API calls
cat > demo-integrated.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Traafik - Driver-Officer Communication Demo</title>
    
    <!-- React and React DOM -->
    <script src="https://unpkg.com/react@18.2.0/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
      body { 
        font-family: system-ui, -apple-system, sans-serif; 
        margin: 0;
        padding: 0;
      }
      .demo-panel {
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
      }
      .driver-panel { border-color: #3b82f6; }
      .officer-panel { border-color: #10b981; }
      .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
      }
      .status-created { background-color: #fbbf24; }
      .status-assigned { background-color: #3b82f6; }
      .status-verified { background-color: #10b981; }
      .status-completed { background-color: #6b7280; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    
    <script type="text/babel">
      const { useState, useEffect } = React;
      const { createRoot } = ReactDOM;

      // API Configuration
      const API_BASE_URL = 'http://localhost:8080/api/v1';

      // API Client
      class ApiClient {
        async request(endpoint, options = {}) {
          try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                ...options.headers
              },
              ...options
            });
            
            if (!response.ok) {
              const error = await response.text();
              throw new Error(`API Error: ${response.status} - ${error}`);
            }
            
            return await response.json();
          } catch (error) {
            console.error('API Request failed:', error);
            throw error;
          }
        }

        async register(userData) {
          return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
          });
        }

        async login(credentials) {
          return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
          });
        }

        async createSession(sessionData) {
          return this.request('/sessions', {
            method: 'POST',
            body: JSON.stringify(sessionData)
          });
        }

        async getMySessions() {
          return this.request('/sessions/my');
        }

        async getActiveSessions() {
          return this.request('/sessions/active');
        }

        async assignToSession(sessionId) {
          return this.request(`/sessions/${sessionId}/assign`, {
            method: 'PUT'
          });
        }

        async updateSessionStatus(sessionId, statusData) {
          return this.request(`/sessions/${sessionId}/status`, {
            method: 'PUT',
            body: JSON.stringify(statusData)
          });
        }
      }

      const apiClient = new ApiClient();

      // Demo Application
      function DemoApp() {
        const [driverUser, setDriverUser] = useState(null);
        const [officerUser, setOfficerUser] = useState(null);
        const [currentSession, setCurrentSession] = useState(null);
        const [sessions, setSessions] = useState([]);
        const [activeSessions, setActiveSessions] = useState([]);
        const [logs, setLogs] = useState([]);

        const addLog = (message, type = 'info') => {
          const timestamp = new Date().toLocaleTimeString();
          setLogs(prev => [...prev, { timestamp, message, type }]);
        };

        // Initialize demo users
        useEffect(() => {
          initializeDemoUsers();
        }, []);

        const initializeDemoUsers = async () => {
          try {
            addLog('🚀 Initializing demo users...', 'info');
            
            // Register driver user
            const driverData = {
              email: 'driver@demo.com',
              password: 'password123',
              firstName: 'John',
              lastName: 'Driver',
              role: 'DRIVER'
            };
            
            const officerData = {
              email: 'officer@demo.com',
              password: 'password123',
              firstName: 'Jane',
              lastName: 'Officer',
              role: 'OFFICER'
            };

            try {
              const driverResponse = await apiClient.register(driverData);
              setDriverUser(driverResponse.user);
              addLog('✅ Driver registered successfully', 'success');
            } catch (error) {
              // User might already exist, try login
              const driverResponse = await apiClient.login({
                email: driverData.email,
                password: driverData.password
              });
              setDriverUser(driverResponse.user);
              addLog('✅ Driver logged in successfully', 'success');
            }

            try {
              const officerResponse = await apiClient.register(officerData);
              setOfficerUser(officerResponse.user);
              addLog('✅ Officer registered successfully', 'success');
            } catch (error) {
              // User might already exist, try login
              const officerResponse = await apiClient.login({
                email: officerData.email,
                password: officerData.password
              });
              setOfficerUser(officerResponse.user);
              addLog('✅ Officer logged in successfully', 'success');
            }

          } catch (error) {
            addLog(`❌ Failed to initialize users: ${error.message}`, 'error');
          }
        };

        const createTrafficSession = async () => {
          try {
            addLog('🚗 Driver creating traffic stop session...', 'info');
            
            const sessionData = {
              address: '123 Main Street, Downtown City',
              reason: 'Routine traffic stop',
              latitude: 40.7128,
              longitude: -74.0060
            };

            const session = await apiClient.createSession(sessionData);
            setCurrentSession(session);
            addLog(`✅ Session created with ID: ${session.id}`, 'success');
            addLog('📍 Location shared with dispatch', 'info');
            
            // Refresh sessions list
            refreshSessions();
            
          } catch (error) {
            addLog(`❌ Failed to create session: ${error.message}`, 'error');
          }
        };

        const officerAssignToSession = async (sessionId) => {
          try {
            addLog('👮‍♀️ Officer assigning to session...', 'info');
            
            const updatedSession = await apiClient.assignToSession(sessionId);
            setCurrentSession(updatedSession);
            addLog(`✅ Officer assigned to session ${sessionId}`, 'success');
            addLog('📡 Driver notified of officer assignment', 'info');
            
            refreshSessions();
            
          } catch (error) {
            addLog(`❌ Failed to assign officer: ${error.message}`, 'error');
          }
        };

        const updateSessionStatus = async (sessionId, status, reason = '') => {
          try {
            addLog(`🔄 Updating session status to ${status}...`, 'info');
            
            const statusData = { status, reason };
            const updatedSession = await apiClient.updateSessionStatus(sessionId, statusData);
            setCurrentSession(updatedSession);
            addLog(`✅ Session status updated to ${status}`, 'success');
            
            refreshSessions();
            
          } catch (error) {
            addLog(`❌ Failed to update status: ${error.message}`, 'error');
          }
        };

        const refreshSessions = async () => {
          try {
            const [mySessions, activeSessionsList] = await Promise.all([
              apiClient.getMySessions(),
              apiClient.getActiveSessions()
            ]);
            
            setSessions(mySessions.content || []);
            setActiveSessions(activeSessionsList.content || []);
            
          } catch (error) {
            console.error('Failed to refresh sessions:', error);
          }
        };

        const getStatusColor = (status) => {
          switch (status) {
            case 'CREATED': return 'status-created';
            case 'ASSIGNED': return 'status-assigned';
            case 'VERIFIED': return 'status-verified';
            case 'COMPLETED': return 'status-completed';
            default: return 'status-created';
          }
        };

        const clearLogs = () => setLogs([]);

        return (
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  🚓 Traafik Driver-Officer Communication Demo
                </h1>
                <p className="text-gray-600">
                  Real-time demonstration of secure traffic stop workflow
                </p>
              </div>

              {/* Demo Controls */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Demo Controls</h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={createTrafficSession}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    disabled={!driverUser}
                  >
                    🚗 Driver: Create Session
                  </button>
                  
                  <button
                    onClick={() => currentSession && officerAssignToSession(currentSession.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    disabled={!officerUser || !currentSession || currentSession.status !== 'CREATED'}
                  >
                    👮‍♀️ Officer: Assign to Session
                  </button>
                  
                  <button
                    onClick={() => currentSession && updateSessionStatus(currentSession.id, 'VERIFIED', 'Officer verified driver credentials')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    disabled={!currentSession || currentSession.status !== 'ASSIGNED'}
                  >
                    ✅ Officer: Verify Driver
                  </button>
                  
                  <button
                    onClick={() => currentSession && updateSessionStatus(currentSession.id, 'COMPLETED', 'Traffic stop completed successfully')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    disabled={!currentSession || !['VERIFIED', 'REASONS_SELECTED'].includes(currentSession.status)}
                  >
                    🏁 Complete Session
                  </button>
                  
                  <button
                    onClick={refreshSessions}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    🔄 Refresh Data
                  </button>
                  
                  <button
                    onClick={clearLogs}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    🗑️ Clear Logs
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Driver Panel */}
                <div className="demo-panel driver-panel bg-blue-50">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    🚗 Driver Interface
                  </h3>
                  
                  {driverUser ? (
                    <div className="space-y-4">
                      <div className="text-sm">
                        <strong>User:</strong> {driverUser.firstName} {driverUser.lastName} ({driverUser.email})
                      </div>
                      
                      {currentSession && (
                        <div className="bg-white p-4 rounded-md">
                          <h4 className="font-medium mb-2">Current Session</h4>
                          <div className="text-sm space-y-1">
                            <div>
                              <span className={`status-indicator ${getStatusColor(currentSession.status)}`}></span>
                              Status: <strong>{currentSession.status}</strong>
                            </div>
                            <div>Location: {currentSession.address}</div>
                            <div>Session ID: {currentSession.id}</div>
                            {currentSession.officerName && (
                              <div>Officer: {currentSession.officerName}</div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="bg-white p-4 rounded-md">
                        <h4 className="font-medium mb-2">Driver Actions</h4>
                        <div className="text-sm space-y-2">
                          <div>✓ Share real-time location</div>
                          <div>✓ Provide identification documents</div>
                          <div>✓ Communicate with officer safely</div>
                          <div>✓ Receive citation digitally</div>
                          <div>✓ Make secure payments</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">Initializing driver interface...</div>
                  )}
                </div>

                {/* Officer Panel */}
                <div className="demo-panel officer-panel bg-green-50">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    👮‍♀️ Officer Interface
                  </h3>
                  
                  {officerUser ? (
                    <div className="space-y-4">
                      <div className="text-sm">
                        <strong>Officer:</strong> {officerUser.firstName} {officerUser.lastName} ({officerUser.email})
                      </div>
                      
                      {activeSessions.length > 0 && (
                        <div className="bg-white p-4 rounded-md">
                          <h4 className="font-medium mb-2">Available Sessions</h4>
                          {activeSessions.map(session => (
                            <div key={session.id} className="text-sm border-b py-2 last:border-b-0">
                              <div>
                                <span className={`status-indicator ${getStatusColor(session.status)}`}></span>
                                {session.address} - {session.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="bg-white p-4 rounded-md">
                        <h4 className="font-medium mb-2">Officer Capabilities</h4>
                        <div className="text-sm space-y-2">
                          <div>✓ View nearby traffic stops</div>
                          <div>✓ Verify driver credentials</div>
                          <div>✓ Issue digital citations</div>
                          <div>✓ Real-time communication</div>
                          <div>✓ Complete incident reports</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">Initializing officer interface...</div>
                  )}
                </div>
              </div>

              {/* Activity Log */}
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">📋 Real-time Activity Log</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm max-h-64 overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-gray-500">Waiting for activity...</div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className={`mb-1 ${
                        log.type === 'error' ? 'text-red-400' : 
                        log.type === 'success' ? 'text-green-400' : 
                        'text-blue-400'
                      }`}>
                        [{log.timestamp}] {log.message}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Backend Status */}
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">🔧 System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Backend API:</strong> <span className="text-green-600">✓ Connected</span>
                  </div>
                  <div>
                    <strong>Database:</strong> <span className="text-green-600">✓ H2 In-Memory</span>
                  </div>
                  <div>
                    <strong>Authentication:</strong> <span className="text-green-600">✓ JWT Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Render the app
      createRoot(document.getElementById('root')).render(<DemoApp />);
    </script>
  </body>
</html>
EOF

print_success "Integrated demo created ✓"

# Open the demo
if command -v open >/dev/null 2>&1; then
    print_status "Opening integrated demo..."
    sleep 3  # Give backend time to fully start
    open demo-integrated.html
fi

echo ""
print_success "🎉 Traafik Driver-Officer Demo is ready!"
echo ""
echo "📱 Demo Interface: demo-integrated.html (should open automatically)"
echo "🔧 Backend API: http://localhost:8080/api/v1"
echo "🩺 Health Check: http://localhost:8080/api/v1/actuator/health"
echo "🗄️ Database Console: http://localhost:8080/api/v1/h2-console"
echo "📋 Backend Logs: backend.log"
echo ""
echo "🎯 Demo Workflow:"
echo "  1. Click 'Driver: Create Session' - Driver initiates traffic stop"
echo "  2. Click 'Officer: Assign to Session' - Officer responds to call"
echo "  3. Click 'Officer: Verify Driver' - Officer verifies credentials"
echo "  4. Click 'Complete Session' - Finalize the traffic stop"
echo ""
echo "🛑 To stop the demo:"
echo "  kill $BACKEND_PID"
echo "  rm demo-integrated.html backend.log"
echo ""

# Save PID for cleanup
echo $BACKEND_PID > .demo-backend.pid
print_success "Demo setup complete! Backend PID: $BACKEND_PID 🚓✨"
EOF