require("dotenv").config();
const { pgPool } = require("./src/db");

async function setupEmployees() {
  try {
    console.log("Setting up employees table...");

    // Create employees table
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        department VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        salary DECIMAL(10,2) NOT NULL,
        hire_date DATE NOT NULL,
        manager_id INTEGER REFERENCES employees(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Employees table created successfully!");

    // Check if we already have employees
    const existingEmployees = await pgPool.query(
      "SELECT COUNT(*) FROM employees"
    );
    if (existingEmployees.rows[0].count > 0) {
      console.log("Employees table already has data, skipping insertion.");
      return;
    }

    // Insert sample employees
    const employees = [
      {
        name: "John Smith",
        email: "john.smith@company.com",
        department: "Engineering",
        position: "Senior Software Engineer",
        salary: 95000.0,
        hire_date: "2022-01-15",
        manager_id: null,
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        department: "Human Resources",
        position: "HR Manager",
        salary: 85000.0,
        hire_date: "2021-06-20",
        manager_id: null,
      },
      {
        name: "Mike Chen",
        email: "mike.chen@company.com",
        department: "Engineering",
        position: "Software Engineer",
        salary: 75000.0,
        hire_date: "2023-03-10",
        manager_id: 1,
      },
      {
        name: "Emily Davis",
        email: "emily.davis@company.com",
        department: "Sales",
        position: "Sales Representative",
        salary: 65000.0,
        hire_date: "2022-08-05",
        manager_id: null,
      },
      {
        name: "David Wilson",
        email: "david.wilson@company.com",
        department: "Finance",
        position: "Financial Analyst",
        salary: 70000.0,
        hire_date: "2021-11-12",
        manager_id: null,
      },
      {
        name: "Lisa Brown",
        email: "lisa.brown@company.com",
        department: "Marketing",
        position: "Marketing Specialist",
        salary: 60000.0,
        hire_date: "2023-01-20",
        manager_id: null,
      },
      {
        name: "Alex Rodriguez",
        email: "alex.rodriguez@company.com",
        department: "Engineering",
        position: "Junior Developer",
        salary: 55000.0,
        hire_date: "2023-07-15",
        manager_id: 1,
      },
      {
        name: "Jennifer Lee",
        email: "jennifer.lee@company.com",
        department: "Human Resources",
        position: "HR Specialist",
        salary: 58000.0,
        hire_date: "2022-09-30",
        manager_id: 2,
      },
    ];

    for (const employee of employees) {
      await pgPool.query(
        "INSERT INTO employees (name, email, department, position, salary, hire_date, manager_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          employee.name,
          employee.email,
          employee.department,
          employee.position,
          employee.salary,
          employee.hire_date,
          employee.manager_id,
        ]
      );
      console.log(`Added employee: ${employee.name}`);
    }

    console.log("All employees added successfully!");

    // Show the employees
    const result = await pgPool.query(
      "SELECT id, name, email, department, position, salary, hire_date FROM employees ORDER BY id"
    );
    console.log("\nCurrent employees:");
    result.rows.forEach((emp) => {
      console.log(
        `${emp.id}. ${emp.name} - ${emp.position} (${emp.department}) - $${emp.salary}`
      );
    });
  } catch (error) {
    console.error("Error setting up employees:", error);
  } finally {
    await pgPool.end();
  }
}

setupEmployees();
