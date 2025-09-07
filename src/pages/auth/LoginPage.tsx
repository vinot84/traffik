interface LoginPageProps {
  onLogin: (role: 'driver' | 'officer' | 'admin') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const role = formData.get('role') as 'driver' | 'officer' | 'admin';
    onLogin(role || 'driver');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="h-12 w-12 rounded bg-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Sign in to Traafik</h2>
          <p className="mt-2 text-gray-600">
            Remote traffic stops made simple
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select 
            name="role"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="driver">Driver</option>
            <option value="officer">Officer</option>
            <option value="admin">Admin</option>
          </select>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>
        <div className="text-center">
          <a href="#" className="text-blue-600 hover:underline">
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
}