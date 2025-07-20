require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pgPool } = require("./src/db");

async function debugLogin() {
  try {
    console.log("Debugging login...");

    // Test database query
    const result = await pgPool.query(
      "SELECT * FROM users WHERE username = $1",
      ["admin"]
    );
    console.log("Query result rows:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("No user found");
      return;
    }

    const user = result.rows[0];
    console.log("User found:", user.username);
    console.log("Password hash type:", typeof user.password_hash);
    console.log("Password hash:", user.password_hash);

    // Test password comparison
    const password = "admin123";
    console.log("Testing password:", password);

    try {
      console.log("About to call bcrypt.compare...");
      const valid = await bcrypt.compare(password, user.password_hash);
      console.log("bcrypt.compare result:", valid);
    } catch (bcryptError) {
      console.error("bcrypt.compare error:", bcryptError);
    }
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await pgPool.end();
  }
}

debugLogin();
