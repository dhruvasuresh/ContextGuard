require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pgPool } = require("./src/db");

async function createUsers() {
  try {
    console.log("Creating users...");

    const users = [
      {
        username: "admin",
        email: "admin@contextguard.com",
        password: "admin123",
        role: "Admin",
        department: "IT",
      },
      {
        username: "alice_hr",
        email: "alice@contextguard.com",
        password: "password",
        role: "HR",
        department: "Human Resources",
      },
      {
        username: "bob_intern",
        email: "bob@contextguard.com",
        password: "password",
        role: "Intern",
        department: "Engineering",
      },
      {
        username: "carol_manager",
        email: "carol@contextguard.com",
        password: "password",
        role: "Manager",
        department: "Sales",
      },
      {
        username: "david_auditor",
        email: "david@contextguard.com",
        password: "password",
        role: "Auditor",
        department: "Finance",
      },
    ];

    for (const user of users) {
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      console.log(
        `Creating user: ${user.username} with hash: ${hashedPassword.substring(
          0,
          20
        )}...`
      );

      await pgPool.query(
        "INSERT INTO users (username, email, password_hash, role, department) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO UPDATE SET password_hash = $3, role = $4, department = $5",
        [user.username, user.email, hashedPassword, user.role, user.department]
      );
    }

    console.log("All users created successfully!");

    // Test the admin user
    const result = await pgPool.query(
      "SELECT username, password_hash FROM users WHERE username = $1",
      ["admin"]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log("Admin user found:", user.username);
      console.log("Password hash type:", typeof user.password_hash);
      console.log("Password hash:", user.password_hash);

      // Test password
      const isValid = bcrypt.compareSync("admin123", user.password_hash);
      console.log("Password test result:", isValid);
    }
  } catch (error) {
    console.error("Error creating users:", error);
  } finally {
    await pgPool.end();
  }
}

createUsers();
