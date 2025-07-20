import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  DollarSign, 
  Settings, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Clock,
  MapPin,
  UserCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Employee Directory',
      icon: Users,
      description: 'View and manage employee information',
      color: 'bg-blue-500',
      href: '#employees',
      available: true
    },
    {
      name: 'Salary Information',
      icon: DollarSign,
      description: 'Access salary data with context-aware permissions',
      color: 'bg-green-500',
      href: '#salary',
      available: true
    },
    {
      name: 'Policy Management',
      icon: Settings,
      description: 'Manage access control policies',
      color: 'bg-purple-500',
      href: '#policies',
      available: isAdmin()
    },
    {
      name: 'Audit Logs',
      icon: FileText,
      description: 'View system access logs and security events',
      color: 'bg-orange-500',
      href: '#audit',
      available: isAdmin()
    }
  ];

  const contextInfo = [
    {
      label: 'User',
      value: user?.username,
      icon: UserCheck,
      color: 'text-blue-600'
    },
    {
      label: 'Role',
      value: user?.role,
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      label: 'Department',
      value: user?.department,
      icon: Users,
      color: 'text-green-600'
    },
    {
      label: 'Time',
      value: new Date().toLocaleTimeString(),
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  ContextGuard Dashboard
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-sm text-gray-700">
                  Welcome, <span className="font-medium">{user?.username}</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="btn-danger flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-strong transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.name}>
                      {item.available ? (
                        <a
                          href={item.href}
                          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                        >
                          <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center mr-3`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </a>
                      ) : (
                        <div className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed">
                          <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center mr-3">
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-400">Not available for your role</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.username}! 👋
                </h2>
                <p className="text-gray-600">
                  You are logged in as <strong>{user?.role}</strong> in the <strong>{user?.department}</strong> department.
                </p>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.name}>
                      {item.available ? (
                        <a
                          href={item.href}
                          className="card card-hover p-6 block"
                        >
                          <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </a>
                      ) : (
                        <div className="card p-6 opacity-50 cursor-not-allowed">
                          <div className="w-12 h-12 rounded-xl bg-gray-300 flex items-center justify-center mb-4">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Not available for your role
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Context Information */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 text-primary-600 mr-2" />
                  Current Context
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {contextInfo.map((info) => {
                    const IconComponent = info.icon;
                    return (
                      <div key={info.label} className="flex items-center space-x-3">
                        <IconComponent className={`w-5 h-5 ${info.color}`} />
                        <div>
                          <p className="text-sm text-gray-500">{info.label}</p>
                          <p className="font-medium text-gray-900">{info.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Status */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-success-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-500">System Status</p>
                      <p className="font-medium text-gray-900">Online</p>
                    </div>
                  </div>
                </div>
                
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-500">Active Policies</p>
                      <p className="font-medium text-gray-900">12 Active</p>
                    </div>
                  </div>
                </div>
                
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-warning-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-500">Recent Activity</p>
                      <p className="font-medium text-gray-900">3 New Logs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard; 