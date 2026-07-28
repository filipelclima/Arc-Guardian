import { unfreeze } from "../core/gate";

const walletId = process.env.BUYER_WALLET_ID;
unfreeze(walletId);
console.log("Unfroze wallet " + walletId);
