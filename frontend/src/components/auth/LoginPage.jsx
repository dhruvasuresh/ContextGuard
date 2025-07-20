import React, { useState, useEffect } from 'react';
import { Shield, Users, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { login, loading, error, clearError } = useAuth();

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      return;
    }

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      // Login successful - the AuthContext will handle the state update
      console.log('Login successful');
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: user.password
    });
  };

  const demoUsers = [
    {
      username: 'admin',
      password: 'admin123',
      role: 'Admin',
      department: 'IT',
      description: 'Full system access and policy management',
      color: 'bg-purple-500',
      icon: Shield
    },
    {
      username: 'alice_hr',
      password: 'password',
      role: 'HR',
      department: 'Human Resources',
      description: 'Full employee access during business hours',
      color: 'bg-blue-500',
      icon: Users
    },
    {
      username: 'bob_intern',
      password: 'password',
      role: 'Intern',
      department: 'Engineering',
      description: 'Limited access to basic employee info',
      color: 'bg-green-500',
      icon: Users
    },
    {
      username: 'carol_manager',
      password: 'password',
      role: 'Manager',
      department: 'Sales',
      description: 'Department-wide access',
      color: 'bg-orange-500',
      icon: Users
    },
    {
      username: 'david_auditor',
      password: 'password',
      role: 'Auditor',
      department: 'Finance',
      description: 'Investigation access with purpose declaration',
      color: 'bg-red-500',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-soft">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ContextGuard
          </h1>
          <p className="text-gray-600">
            Context-Aware Access Control System
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8 shadow-strong">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your username"
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-danger-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-danger-700">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.username || !formData.password}
              className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Users */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-success-500 mr-2" />
              Demo Users
            </h3>
            <div className="space-y-3">
              {demoUsers.map((user) => {
                const IconComponent = user.icon;
                const isSelected = selectedUser?.username === user.username;
                
                return (
                  <div
                    key={user.username}
                    onClick={() => handleUserSelect(user)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-soft'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center mr-3`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <p className="text-sm text-gray-600">{user.role} • {user.department}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-11">{user.description}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <strong>Admin:</strong> admin123 | <strong>Others:</strong> password
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Secure • Reliable • Context-Aware
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 