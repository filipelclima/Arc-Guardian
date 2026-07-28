import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { guarded } from "../core/guard";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function sendUsdc(amount) {
  const walletId = process.env.BUYER_WALLET_ID;
  console.log("Submitting payment of " + amount + " USDC...");
  const txResponse = await client.createTransaction({
    walletId: walletId,
    destinationAddress: process.env.SELLER_WALLET_ADDRESS,
    tokenId: "15dc2b5d-0994-58b0-bf8c-3a0501148ee8",
    amounts: [String(amount)],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
  });
  const transactionId = txResponse.data.id;
  console.log("Submitted:", transactionId);
  return transactionId;
}

export const pay = guarded(process.env.BUYER_WALLET_ID, sendUsdc);
