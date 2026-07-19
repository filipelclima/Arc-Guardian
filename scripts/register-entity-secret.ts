import { randomBytes } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";

const apiKey = process.env.CIRCLE_API_KEY;
if (!apiKey) {
  throw new Error("CIRCLE_API_KEY is missing. Set it in your .env file first.");
}

if (existsSync("./recovery")) {
  console.log("A recovery folder already exists. Refusing to overwrite it.");
  process.exit(1);
}

const entitySecret = randomBytes(32).toString("hex");

mkdirSync("./recovery", { recursive: true });

await registerEntitySecretCiphertext({
  apiKey,
  entitySecret,
  recoveryFileDownloadPath: "./recovery",
});

appendFileSync(".env", "\nCIRCLE_ENTITY_SECRET=" + entitySecret + "\n");

console.log("DONE: Entity secret registered.");
console.log("DONE: Recovery file saved inside ./recovery folder.");
console.log("DONE: CIRCLE_ENTITY_SECRET was added to your .env file.");
