import { checkVelocity } from "../core/detect";

const WINDOW_MS = 600000;
const THRESHOLD = 3;

checkVelocity(process.env.BUYER_WALLET_ID, WINDOW_MS, THRESHOLD);
