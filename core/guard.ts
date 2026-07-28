import { isFrozen } from "./gate";
import { recordPayment } from "./paylog";

// Wraps any send function with Guardian gate-checking and spend logging.
export function guarded(agentId, sendFn) {
  return async function(amount, extra) {
    const frozen = await isFrozen(agentId);
    if (frozen) {
      console.log("BLOCKED: " + agentId + " is frozen by Guardian. Payment refused.");
      return { blocked: true };
    }
    const result = await sendFn(amount, extra);
    recordPayment(agentId, amount);
    return { blocked: false, result: result };
  };
}
