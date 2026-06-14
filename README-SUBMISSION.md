# EscrowDesk — Submission

**Name:** Waqar
**Email:** wiki.mir@gmail.com
**Contract address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`
**GitHub repo:** (https://github.com/waqarmm/Web3-Developer-Skills-Test)

---

## How to run

```bash
# 1. Install dependencies
npm install
npm install --prefix contracts

# 2. Run contract tests (all 9 scenarios pass)
npm run test

# 3. Start local Hardhat node
npm run contracts:node

# 4. Deploy contracts (in a second terminal)
npm run contracts:deploy

# 5. Copy the output into .env.local at repo root:
#    NEXT_PUBLIC_QUEST_ESCROW_ADDRESS=0x...
#    NEXT_PUBLIC_MOCK_USDC_ADDRESS=0x...
#    NEXT_PUBLIC_CHAIN_ID=31337
#    NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

# 6. Start the frontend (in a third terminal)
npm run dev
# Open http://localhost:3000
```

### MetaMask setup

1. Add a custom network: RPC `http://127.0.0.1:8545`, Chain ID `31337`, Symbol `ETH`
2. Import Hardhat Account #0 (poster): `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
3. Import Hardhat Account #1 (worker): `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

---

## What was implemented

### Part A — QuestEscrow.sol

Full implementation of the escrow contract with:

- `createQuest` — escrows ETH or ERC20 tokens for a new quest
- `acceptQuest` — worker picks up an open quest before the deadline
- `submitWork` — worker submits a deliverable URI, starts review clock
- `approveAndPay` — poster approves and releases 97% to worker (3% fee)
- `claimTimeoutPayout` — worker claims if poster doesn't review in time
- `cancelQuest` — poster cancels an open quest, full refund
- `refundPoster` — poster reclaims funds after review window (implicit rejection)
- `withdrawFees` — owner withdraws accumulated platform fees
- `getQuest` / `getAvailableFees` — view functions

All 9 test scenarios (A–I) pass.

### Part B — Wallet hooks (useQuestEscrow.ts)

- `useCreateQuest()` — sends `createQuest` transaction with ETH value, waits for confirmation
- `useQuestActions(questId)` — returns `accept`, `submit`, `approve`, `claimTimeout`, `cancel`, `refund` functions, each calling the corresponding contract method and waiting for the receipt

### Part C — UI verification

See screenshots in the `assets/` folder:

- `assets/board.png` — quest board table with wallet connected
- `assets/detail-stepper.png` — quest detail page with lifecycle stepper and action panel
