import { recentPaymentCount } from "./paylog";
import { freeze, isFrozen } from "./gate";

export async function checkVelocity(agentId, windowMs, threshold) {
  const count = recentPaymentCount(agentId, windowMs);
  console.log("Guardian check: " + agentId + " made " + count + " payments in last " + (windowMs / 1000) + "s (threshold " + threshold + ")");
  const alreadyFrozen = await isFrozen(agentId);
  if (count >= threshold && !alreadyFrozen) {
    console.log("ANOMALY DETECTED. Freezing " + agentId + " onchain...");
    await freeze(agentId);
    return true;
  }
  console.log("No anomaly detected.");
  return false;
}
