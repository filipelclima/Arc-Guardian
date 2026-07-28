import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";
import { readFileSync } from "node:fs";

const client = initiateSmartContractPlatformClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

const abiJson = readFileSync("core/spendgate-abi.json", "utf8");
const bytecode = "0x" + readFileSync("core/spendgate-bytecode.txt", "utf8").trim();

async function main() {
  console.log("Deploying SpendGate...");
  const response = await client.deployContract({
    name: "SpendGate",
    description: "Onchain freeze gate for Guardian",
    walletId: process.env.BUYER_WALLET_ID,
    blockchain: "ARC-TESTNET",
    abiJson: abiJson,
    bytecode: bytecode,
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
  });
  console.log("Deploy response:", JSON.stringify(response.data));
  const contractId = response.data.contractId;

  for (let i = 0; i < 15; i++) {
    await new Promise(function(r) { setTimeout(r, 3000); });
    const check = await client.getContract({ id: contractId });
    const status = check.data.contract.deploymentStatus;
    const address = check.data.contract.contractAddress;
    console.log("Status:", status, "Address:", address);
    if (status === "COMPLETE" || status === "FAILED") {
      break;
    }
  }
}

main().catch(function(err) { console.log("ERROR:", err.message); });
