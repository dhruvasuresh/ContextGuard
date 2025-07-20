import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";
import {
  DollarSign,
  Users,
  Eye,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  FileText,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SalaryInformation = () => {
  const { user, logout, isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [purposeError, setPurposeError] = useState("");
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

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setSalaryData(null);
    setPurpose("");
    setPurposeError("");
  };

  const handleViewSalary = () => {
    if (!purpose.trim()) {
      setPurposeError(
        "Please provide a business purpose for accessing salary information."
      );
      return;
    }
    if (purpose.trim().length < 10) {
      setPurposeError("Purpose must be at least 10 characters long.");
      return;
    }
    setPurposeError("");
    setShowPurposeModal(false);
    fetchSalaryData();
  };

  const fetchSalaryData = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);
      setError("");
      const data = await apiService.getEmployeeSalary(
        selectedEmployee.id,
        purpose
      );
      setSalaryData(data);
    } catch (err) {
      setError(err.message);
      setSalaryData(null);
    } finally {
      setLoading(false);
    }
  };

  const openPurposeModal = () => {
    if (!selectedEmployee) {
      setError("Please select an employee first.");
      return;
    }
    setShowPurposeModal(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "HR":
        return "bg-purple-100 text-purple-800";
      case "Manager":
        return "bg-blue-100 text-blue-800";
      case "Employee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEmployeeRole = (employee) => {
    // Use position as role if role is not available
    if (employee.role) return employee.role;
    if (employee.position) return employee.position;
    return "Employee";
  };

  const canAccessSalary =
    user && ["Admin", "HR", "Manager"].includes(user.role);

  if (!canAccessSalary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Access Denied
              </h3>
              <p className="text-gray-600">
                You don't have permission to access salary information. This
                feature is restricted to Admin, HR, and Manager roles only.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Salary Information
                    </h1>
                    <p className="text-gray-600">
                      Access salary data with context-aware permissions
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Role:</span> {user?.role}
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">
                    Access Granted
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employee Selection */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 text-gray-600 mr-2" />
                    Select Employee
                  </h3>

                  {loading && !employees.length ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading employees...</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {employees.map((employee) => (
                        <div
                          key={employee.id}
                          onClick={() => handleEmployeeSelect(employee)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedEmployee?.id === employee.id
                              ? "border-purple-300 bg-purple-50 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-medium">
                                  {employee.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {employee.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.department}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                                getEmployeeRole(employee)
                              )}`}
                            >
                              {getEmployeeRole(employee)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Salary Information */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-600 mr-2" />
                    Salary Information
                  </h3>

                  {!selectedEmployee ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Select an Employee
                      </h3>
                      <p className="text-gray-600">
                        Choose an employee from the list to view their salary
                        information.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {selectedEmployee.name}
                            </h4>
                            <p className="text-gray-600">
                              {selectedEmployee.department} •{" "}
                              {getEmployeeRole(selectedEmployee)}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                              getEmployeeRole(selectedEmployee)
                            )}`}
                          >
                            {getEmployeeRole(selectedEmployee)}
                          </span>
                        </div>

                        {!salaryData ? (
                          <div className="text-center">
                            <button
                              onClick={openPurposeModal}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Salary Information
                            </button>
                            <p className="text-sm text-gray-500 mt-2">
                              You'll need to provide a business purpose for
                              accessing this information.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                              <div>
                                <div className="text-sm font-medium text-gray-500">
                                  Base Salary
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                  $
                                  {salaryData.base_salary?.toLocaleString() ||
                                    "N/A"}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  Annual
                                </div>
                                <div className="text-sm font-medium text-green-600">
                                  +{salaryData.bonus_percentage || 0}% Bonus
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm font-medium text-gray-500">
                                  Total Compensation
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                  $
                                  {salaryData.total_compensation?.toLocaleString() ||
                                    "N/A"}
                                </div>
                              </div>
                              <div className="p-4 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm font-medium text-gray-500">
                                  Last Updated
                                </div>
                                <div className="text-sm text-gray-900">
                                  {salaryData.last_updated
                                    ? new Date(
                                        salaryData.last_updated
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <div>
                                  <div className="text-sm font-medium text-green-800">
                                    Access Granted
                                  </div>
                                  <div className="text-sm text-green-600">
                                    Purpose: {purpose}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-red-800">
                                Access Denied
                              </div>
                              <div className="text-sm text-red-600">
                                {error}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

      {/* Purpose Modal */}
      {showPurposeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 text-purple-600 mr-2" />
                Business Purpose Required
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Please provide a detailed business purpose for accessing
                  salary information. This helps ensure compliance and proper
                  access control.
                </p>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Purpose *
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Performance review and salary adjustment analysis for Q4 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                />
                {purposeError && (
                  <p className="text-sm text-red-600 mt-1">{purposeError}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPurposeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleViewSalary}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 border border-transparent rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "View Salary"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryInformation;
