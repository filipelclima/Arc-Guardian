# Arc Guardian

Autonomous Guardian Agent that monitors USDC spending across AI agent wallets on Arc, and freezes anomalous behavior in real time - no human in the loop.

## What works right now
- Circle Developer-Controlled Wallets set up on Arc Testnet
- Buyer and Seller agent wallets created and funded
- Working end-to-end USDC payment between agents (scripts/transfer.ts)
- Balance checking (scripts/check-balance.ts)

## Coming next
- SpendGate smart contract giving Guardian onchain authority to freeze an agent
- Anomaly detection logic (spend velocity / threshold rules)
- Demo: simulate a runaway agent, show Guardian freeze it mid-loop

## Setup
1. npm install
2. Copy .env.example to .env and fill in your own Circle API key
3. Run the scripts in the scripts folder in order: register-entity-secret, create-wallets, check-balance, transfer
