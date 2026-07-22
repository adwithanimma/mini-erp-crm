import bcrypt from "bcrypt";

async function main() {
  const password = "admin123";

  const hash = await bcrypt.hash(password, 10);

  console.log("Generated Hash:", hash);

  const result = await bcrypt.compare(password, hash);

  console.log("Compare Result:", result);
}

main();