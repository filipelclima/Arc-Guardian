import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function checkBalance(label, walletId) {
  const response = await client.getWalletTokenBalance({ id: walletId });
  const balances = response.data.tokenBalances;
  if (!balances || balances.length === 0) {
    console.log(label + ": 0 (not funded yet)");
    return;
  }
  for (const b of balances) {
    console.log(label + ": " + b.amount + " " + b.token.symbol + " (tokenId: " + b.token.id + ")");
  }
}

async function main() {
  await checkBalance("Buyer", process.env.BUYER_WALLET_ID);
  await checkBalance("Seller", process.env.SELLER_WALLET_ID);
}

main().catch((err) => {
  console.log("ERROR:", err.message);
});
