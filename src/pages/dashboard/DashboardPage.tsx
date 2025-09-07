interface DashboardPageProps {
  userRole: 'driver' | 'officer' | 'admin';
  onNavigate: (page: 'session' | 'profile' | 'citation') => void;
}

export function DashboardPage({ userRole, onNavigate }: DashboardPageProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your Traafik dashboard ({userRole})
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-gray-200 rounded-lg bg-white">
          <h3 className="font-semibold mb-2">Active Sessions</h3>
          <p className="text-2xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500">No active sessions</p>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg bg-white">
          <h3 className="font-semibold mb-2">Citations</h3>
          <p className="text-2xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500">No recent citations</p>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg bg-white">
          <h3 className="font-semibold mb-2">KYC Status</h3>
          <p className="text-2xl font-bold text-yellow-600">Pending</p>
          <p className="text-sm text-gray-500">Complete verification</p>
        </div>
      </div>

      <div className="p-6 border border-gray-200 rounded-lg bg-white">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('session')}
            className="p-4 bg-blue-600 text-white rounded-md text-left hover:bg-blue-700 transition-colors"
          >
            <h4 className="font-medium">Start Session</h4>
            <p className="text-sm opacity-90">Begin a new traffic stop session</p>
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="p-4 border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-medium">View Profile</h4>
            <p className="text-sm text-gray-600">Manage your account settings</p>
          </button>
        </div>
      </div>

      {userRole === 'officer' && (
        <div className="p-6 border border-gray-200 rounded-lg bg-white">
          <h3 className="font-semibold mb-4">Officer Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 bg-green-600 text-white rounded-md text-left hover:bg-green-700 transition-colors">
              <h4 className="font-medium">Available for Stops</h4>
              <p className="text-sm opacity-90">Mark yourself as available</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors">
              <h4 className="font-medium">Issue Citation</h4>
              <p className="text-sm text-gray-600">Create a new citation</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}