const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Authentication
  async login(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  }

  // Employees
  async getEmployees() {
    try {
      const response = await fetch(`${this.baseURL}/api/employees`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to fetch employees.');
    }
  }

  async getEmployeeSalary(id, purpose = null) {
    try {
      const response = await fetch(`${this.baseURL}/api/employees/${id}/salary`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ purpose })
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to fetch salary information.');
    }
  }

  // Policies (Admin only)
  async getPolicies() {
    try {
      const response = await fetch(`${this.baseURL}/api/policies`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to fetch policies.');
    }
  }

  async createPolicy(policyData) {
    try {
      const response = await fetch(`${this.baseURL}/api/policies`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(policyData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to create policy.');
    }
  }

  async updatePolicy(id, policyData) {
    try {
      const response = await fetch(`${this.baseURL}/api/policies/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(policyData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to update policy.');
    }
  }

  async deletePolicy(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/policies/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to delete policy.');
    }
  }

  // Audit Logs (Admin only)
  async getAuditLogs() {
    try {
      const response = await fetch(`${this.baseURL}/api/audit-logs`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to fetch audit logs.');
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error('Backend is not available.');
    }
  }
}

export default new ApiService(); 