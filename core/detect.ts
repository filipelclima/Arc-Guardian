import { recentPaymentCount } from "./paylog";
import { freeze, isFrozen } from "./gate";

// Generic velocity-based anomaly check. Freezes agentId if it made
// >= threshold payments within windowMs. Returns true if it froze the agent.
export function checkVelocity(agentId, windowMs, threshold) {
  const count = recentPaymentCount(agentId, windowMs);
  console.log("Guardian check: " + agentId + " made " + count + " payments in last " + (windowMs / 1000) + "s (threshold " + threshold + ")");
  if (count >= threshold && !isFrozen(agentId)) {
    console.log("ANOMALY DETECTED. Freezing " + agentId);
    freeze(agentId);
    return true;
  }
  console.log("No anomaly detected.");
  return false;
}
