require("dotenv").config();
const { pgPool } = require("./src/db");

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Test connection
    const client = await pgPool.connect();
    console.log("Database connected successfully");

    // Test query
    const result = await pgPool.query(
      "SELECT username, password_hash FROM users WHERE username = $1",
      ["admin"]
    );
    console.log("Query result:", result.rows);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log("User found:", user.username);
      console.log("Password hash:", user.password_hash);
      if (user.password_hash) {
        console.log("Password hash length:", user.password_hash.length);
        console.log(
          "Password hash starts with:",
          user.password_hash.substring(0, 10)
        );
      } else {
        console.log("Password hash is null!");
      }
    } else {
      console.log("No user found");
    }

    client.release();
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await pgPool.end();
  }
}

testDatabase();
