const bcrypt = require("bcryptjs");

// Test password hashing and comparison
const password = "admin123";
const hash = "$2b$10$1Ylgsmh85cQIRVtMxAhOyOvA8xGCD1NA6BYayntUjOoRMkSTfE8ZK";

console.log("Testing bcrypt...");
console.log("Password:", password);
console.log("Hash:", hash);

try {
  const isValid = bcrypt.compareSync(password, hash);
  console.log("Password valid:", isValid);
} catch (error) {
  console.error("Error:", error.message);
}

// Test creating a new hash
try {
  const newHash = bcrypt.hashSync(password, 10);
  console.log("New hash:", newHash);
  const isValidNew = bcrypt.compareSync(password, newHash);
  console.log("New hash valid:", isValidNew);
} catch (error) {
  console.error("Error creating hash:", error.message);
}
