import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function main() {
  console.log("Creating wallet set...");
  const walletSetResponse = await client.createWalletSet({
    name: "Guardian Agents",
  });
  const walletSetId = walletSetResponse.data.walletSet.id;
  console.log("Wallet set created:", walletSetId);

  console.log("Creating buyer and seller wallets on Arc Testnet...");
  const walletsResponse = await client.createWallets({
    walletSetId: walletSetId,
    blockchains: ["ARC-TESTNET"],
    count: 2,
    accountType: "EOA",
  });

  const wallets = walletsResponse.data.wallets;
  const buyer = wallets[0];
  const seller = wallets[1];

  console.log("");
  console.log("COPY THESE INTO YOUR .env FILE:");
  console.log("WALLET_SET_ID=" + walletSetId);
  console.log("BUYER_WALLET_ID=" + buyer.id);
  console.log("BUYER_WALLET_ADDRESS=" + buyer.address);
  console.log("SELLER_WALLET_ID=" + seller.id);
  console.log("SELLER_WALLET_ADDRESS=" + seller.address);
}

main().catch((err) => {
  console.log("ERROR:", err.message);
});
