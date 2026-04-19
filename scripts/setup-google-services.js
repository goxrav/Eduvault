const fs = require("fs");
const path = require("path");

const content = process.env.GOOGLE_SERVICES_JSON;

if (!content) {
  console.log("GOOGLE_SERVICES_JSON not set, skipping...");
  process.exit(0);
}

const dest = path.resolve(__dirname, "../google-services.json");
fs.writeFileSync(dest, content, "utf8");
console.log("✅ google-services.json written successfully");