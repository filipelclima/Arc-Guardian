import { readFileSync, writeFileSync, existsSync } from "node:fs";

const LOG_FILE = "guardian-payments.json";

function readLog() {
  if (!existsSync(LOG_FILE)) return [];
  return JSON.parse(readFileSync(LOG_FILE, "utf8"));
}

export function recordPayment(walletId, amount) {
  const log = readLog();
  log.push({ walletId: walletId, amount: amount, ts: Date.now() });
  writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

export function recentPaymentCount(walletId, windowMs) {
  const log = readLog();
  const cutoff = Date.now() - windowMs;
  return log.filter(function(e) { return e.walletId === walletId && e.ts >= cutoff; }).length;
}
