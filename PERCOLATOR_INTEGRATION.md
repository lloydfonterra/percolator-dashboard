# Percolator Integration Guide - Next.js Dashboard

Integrate your Percolator perpetual DEX on-chain programs with the Next.js dashboard for a complete trading interface.

---

## 🎯 Overview

**Dashboard Location**: `C:\Users\Rey\Desktop\perp\`  
**Programs Location**: `C:\Users\Rey\Desktop\percolator-fork\`

### What's Already Done
- ✅ Solana wallet integration (`wallet-provider.tsx`)
- ✅ Web3.js setup in dependencies
- ✅ UI components (order form, portfolio, charts)
- ✅ Mock data hooks (trading, portfolio, market)

### What We're Building
- 🚧 Connect hooks to Percolator programs
- 🚧 Replace mock data with on-chain reads
- 🚧 Build transaction instruction generators
- 🚧 Display real portfolio state

---

## 📋 Integration Steps

### Step 1: Setup Environment Variables

Create `.env.local` in `C:\Users\Rey\Desktop\perp\`:

```bash
# Devnet (for testing)
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_COMMITMENT=confirmed

# Or localhost (if validator running)
# NEXT_PUBLIC_RPC_ENDPOINT=http://localhost:8899
# NEXT_PUBLIC_COMMITMENT=confirmed

# Program IDs
NEXT_PUBLIC_ROUTER_PROGRAM=RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
NEXT_PUBLIC_SLAB_PROGRAM=SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
```

### Step 2: Update use-trading.ts

Replace mock order submission with Percolator program calls:

```typescript
// Import new hook
import { usePercolatorTrading } from "./use-percolator-trading"

// In components, use:
const { submitOrder, orders } = usePercolatorTrading()

// Instead of:
// const { submitOrder, orders } = useTrading()
```

### Step 3: Update use-portfolio.ts

Read real portfolio data from Router program:

```typescript
// Fetch from Router program instead of mock data
const fetchPortfolio = async (userAddress: string) => {
  const connection = new Connection(RPC_ENDPOINT)
  const portfolio = await connection.getAccountInfo(
    derivePortfolioAddress(userAddress)
  )
  // Parse and return portfolio state
}
```

### Step 4: Create Instruction Builders

Create `lib/percolator-instructions.ts`:

```typescript
import { TransactionInstruction, PublicKey } from "@solana/web3.js"

// Build commit_fill instruction
export function buildCommitFillInstruction(
  slabProgram: PublicKey,
  userAddress: PublicKey,
  side: "buy" | "sell",
  qty: number,
  limitPrice: number
): TransactionInstruction {
  // Serialize instruction data and build instruction
  return new TransactionInstruction({
    programId: slabProgram,
    keys: [
      { pubkey: userAddress, isSigner: true, isWritable: true },
      // ... additional keys
    ],
    data: Buffer.from([...])
  })
}
```

---

## 🔄 Data Flow

```
User Action (Dashboard)
    ↓
Form Input (order-form.tsx)
    ↓
usePercolatorTrading() Hook
    ↓
Build Instruction (percolator-instructions.ts)
    ↓
Send Transaction (wallet)
    ↓
Slab Program Execution
    ↓
Update On-Chain State
    ↓
Read Back State
    ↓
Update UI
```

---

## 🎯 Key Components to Update

### 1. `components/order-form.tsx`
- Replace `useTrading()` with `usePercolatorTrading()`
- Build real instructions instead of mocking

### 2. `components/portfolio-stats.tsx`
- Read equity from Router program
- Display real margin requirements

### 3. `components/position-manager.tsx`
- Show real positions from on-chain portfolio
- Display accurate liquidation prices

### 4. `hooks/use-market-data.ts`
- Option 1: Query oracle for marks
- Option 2: Use fixed prices for MVP

---

## 📝 Example: Complete Flow

```typescript
// 1. User fills form
const handleSubmit = async (formData: OrderFormData) => {
  // 2. Build instruction
  const instruction = buildCommitFillInstruction(
    slabProgramId,
    userAddress,
    formData.positionType,
    parseFloat(formData.size),
    parseFloat(formData.price)
  )

  // 3. Create and send transaction
  const transaction = new Transaction().add(instruction)
  const signature = await sendTransaction(transaction, connection)

  // 4. Wait for confirmation
  await connection.confirmTransaction(signature)

  // 5. Fetch updated portfolio
  const portfolio = await fetchPortfolio(userAddress)
  
  // 6. Update UI
  setPositions(portfolio.positions)
}
```

---

## 🚀 Quick Start

### Option A: Use Mock Data (Now) → Real Data (Later)

```typescript
// Keep current mock hooks
// Add conditional logic:
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK === "true"

if (useMockData) {
  return useTrading() // mock
} else {
  return usePercolatorTrading() // real
}
```

### Option B: Switch Now to Real Data

1. Deploy programs to devnet
2. Update `.env.local` with devnet RPC
3. Replace all hooks with Percolator versions
4. Test trading flow

---

## 🧪 Testing Checklist

- [ ] Wallet connects
- [ ] Can fetch portfolio from Router
- [ ] Can build commit_fill instruction
- [ ] Transaction sends successfully
- [ ] Portfolio updates after trade
- [ ] UI reflects new state
- [ ] Error handling works
- [ ] Liquidation prices calculated correctly

---

## 🔗 Program IDs

**Router**: `RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr`  
**Slab**: `SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk`

---

## 📚 Next Steps

1. **Deploy to Devnet** (easiest testing)
2. **Create instruction builders** (percolator-instructions.ts)
3. **Update portfolio hook** (read from Router)
4. **Update trading hook** (send real transactions)
5. **Test end-to-end flow**
6. **Connect liquidation logic**

---

**Status**: Ready for dashboard integration  
**Estimated Time**: 2-4 hours to complete  
**Complexity**: Medium (instruction serialization is trickiest part)
