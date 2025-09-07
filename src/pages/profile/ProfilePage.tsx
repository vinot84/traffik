export function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and verification status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full p-2 border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full p-2 border border-border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full p-2 border border-border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full p-2 border border-border rounded-md"
                />
              </div>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                Save Changes
              </button>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Identity Verification</h3>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-yellow-800">KYC Pending</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Please upload your identification documents to complete verification.
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Driver's License (Front)</label>
                  <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                    <p className="text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Driver's License (Back)</label>
                  <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                    <p className="text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">Driver</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">KYC Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Created:</span>
                <span>Jan 15, 2024</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Security</h3>
            <div className="space-y-2">
              <button className="w-full p-2 text-left hover:bg-muted rounded-md">
                Change Password
              </button>
              <button className="w-full p-2 text-left hover:bg-muted rounded-md">
                Two-Factor Authentication
              </button>
              <button className="w-full p-2 text-left hover:bg-muted rounded-md text-destructive">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}