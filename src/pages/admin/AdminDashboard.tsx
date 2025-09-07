export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System administration and monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-primary">1,247</p>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </div>
        
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Active Sessions</h3>
          <p className="text-2xl font-bold text-primary">23</p>
          <p className="text-sm text-muted-foreground">Currently ongoing</p>
        </div>
        
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Citations Issued</h3>
          <p className="text-2xl font-bold text-primary">89</p>
          <p className="text-sm text-muted-foreground">This week</p>
        </div>
        
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Revenue</h3>
          <p className="text-2xl font-bold text-primary">$12,450</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">Session #{i.toString().padStart(4, '0')}</p>
                  <p className="text-sm text-muted-foreground">Officer: J. Smith, Driver: M. Johnson</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold mb-4">Pending KYC Reviews</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">User #{i.toString().padStart(4, '0')}</p>
                  <p className="text-sm text-muted-foreground">Submitted 2 days ago</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border border-border rounded-lg">
        <h3 className="font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <span>API Server: Online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <span>Database: Connected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <span>Payment Gateway: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}