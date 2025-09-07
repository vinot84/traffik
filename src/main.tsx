const { StrictMode } = React;
const { createRoot } = ReactDOM;

// Import CSS
const css = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    border-color: hsl(214.3 31.8% 91.4%);
  }
  body {
    background-color: hsl(0 0% 100%);
    color: hsl(222.2 84% 4.9%);
    font-family: system-ui, -apple-system, sans-serif;
  }
}
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.innerText = css;
document.head.appendChild(styleSheet);

// App Component
function App() {
  const [currentPage, setCurrentPage] = React.useState('login');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState('driver');

  const handleLogin = (role = 'driver') => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleNavigation = (page) => {
    if (isAuthenticated) {
      setCurrentPage(page);
    }
  };

  if (!isAuthenticated) {
    return React.createElement(LoginPage, { onLogin: handleLogin });
  }

  return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
    React.createElement('header', { className: 'border-b bg-white' },
      React.createElement('div', { className: 'container mx-auto flex h-16 items-center justify-between px-4' },
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('div', { className: 'h-8 w-8 rounded bg-blue-600' }),
          React.createElement('span', { className: 'font-semibold' }, 'Traafik')
        ),
        React.createElement('nav', { className: 'flex items-center gap-6' },
          React.createElement('button', {
            onClick: () => handleNavigation('dashboard'),
            className: `text-sm font-medium hover:text-blue-600 ${currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-600'}`
          }, 'Dashboard'),
          React.createElement('button', {
            onClick: () => handleNavigation('session'),
            className: `text-sm font-medium hover:text-blue-600 ${currentPage === 'session' ? 'text-blue-600' : 'text-gray-600'}`
          }, 'Session'),
          React.createElement('button', {
            onClick: () => handleNavigation('profile'),
            className: `text-sm font-medium hover:text-blue-600 ${currentPage === 'profile' ? 'text-blue-600' : 'text-gray-600'}`
          }, 'Profile'),
          React.createElement('button', {
            onClick: handleLogout,
            className: 'text-sm font-medium text-red-600 hover:text-red-700'
          }, 'Logout')
        )
      )
    ),
    React.createElement('main', { className: 'container mx-auto py-8 px-4' },
      currentPage === 'dashboard' && React.createElement(DashboardPage, { userRole, onNavigate: handleNavigation }),
      currentPage === 'session' && React.createElement(SessionPage),
      currentPage === 'profile' && React.createElement(ProfilePage)
    )
  );
}

// Login Component
function LoginPage({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const role = formData.get('role') || 'driver';
    onLogin(role);
  };

  return React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-gray-50' },
    React.createElement('div', { className: 'max-w-md w-full space-y-8 p-8' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('div', { className: 'h-12 w-12 rounded bg-blue-600 mx-auto mb-4' }),
        React.createElement('h2', { className: 'text-3xl font-bold' }, 'Sign in to Traafik'),
        React.createElement('p', { className: 'mt-2 text-gray-600' }, 'Remote traffic stops made simple')
      ),
      React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-4' },
        React.createElement('input', {
          type: 'email',
          name: 'email',
          placeholder: 'Email address',
          required: true,
          className: 'w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        }),
        React.createElement('input', {
          type: 'password',
          name: 'password',
          placeholder: 'Password',
          required: true,
          className: 'w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        }),
        React.createElement('select', {
          name: 'role',
          className: 'w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        },
          React.createElement('option', { value: 'driver' }, 'Driver'),
          React.createElement('option', { value: 'officer' }, 'Officer'),
          React.createElement('option', { value: 'admin' }, 'Admin')
        ),
        React.createElement('button', {
          type: 'submit',
          className: 'w-full bg-blue-600 text-white p-3 rounded-md font-medium hover:bg-blue-700 transition-colors'
        }, 'Sign In')
      ),
      React.createElement('div', { className: 'text-center' },
        React.createElement('a', { href: '#', className: 'text-blue-600 hover:underline' },
          "Don't have an account? Sign up"
        )
      )
    )
  );
}

// Dashboard Component
function DashboardPage({ userRole, onNavigate }) {
  return React.createElement('div', { className: 'space-y-8' },
    React.createElement('div', null,
      React.createElement('h1', { className: 'text-3xl font-bold' }, 'Dashboard'),
      React.createElement('p', { className: 'text-gray-600' }, `Welcome to your Traafik dashboard (${userRole})`)
    ),
    
    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
      React.createElement('div', { className: 'p-6 border border-gray-200 rounded-lg bg-white' },
        React.createElement('h3', { className: 'font-semibold mb-2' }, 'Active Sessions'),
        React.createElement('p', { className: 'text-2xl font-bold text-blue-600' }, '0'),
        React.createElement('p', { className: 'text-sm text-gray-500' }, 'No active sessions')
      ),
      
      React.createElement('div', { className: 'p-6 border border-gray-200 rounded-lg bg-white' },
        React.createElement('h3', { className: 'font-semibold mb-2' }, 'Citations'),
        React.createElement('p', { className: 'text-2xl font-bold text-blue-600' }, '0'),
        React.createElement('p', { className: 'text-sm text-gray-500' }, 'No recent citations')
      ),
      
      React.createElement('div', { className: 'p-6 border border-gray-200 rounded-lg bg-white' },
        React.createElement('h3', { className: 'font-semibold mb-2' }, 'KYC Status'),
        React.createElement('p', { className: 'text-2xl font-bold text-yellow-600' }, 'Pending'),
        React.createElement('p', { className: 'text-sm text-gray-500' }, 'Complete verification')
      )
    ),

    React.createElement('div', { className: 'p-6 border border-gray-200 rounded-lg bg-white' },
      React.createElement('h3', { className: 'font-semibold mb-4' }, 'Quick Actions'),
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        React.createElement('button', {
          onClick: () => onNavigate('session'),
          className: 'p-4 bg-blue-600 text-white rounded-md text-left hover:bg-blue-700 transition-colors'
        },
          React.createElement('h4', { className: 'font-medium' }, 'Start Session'),
          React.createElement('p', { className: 'text-sm opacity-90' }, 'Begin a new traffic stop session')
        ),
        React.createElement('button', {
          onClick: () => onNavigate('profile'),
          className: 'p-4 border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors'
        },
          React.createElement('h4', { className: 'font-medium' }, 'View Profile'),
          React.createElement('p', { className: 'text-sm text-gray-600' }, 'Manage your account settings')
        )
      )
    ),

    userRole === 'officer' && React.createElement('div', { className: 'p-6 border border-gray-200 rounded-lg bg-white' },
      React.createElement('h3', { className: 'font-semibold mb-4' }, 'Officer Tools'),
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        React.createElement('button', { className: 'p-4 bg-green-600 text-white rounded-md text-left hover:bg-green-700 transition-colors' },
          React.createElement('h4', { className: 'font-medium' }, 'Available for Stops'),
          React.createElement('p', { className: 'text-sm opacity-90' }, 'Mark yourself as available')
        ),
        React.createElement('button', { 
          onClick: () => onNavigate('citation'),
          className: 'p-4 border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors' 
        },
          React.createElement('h4', { className: 'font-medium' }, 'Issue Citation'),
          React.createElement('p', { className: 'text-sm text-gray-600' }, 'Create a new citation')
        )
      )
    )
  );
}

// Session Component
function SessionPage() {
  const [sessionStatus, setSessionStatus] = React.useState('waiting');
  const [currentStep, setCurrentStep] = React.useState(1);

  return React.createElement('div', { className: 'space-y-8' },
    React.createElement('div', null,
      React.createElement('h1', { className: 'text-3xl font-bold' }, 'Traffic Stop Session'),
      React.createElement('p', { className: 'text-gray-600' }, 'Manage your current traffic stop session')
    ),

    React.createElement('div', { className: 'bg-gray-100 p-6 rounded-lg' },
      React.createElement('h3', { className: 'font-semibold mb-4' }, 'Session Status'),
      React.createElement('div', { className: 'flex items-center gap-4' },
        React.createElement('div', { className: 'h-3 w-3 bg-yellow-500 rounded-full' }),
        React.createElement('span', null, 'Waiting for connection...')
      )
    ),

    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' },
      React.createElement('div', { className: 'space-y-6' },
        React.createElement('div', { className: 'p-6 border border-gray-200 rounded-lg bg-white' },
          React.createElement('h3', { className: 'font-semibold mb-4' }, 'Location'),
          React.createElement('div', { className: 'h-48 bg-gray-100 rounded-md flex items-center justify-center' },
            React.createElement('p', { className: 'text-gray-500' }, 'Map will appear here')
          )
        )
      ),

      React.createElement('div', { className: 'space-y-6' },
        React.createElement('div', { className: 'p-6 border border-gray-200 rounded-lg bg-white' },
          React.createElement('h3', { className: 'font-semibold mb-4' }, 'Session Progress'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement('div', { className: 'h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm' }, '1'),
              React.createElement('span', null, 'Share Location')
            ),
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement('div', { className: 'h-8 w-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm' }, '2'),
              React.createElement('span', null, 'Officer Verification')
            ),
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement('div', { className: 'h-8 w-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm' }, '3'),
              React.createElement('span', null, 'Citation Review')
            ),
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement('div', { className: 'h-8 w-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm' }, '4'),
              React.createElement('span', null, 'Payment')
            )
          )
        )
      )
    )
  );
}

// Profile Component
function ProfilePage() {
  return React.createElement('div', { className: 'space-y-8' },
    React.createElement('div', null,
      React.createElement('h1', { className: 'text-3xl font-bold' }, 'Profile'),
      React.createElement('p', { className: 'text-gray-600' }, 'Manage your account settings and preferences')
    ),

    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' },
      React.createElement('div', { className: 'p-6 border border-gray-200 rounded-lg bg-white' },
        React.createElement('h3', { className: 'font-semibold mb-4' }, 'Personal Information'),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Full Name'),
            React.createElement('input', { 
              type: 'text', 
              defaultValue: 'John Doe',
              className: 'w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Email'),
            React.createElement('input', { 
              type: 'email', 
              defaultValue: 'john@example.com',
              className: 'w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Phone'),
            React.createElement('input', { 
              type: 'tel', 
              defaultValue: '+1 (555) 123-4567',
              className: 'w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            })
          )
        )
      ),

      React.createElement('div', { className: 'p-6 border border-gray-200 rounded-lg bg-white' },
        React.createElement('h3', { className: 'font-semibold mb-4' }, 'Verification Status'),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('div', { className: 'flex items-center justify-between p-3 bg-yellow-50 rounded-md' },
            React.createElement('span', null, 'Identity Verification'),
            React.createElement('span', { className: 'text-yellow-600 font-medium' }, 'Pending')
          ),
          React.createElement('div', { className: 'flex items-center justify-between p-3 bg-green-50 rounded-md' },
            React.createElement('span', null, 'Email Verification'),
            React.createElement('span', { className: 'text-green-600 font-medium' }, 'Verified')
          ),
          React.createElement('div', { className: 'flex items-center justify-between p-3 bg-red-50 rounded-md' },
            React.createElement('span', null, 'Phone Verification'),
            React.createElement('span', { className: 'text-red-600 font-medium' }, 'Required')
          )
        )
      )
    )
  );
}

// Render the app
createRoot(document.getElementById('root')).render(
  React.createElement(StrictMode, null,
    React.createElement(App)
  )
);