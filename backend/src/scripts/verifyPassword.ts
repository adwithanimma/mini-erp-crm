import bcrypt from "bcrypt";

async function main() {
  const password = "admin123";

  // Paste the hash exactly as it is stored in PostgreSQL
  const hash =
    "$2b$10$snwqNAhnxf7IV0Tc.M6OuwOqmMkEL9..Q5UUCenw5vtumT9D/.zie";

  console.log("Compare Result:", await bcrypt.compare(password, hash));
}

main();