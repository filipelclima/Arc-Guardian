import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const scp = initiateSmartContractPlatformClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

const wallets = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

const CONTRACT_ADDRESS = "0x721511beb6ca40640b0ee7e65e27427d7e977dfb";
const BLOCKCHAIN = "ARC-TESTNET";

export async function isFrozen(agentAddress) {
  const response = await scp.queryContract({
    address: CONTRACT_ADDRESS,
    blockchain: BLOCKCHAIN,
    abiFunctionSignature: "isFrozen(address)",
    abiParameters: [agentAddress],
  });
  return BigInt(response.data.outputData) !== 0n;
}

async function waitForTransaction(transactionId) {
  for (let i = 0; i < 15; i++) {
    await new Promise(function(r) { setTimeout(r, 2000); });
    const check = await wallets.getTransaction({ id: transactionId });
    const state = check.data.transaction.state;
    if (state === "COMPLETE" || state === "FAILED" || state === "DENIED") {
      return state;
    }
  }
  return "TIMEOUT";
}

export async function freeze(agentAddress) {
  const response = await wallets.createContractExecutionTransaction({
    walletId: process.env.BUYER_WALLET_ID,
    contractAddress: CONTRACT_ADDRESS,
    abiFunctionSignature: "freeze(address)",
    abiParameters: [agentAddress],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
  });
  const state = await waitForTransaction(response.data.id);
  console.log("Freeze transaction state:", state);
}

export async function unfreeze(agentAddress) {
  const response = await wallets.createContractExecutionTransaction({
    walletId: process.env.BUYER_WALLET_ID,
    contractAddress: CONTRACT_ADDRESS,
    abiFunctionSignature: "unfreeze(address)",
    abiParameters: [agentAddress],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
  });
  const state = await waitForTransaction(response.data.id);
  console.log("Unfreeze transaction state:", state);
}
