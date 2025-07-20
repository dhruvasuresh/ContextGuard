import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import apiService from "../../services/api";
import {
  Eye,
  Shield,
  Clock,
  User,
  Activity,
  Filter,
  Download,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Menu,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  LogOut,
} from "lucide-react";

const AuditLogs = () => {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    action: "",
    user: "",
    resource: "",
    result: "",
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogDetails, setShowLogDetails] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getAuditLogs(filterParams);
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    fetchAuditLogs(activeFilters);
  };

  const clearFilters = () => {
    setFilters({
      action: "",
      user: "",
      resource: "",
      result: "",
      dateFrom: "",
      dateTo: "",
    });
    fetchAuditLogs();
  };

  const exportLogs = async () => {
    try {
      const data = await apiService.exportAuditLogs(filters);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to export logs: " + err.message);
    }
  };

  const viewLogDetails = (log) => {
    setSelectedLog(log);
    setShowLogDetails(true);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "login":
      case "logout":
        return <User className="w-4 h-4" />;
      case "view":
      case "read":
        return <Eye className="w-4 h-4" />;
      case "create":
      case "create_policy":
      case "create_employee":
        return <CheckCircle className="w-4 h-4" />;
      case "update":
      case "update_policy":
      case "update_employee":
        return <Activity className="w-4 h-4" />;
      case "delete":
      case "delete_policy":
      case "delete_employee":
        return <XCircle className="w-4 h-4" />;
      case "access_denied":
      case "unauthorized":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "success":
        return "text-green-600 bg-green-100";
      case "failure":
      case "denied":
        return "text-red-600 bg-red-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getActionColor = (action) => {
    if (action.includes("denied") || action.includes("unauthorized")) {
      return "text-red-600";
    }
    if (action.includes("create") || action.includes("login")) {
      return "text-green-600";
    }
    if (action.includes("update")) {
      return "text-blue-600";
    }
    if (action.includes("delete")) {
      return "text-red-600";
    }
    return "text-gray-600";
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (duration) => {
    if (!duration) return "-";
    return `${duration}ms`;
  };

  // Role-based access control
  const canViewAuditLogs =
    user && (user.role === "Admin" || user.role === "HR");

  if (!canViewAuditLogs) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                ContextGuard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Access Denied
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have permission to view audit logs. This feature is
                  restricted to Admin and HR roles only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              ContextGuard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.name || user?.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-16"
          } bg-white shadow-sm transition-all duration-300 ease-in-out min-h-screen`}
        >
          <div className="p-4">
            <nav className="space-y-2">
              <Link
                to="/employees"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <Users className="w-5 h-5" />
                {sidebarOpen && <span>Employee Directory</span>}
              </Link>
              <Link
                to="/salary"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <DollarSign className="w-5 h-5" />
                {sidebarOpen && <span>Salary Information</span>}
              </Link>
              {user?.role === "Admin" && (
                <Link
                  to="/policies"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <FileText className="w-5 h-5" />
                  {sidebarOpen && <span>Policy Management</span>}
                </Link>
              )}
              {(user?.role === "Admin" || user?.role === "HR") && (
                <Link
                  to="/audit-logs"
                  className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-md"
                >
                  <BarChart3 className="w-5 h-5" />
                  {sidebarOpen && <span>Audit Logs</span>}
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="mt-2 text-gray-600">
              Monitor system activities, security events, and user actions for
              compliance and security.
            </p>
          </div>

          {/* Action Bar */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                System Activity Log
              </h2>
              <p className="text-sm text-gray-500">
                {logs.length} log entries found
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button
                onClick={exportLogs}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => fetchAuditLogs()}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Filter Logs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action
                  </label>
                  <select
                    value={filters.action}
                    onChange={(e) =>
                      handleFilterChange("action", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Actions</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="view">View</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="access_denied">Access Denied</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <input
                    type="text"
                    value={filters.user}
                    onChange={(e) => handleFilterChange("user", e.target.value)}
                    placeholder="Username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource
                  </label>
                  <input
                    type="text"
                    value={filters.resource}
                    onChange={(e) =>
                      handleFilterChange("resource", e.target.value)
                    }
                    placeholder="Resource"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Result
                  </label>
                  <select
                    value={filters.result}
                    onChange={(e) =>
                      handleFilterChange("result", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Results</option>
                    <option value="success">Success</option>
                    <option value="failure">Failure</option>
                    <option value="denied">Denied</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Logs Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading audit logs...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resource
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getActionIcon(log.action)}
                            <span
                              className={`ml-2 text-sm font-medium ${getActionColor(
                                log.action
                              )}`}
                            >
                              {log.action}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {log.user_id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.username || "Unknown"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {log.resource}
                          </div>
                          {log.ip_address && (
                            <div className="text-sm text-gray-500">
                              IP: {log.ip_address}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(
                              log.result
                            )}`}
                          >
                            {log.result}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatTimestamp(log.timestamp)}
                          </div>
                          {log.duration && (
                            <div className="text-sm text-gray-500">
                              {formatDuration(log.duration)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => viewLogDetails(log)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Log Details Modal */}
          {showLogDetails && selectedLog && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Log Details
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Action
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedLog.action}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Result
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(
                            selectedLog.result
                          )}`}
                        >
                          {selectedLog.result}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          User ID
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedLog.user_id}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedLog.username || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Resource
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedLog.resource}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          IP Address
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedLog.ip_address || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Timestamp
                        </label>
                        <p className="text-sm text-gray-900">
                          {formatTimestamp(selectedLog.timestamp)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Duration
                        </label>
                        <p className="text-sm text-gray-900">
                          {formatDuration(selectedLog.duration)}
                        </p>
                      </div>
                    </div>

                    {selectedLog.reason && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Reason
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedLog.reason}
                        </p>
                      </div>
                    )}

                    {selectedLog.details && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Details
                        </label>
                        <pre className="text-sm text-gray-900 bg-gray-50 p-2 rounded overflow-auto">
                          {JSON.stringify(selectedLog.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setShowLogDetails(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
