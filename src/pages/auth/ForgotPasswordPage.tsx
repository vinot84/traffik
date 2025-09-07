export function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="h-12 w-12 rounded bg-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Reset Password</h2>
          <p className="mt-2 text-muted-foreground">
            Enter your email to receive a reset link
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 border border-border rounded-md"
          />
          <button className="w-full bg-primary text-primary-foreground p-3 rounded-md font-medium">
            Send Reset Link
          </button>
        </div>
        <div className="text-center">
          <a href="/login" className="text-primary hover:underline">
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
}