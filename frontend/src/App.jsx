import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-soft animate-bounce-gentle">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading ContextGuard</h2>
      <p className="text-gray-600">Initializing secure connection...</p>
    </div>
  </div>
);

// Main app content
const AppContent = () => {
  const { loading, isAuthenticated } = useAuth();

  // Tailwind test element
  const tailwindTest = (
    <div className="bg-blue-500 text-white p-4 rounded-lg mb-4 text-center">
      If you see a blue background, Tailwind is working!
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <>
      {tailwindTest}
      <LoginPage />
    </>;
  }

  return <>
    {tailwindTest}
    <Dashboard />
  </>;
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
