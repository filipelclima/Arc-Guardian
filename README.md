# Arc Guardian

Autonomous Guardian Agent that monitors USDC spending across AI agent wallets on Arc, and freezes anomalous behavior in real time - no human in the loop. Guardian flips the usual agentic-economy demo: instead of showing an agent spending money, it shows an agent governing spend.

## Structure

This repo is split into two parts on purpose:

- `core/` - the reusable primitive. Framework-agnostic spend-governance logic that any agent project can fork and drop in.
  - `gate.ts` - tracks which agent IDs are frozen
  - `paylog.ts` - records payment history, used to detect patterns
  - `guard.ts` - wraps ANY async send function with gate-checking and logging. This is the main integration point: `guarded(agentId, sendFn)` returns a gated version of your own payment function.
  - `detect.ts` - generic velocity-based anomaly check: `checkVelocity(agentId, windowMs, threshold)` freezes an agent if it exceeds a payment rate you define.
- `demo/` - a concrete example built on Circle Developer-Controlled Wallets and Arc Testnet, showing core/ in action with a Buyer and Seller agent.

## What works right now
- Circle Developer-Controlled Wallets set up on Arc Testnet
- Buyer and Seller agent wallets created and funded
- Working end-to-end USDC payment between agents, gated through core/guard.ts
- Anomaly detection: a simulated runaway agent gets detected and frozen mid-loop, then blocked on its next attempt

## Coming next
- SpendGate: an onchain version of the freeze mechanism (currently local-state based) as a small Arc smart contract
- Demo video and deck for final submission

## Setup
1. npm install
2. Copy .env.example to .env and fill in your own Circle API key
3. Run: npx tsx --env-file=.env demo/unfreeze.ts
4. Run: npx tsx --env-file=.env demo/simulate-runaway.ts
5. Run: npx tsx --env-file=.env demo/guardian-check.ts
6. Run: npx tsx --env-file=.env demo/simulate-runaway.ts again - this time it gets blocked

## Using core/ in your own project
\```
import { guarded } from "./core/guard";
import { checkVelocity } from "./core/detect";

const send = guarded("my-agent-id", async (amount) => {
  // your own payment logic here
});

// periodically, or after each payment:
checkVelocity("my-agent-id", 60000, 5); // freeze if 5+ payments in 60s
\```
