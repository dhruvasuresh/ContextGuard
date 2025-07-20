# ContextGuard - Context-Aware Access Control System

A comprehensive access control system that implements context-aware security policies for employee management, salary information, and audit logging.

## 🚀 Features

### Core Functionality

- **Employee Directory Management** - Complete CRUD operations for employee data
- **Salary Information Access** - Role-based salary viewing with business purpose validation
- **Policy Management** - Dynamic access control policies with time, location, and role restrictions
- **Audit Logging** - Comprehensive system activity monitoring and compliance tracking
- **Persistent Navigation** - Collapsible sidebar with role-based access control

### Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin, HR, Manager, and Employee roles
- **Context-Aware Policies** - Time, location, IP, and purpose-based restrictions
- **Audit Trail** - Complete activity logging for compliance and security

## 🏗️ Architecture

### Frontend

- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive UI
- **React Router** for client-side navigation
- **Context API** for state management

### Backend

- **Node.js** with Express.js
- **MongoDB** for policy and audit data
- **PostgreSQL** for employee and salary data
- **JWT** for authentication
- **bcrypt** for password hashing

## 📁 Project Structure

```
ContextGuard/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── employees.js
│   │   │   ├── policies.js
│   │   │   └── audit-logs.js
│   │   ├── services/
│   │   │   ├── policyEngine.js
│   │   │   └── auditLogger.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── employees/
│   │   │   ├── salary/
│   │   │   ├── policies/
│   │   │   └── audit/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/skanda-gowda-10/Dynaccess.git
cd Dynaccess
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb://localhost:27017/contextguard
POSTGRES_URI=postgres://username:password@localhost:5432/contextguard
PORT=5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Database Setup

```bash
# Start MongoDB and PostgreSQL
# Create the contextguard database in PostgreSQL
```

### 5. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔐 Default Users

The system comes with pre-configured users for testing:

### Admin User

- **Username:** admin
- **Password:** admin123
- **Role:** Admin
- **Access:** All features

### HR User

- **Username:** hr_manager
- **Password:** hr123
- **Role:** HR
- **Access:** Employee Directory, Salary Info, Audit Logs

### Manager User

- **Username:** manager
- **Password:** manager123
- **Role:** Manager
- **Access:** Employee Directory, Salary Info

### Employee User

- **Username:** employee
- **Password:** emp123
- **Role:** Employee
- **Access:** Employee Directory (view only)

## 🎯 Features Overview

### Employee Directory

- **View all employees** with search and filtering
- **Add new employees** with complete information
- **Edit employee details** with real-time updates
- **Delete employees** with confirmation
- **Filter by role, department, and position**
- **Export employee data**

### Salary Information

- **Role-based access** (Admin, HR, Manager only)
- **Business purpose validation** required
- **Real-time salary data** with formatting
- **Access logging** for compliance
- **Policy enforcement** based on time and location

### Policy Management

- **Create dynamic policies** with multiple conditions
- **Time-based restrictions** (business hours, weekdays)
- **Location-based access** (office IP requirements)
- **Role-based permissions** with granular control
- **Purpose validation** for sensitive data access

### Audit Logs

- **Complete activity tracking** for all system actions
- **Filter by action, user, resource, and result**
- **Date range filtering** for compliance reporting
- **Export functionality** for external analysis
- **Real-time monitoring** of security events

### Navigation

- **Persistent sidebar** with collapsible design
- **Role-based menu items** showing only accessible features
- **Current page highlighting** for better UX
- **Smooth transitions** and responsive design

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Employees

- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Salary

- `GET /api/employees/:id/salary` - Get employee salary (with purpose validation)

### Policies

- `GET /api/policies` - Get all policies
- `POST /api/policies` - Create new policy
- `PUT /api/policies/:id` - Update policy
- `DELETE /api/policies/:id` - Delete policy

### Audit Logs

- `GET /api/audit-logs` - Get audit logs with filtering
- `POST /api/audit-logs` - Create audit log entry

## 🐳 Docker Deployment

### Using Docker Compose

```bash
cd docker
docker-compose up -d
```

This will start:

- MongoDB container
- PostgreSQL container
- Backend API container
- Frontend application container

## 🔒 Security Features

### Authentication & Authorization

- JWT-based authentication with secure token storage
- Role-based access control with granular permissions
- Session management with automatic token refresh

### Policy Engine

- Context-aware access control based on:
  - User role and permissions
  - Time of day and day of week
  - IP address and location
  - Business purpose validation
  - Resource sensitivity levels

### Audit & Compliance

- Complete audit trail for all system activities
- Real-time security event monitoring
- Compliance reporting capabilities
- Data export for external analysis

## 🚀 Development

### Hot Reload

Both frontend and backend support hot reload for development:

- Frontend: Vite HMR enabled
- Backend: Nodemon for automatic restarts

### Environment Variables

Configure your environment variables in the backend `.env` file:

```env
JWT_SECRET=your_secure_jwt_secret
MONGODB_URI=mongodb://localhost:27017/contextguard
POSTGRES_URI=postgres://username:password@localhost:5432/contextguard
PORT=5000
NODE_ENV=development
```

## 📊 Monitoring & Logging

### Audit Logs

- All system activities are logged
- Filterable by action, user, resource, and time
- Exportable for compliance reporting

### Error Handling

- Comprehensive error handling with user-friendly messages
- Detailed logging for debugging
- Graceful degradation for network issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation

---

**ContextGuard** - Secure, Context-Aware Access Control for Modern Organizations
