import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

const requestedAmount = 0.05;
const budget = 1.0;

function buyerShouldPay(amount, budget) {
  return amount <= budget;
}

async function main() {
  console.log("Decision: requested=" + requestedAmount + " budget=" + budget);
  const approved = buyerShouldPay(requestedAmount, budget);
  console.log("Approved:", approved);
  if (!approved) {
    console.log("Payment skipped - over budget.");
    return;
  }

  console.log("Submitting payment...");
  const txResponse = await client.createTransaction({
    walletId: process.env.BUYER_WALLET_ID,
    destinationAddress: process.env.SELLER_WALLET_ADDRESS,
    tokenId: "15dc2b5d-0994-58b0-bf8c-3a0501148ee8",
    amounts: [String(requestedAmount)],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
  });

  const transactionId = txResponse.data.id;
  console.log("Transaction submitted:", transactionId);

  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const check = await client.getTransaction({ id: transactionId });
    const state = check.data.transaction.state;
    console.log("State:", state);
    if (state === "COMPLETE" || state === "FAILED" || state === "DENIED") {
      break;
    }
  }
}

main().catch((err) => {
  console.log("ERROR:", err.message);
});
