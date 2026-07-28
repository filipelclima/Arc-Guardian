import { pay } from "./pay";

async function main() {
  console.log("Simulating a runaway agent - firing rapid payments...");
  for (let i = 1; i <= 6; i++) {
    console.log("--- Attempt " + i + " ---");
    const result = await pay(0.01);
    if (result.blocked) {
      console.log("Runaway stopped by Guardian at attempt " + i);
      break;
    }
    await new Promise(function(r) { setTimeout(r, 500); });
  }
}

main().catch(function(err) { console.log("ERROR:", err.message); });
