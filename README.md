# EscrowDesk — Web3 engineer home task

On-chain bounty escrow + Next.js dashboard UI. Candidates implement `QuestEscrow.sol`, wire wallet hooks, and verify the flow at **http://localhost:3000**.

This repo is the **alt-UI variant** of the ChainQuest assessment (sibling to `smart-contract-engineer-role`). The contract, tests, routes, and candidate work are the same; only the presentation layer differs.

**Candidate instructions:** [assessment/instructions.md](assessment/instructions.md)

---

## UI overview (EscrowDesk)

| Area | Description |
| --- | --- |
| Layout | Fixed **left sidebar** (nav + wallet at bottom), not a top header |
| Home `/` | Dashboard with stat cards + recent-quests table |
| Board `/quests` | Table view with status filter chips |
| Create `/quests/create` | Two-column form with sticky summary panel |
| Detail `/quests/[id]` | Lifecycle stepper + action panel on the right |
| Theme | Light neutral surface, teal accent, DM Sans font |

---

## Setup (maintainers)

```bash
npm install
npm install --prefix contracts
```

Verify reference implementation:

```bash
QUEST_ASSESSMENT_SOLUTION=1 npm run test
```

---

## Run locally

```bash
# Terminal 1
npm run contracts:node

# Terminal 2 (after candidate implements contract, or DEPLOY_REFERENCE=1 for demo)
npm run contracts:deploy
# copy addresses into .env.local from .env.example

# Terminal 3
npm run dev
```

Open http://localhost:3000

---

## Structure

| Path | Purpose |
| --- | --- |
| `contracts/contracts/QuestEscrow.sol` | Candidate implements this |
| `contracts/contracts/reference/` | Reference solution (for `QUEST_ASSESSMENT_SOLUTION=1` tests) |
| `contracts/test/` | Assessment tests |
| `app/` | Next.js UI (EscrowDesk dashboard) |
| `components/layout/` | Sidebar + app shell |
| `components/quest/` | Table, stepper, status badges |
| `lib/hooks/useQuestEscrow.ts` | Candidate implements wallet writes |

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run test` | Run assessment tests |
| `npm run dev` | Start UI |
| `npm run contracts:node` | Local Hardhat chain |
| `npm run contracts:deploy` | Deploy `QuestEscrow` to localhost |

Use `DEPLOY_REFERENCE=1 npm run contracts:deploy` to deploy the reference contract for UI demos.

---

## License

MIT
