import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import apiService from "../../services/api";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Clock,
  MapPin,
  Users,
  FileText,
  Menu,
  DollarSign,
  BarChart3,
  LogOut,
} from "lucide-react";

const PolicyManagement = () => {
  const { user, logout } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    policy_id: "",
    name: "",
    resource: "",
    sensitivity: "medium",
    allow_if: {
      role: [],
      time_range: "",
      weekdays_only: false,
      from_office_ip: false,
      purpose_required: false,
    },
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getPolicies();
      setPolicies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    try {
      setLoading(true);
      await apiService.createPolicy(formData);
      setShowCreateModal(false);
      resetForm();
      fetchPolicies();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePolicy = async () => {
    try {
      setLoading(true);
      await apiService.updatePolicy(selectedPolicy.policy_id, formData);
      setShowEditModal(false);
      resetForm();
      fetchPolicies();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async () => {
    try {
      setLoading(true);
      await apiService.deletePolicy(selectedPolicy.policy_id);
      setShowDeleteModal(false);
      fetchPolicies();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      policy_id: "",
      name: "",
      resource: "",
      sensitivity: "medium",
      allow_if: {
        role: [],
        time_range: "",
        weekdays_only: false,
        from_office_ip: false,
        purpose_required: false,
      },
    });
    setSelectedPolicy(null);
    setError("");
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (policy) => {
    setSelectedPolicy(policy);
    setFormData({
      policy_id: policy.policy_id,
      name: policy.name,
      resource: policy.resource,
      sensitivity: policy.sensitivity,
      allow_if: { ...policy.allow_if },
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (policy) => {
    setSelectedPolicy(policy);
    setShowDeleteModal(true);
  };

  const handleRoleChange = (role, checked) => {
    const newRoles = checked
      ? [...formData.allow_if.role, role]
      : formData.allow_if.role.filter((r) => r !== role);

    setFormData({
      ...formData,
      allow_if: {
        ...formData.allow_if,
        role: newRoles,
      },
    });
  };

  const getSensitivityColor = (sensitivity) => {
    switch (sensitivity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResourceIcon = (resource) => {
    switch (resource) {
      case "employee_salary":
        return <Shield className="w-4 h-4" />;
      case "employee_directory":
        return <Users className="w-4 h-4" />;
      case "policy_management":
        return <FileText className="w-4 h-4" />;
      case "audit_logs":
        return <Eye className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Role-based access control
  const canManagePolicies = user && user.role === "Admin";

  if (!canManagePolicies) {
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
                  You don't have permission to manage policies. This feature is
                  restricted to Admin role only.
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
                  className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-md"
                >
                  <FileText className="w-5 h-5" />
                  {sidebarOpen && <span>Policy Management</span>}
                </Link>
              )}
              {(user?.role === "Admin" || user?.role === "HR") && (
                <Link
                  to="/audit-logs"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
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
            <h1 className="text-3xl font-bold text-gray-900">
              Policy Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage access control policies for the ContextGuard system.
            </p>
          </div>

          {/* Action Bar */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Access Control Policies
              </h2>
              <p className="text-sm text-gray-500">
                Configure who can access what, when, and how
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Policy
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Policies List */}
          <div className="bg-white rounded-lg shadow">
            {loading && !policies.length ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading policies...</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Policy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resource
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restrictions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {policies.map((policy) => (
                      <tr key={policy.policy_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {policy.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {policy.policy_id}
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSensitivityColor(
                                policy.sensitivity
                              )}`}
                            >
                              {policy.sensitivity} sensitivity
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getResourceIcon(policy.resource)}
                            <span className="ml-2 text-sm text-gray-900">
                              {policy.resource}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {policy.allow_if.role.map((role) => (
                              <span
                                key={role}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 space-y-1">
                            {policy.allow_if.time_range && (
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{policy.allow_if.time_range}</span>
                              </div>
                            )}
                            {policy.allow_if.weekdays_only && (
                              <div className="flex items-center">
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  Weekdays only
                                </span>
                              </div>
                            )}
                            {policy.allow_if.from_office_ip && (
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="text-xs">
                                  Office IP required
                                </span>
                              </div>
                            )}
                            {policy.allow_if.purpose_required && (
                              <div className="flex items-center">
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  Purpose required
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(policy)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(policy)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Create/Edit Policy Modal */}
          {(showCreateModal || showEditModal) && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {showCreateModal ? "Create New Policy" : "Edit Policy"}
                  </h3>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Policy ID *
                        </label>
                        <input
                          type="text"
                          value={formData.policy_id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              policy_id: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., SALARY_ADMIN_001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Policy Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Admin Salary Access"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resource *
                        </label>
                        <select
                          value={formData.resource}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              resource: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Resource</option>
                          <option value="employee_salary">
                            Employee Salary
                          </option>
                          <option value="employee_directory">
                            Employee Directory
                          </option>
                          <option value="policy_management">
                            Policy Management
                          </option>
                          <option value="audit_logs">Audit Logs</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sensitivity Level
                        </label>
                        <select
                          value={formData.sensitivity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sensitivity: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allowed Roles *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {["Admin", "HR", "Manager", "Employee"].map((role) => (
                          <label key={role} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.allow_if.role.includes(role)}
                              onChange={(e) =>
                                handleRoleChange(role, e.target.checked)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {role}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time Range
                        </label>
                        <input
                          type="text"
                          value={formData.allow_if.time_range}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              allow_if: {
                                ...formData.allow_if,
                                time_range: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 09:00-17:00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.allow_if.weekdays_only}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                allow_if: {
                                  ...formData.allow_if,
                                  weekdays_only: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Weekdays only
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.allow_if.from_office_ip}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                allow_if: {
                                  ...formData.allow_if,
                                  from_office_ip: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Office IP required
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.allow_if.purpose_required}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                allow_if: {
                                  ...formData.allow_if,
                                  purpose_required: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Purpose required
                          </span>
                        </label>
                      </div>
                    </div>
                  </form>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={
                        showCreateModal
                          ? handleCreatePolicy
                          : handleUpdatePolicy
                      }
                      disabled={
                        loading ||
                        !formData.policy_id ||
                        !formData.name ||
                        !formData.resource ||
                        formData.allow_if.role.length === 0
                      }
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Saving..."
                        : showCreateModal
                        ? "Create Policy"
                        : "Update Policy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && selectedPolicy && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Delete Policy
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete the policy "
                    {selectedPolicy.name}"? This action cannot be undone.
                  </p>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeletePolicy}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Deleting..." : "Delete Policy"}
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

export default PolicyManagement;
