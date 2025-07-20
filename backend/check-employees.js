require("dotenv").config();
const { pgPool } = require("./src/db");

async function checkEmployees() {
  try {
    console.log("Checking employees in database...");

    const result = await pgPool.query(
      "SELECT id, name, email, department, position, salary, hire_date FROM employees ORDER BY id"
    );

    console.log(`Found ${result.rows.length} employees:`);
    result.rows.forEach((emp) => {
      console.log(
        `${emp.id}. ${emp.name} - ${emp.position} (${emp.department}) - $${emp.salary}`
      );
    });
  } catch (error) {
    console.error("Error checking employees:", error);
  } finally {
    await pgPool.end();
  }
}

checkEmployees();
