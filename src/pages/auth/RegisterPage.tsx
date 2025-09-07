export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="h-12 w-12 rounded bg-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="mt-2 text-muted-foreground">
            Join Traafik today
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First name"
              className="w-full p-3 border border-border rounded-md"
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-full p-3 border border-border rounded-md"
            />
          </div>
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 border border-border rounded-md"
          />
          <input
            type="tel"
            placeholder="Phone number"
            className="w-full p-3 border border-border rounded-md"
          />
          <select className="w-full p-3 border border-border rounded-md">
            <option value="">Select role</option>
            <option value="driver">Driver</option>
            <option value="officer">Officer</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-border rounded-md"
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full p-3 border border-border rounded-md"
          />
          <button className="w-full bg-primary text-primary-foreground p-3 rounded-md font-medium">
            Create Account
          </button>
        </div>
        <div className="text-center">
          <a href="/login" className="text-primary hover:underline">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
}