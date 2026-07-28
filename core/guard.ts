import { isFrozen } from "./gate";
import { recordPayment } from "./paylog";

// Wraps any send function with Guardian gate-checking and spend logging.
// sendFn must be an async function that performs the actual transfer and
// returns whatever result you want callers to see on success.
export function guarded(agentId, sendFn) {
  return async function(amount, extra) {
    if (isFrozen(agentId)) {
      console.log("BLOCKED: " + agentId + " is frozen by Guardian. Payment refused.");
      return { blocked: true };
    }
    const result = await sendFn(amount, extra);
    recordPayment(agentId, amount);
    return { blocked: false, result: result };
  };
}
