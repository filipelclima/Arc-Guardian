import { readFileSync, writeFileSync, existsSync } from "node:fs";

const STATE_FILE = "guardian-state.json";

function readState() {
  if (!existsSync(STATE_FILE)) return { frozen: {} };
  return JSON.parse(readFileSync(STATE_FILE, "utf8"));
}

function writeState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function isFrozen(walletId) {
  const state = readState();
  return state.frozen[walletId] === true;
}

export function freeze(walletId) {
  const state = readState();
  state.frozen[walletId] = true;
  writeState(state);
}

export function unfreeze(walletId) {
  const state = readState();
  state.frozen[walletId] = false;
  writeState(state);
}
