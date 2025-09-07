export function SessionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Traffic Stop Session</h1>
        <p className="text-muted-foreground">
          Manage your current traffic stop session
        </p>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Session Status</h3>
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
          <span>Waiting for connection...</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Location</h3>
            <div className="h-48 bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Map will appear here</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Session Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</div>
                <span>Share Location</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">2</div>
                <span>Officer Verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">3</div>
                <span>Citation Review</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">4</div>
                <span>Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}