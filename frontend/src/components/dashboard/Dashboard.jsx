import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Activity,
  Home,
  BarChart3,
  Bell,
  Search,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: "Employee Directory",
      icon: Users,
      description: "View and manage employee information",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      href: "/employees",
      available: true,
      isActive: location.pathname === "/employees",
    },
    {
      name: "Salary Information",
      icon: DollarSign,
      description: "Access salary data with context-aware permissions",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      href: "/salary",
      available: true,
      isActive: location.pathname === "/salary",
    },
    {
      name: "Policy Management",
      icon: Settings,
      description: "Manage access control policies",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      href: "/policies",
      available: isAdmin(),
      isActive: location.pathname === "/policies",
    },
    {
      name: "Audit Logs",
      icon: FileText,
      description: "View system access logs and security events",
      color: "bg-gradient-to-r from-red-500 to-red-600",
      href: "/audit-logs",
      available: isAdmin(),
      isActive: location.pathname === "/audit-logs",
    },
  ];

  const contextInfo = [
    {
      label: "User",
      value: user?.username,
      icon: UserCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Role",
      value: user?.role,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Department",
      value: user?.department,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Time",
      value: new Date().toLocaleTimeString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const statsCards = [
    {
      title: "Total Employees",
      value: "24",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Policies",
      value: "6",
      change: "+2",
      changeType: "positive",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Audit Events",
      value: "21",
      change: "Today",
      changeType: "neutral",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "System Health",
      value: "100%",
      change: "Excellent",
      changeType: "positive",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    ContextGuard
                  </h1>
                  <p className="text-xs text-gray-500">Secure Access Control</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {user?.username}
                    </div>
                    <div className="text-gray-500">{user?.role}</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
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
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-3 space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.name}>
                      {item.available ? (
                        <Link
                          to={item.href}
                          className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                            item.isActive
                              ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl ${
                              item.color
                            } flex items-center justify-center mr-3 shadow-sm transition-all duration-200 ${
                              item.isActive
                                ? "scale-110"
                                : "group-hover:scale-105"
                            }`}
                          >
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </div>
                          </div>
                          {item.isActive && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </Link>
                      ) : (
                        <div className="group flex items-center px-3 py-3 text-sm font-medium rounded-xl text-gray-400 cursor-not-allowed">
                          <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center mr-3">
                            <IconComponent className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              Not available for your role
                            </div>
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
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Welcome back, {user?.username}! 👋
                    </h2>
                    <p className="text-blue-100 text-lg">
                      You are logged in as <strong>{user?.role}</strong> in the{" "}
                      <strong>{user?.department}</strong> department.
                    </p>
                    <p className="text-blue-100 mt-2">
                      Manage your secure access control system with confidence.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {card.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {card.value}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}
                      >
                        <IconComponent className={`w-6 h-6 ${card.color}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span
                        className={`text-xs font-medium ${
                          card.changeType === "positive"
                            ? "text-green-600"
                            : card.changeType === "negative"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {card.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {navigationItems
                .filter((item) => item.available)
                .map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                      <div
                        className={`w-16 h-16 rounded-xl ${item.color} flex items-center justify-center mb-4 shadow-sm`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center text-sm text-blue-600 font-medium">
                        Access Feature
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
            </div>

            {/* Context Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                Current Context
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contextInfo.map((info) => {
                  const IconComponent = info.icon;
                  return (
                    <div
                      key={info.label}
                      className={`${info.bgColor} rounded-lg p-4 border border-gray-100`}
                    >
                      <div className="flex items-center">
                        <IconComponent
                          className={`w-5 h-5 ${info.color} mr-2`}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-600">
                            {info.label}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {info.value}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
