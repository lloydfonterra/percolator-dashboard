# Deploy Percolator to Solana Devnet

This guide walks you through deploying the Percolator Router and Slab programs to Solana devnet and connecting your dashboard.

## 📋 Prerequisites

- Solana CLI installed
- Percolator programs built locally
- Phantom wallet with devnet SOL (free airdrop available)
- Dashboard deployed on Vercel

---

## 🚀 Step 1: Deploy Programs to Devnet

### Option A: Automated Script (Recommended)

Use the provided PowerShell script to automate the deployment:

```powershell
cd C:\Users\Rey\Desktop\percolator-fork
powershell -ExecutionPolicy Bypass -File deploy-devnet.ps1
```

This script will:
1. ✅ Configure Solana CLI for devnet
2. ✅ Check/airdrop SOL to your account
3. ✅ Build the programs
4. ✅ Deploy to devnet
5. ✅ Output program IDs and keypair info

**Program IDs Generated:**
- Router: `RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr` (or your custom ID)
- Slab: `SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk` (or your custom ID)

### Option B: Manual Deployment

```powershell
# 1. Configure CLI for devnet
solana config set --url https://api.devnet.solana.com

# 2. Create keypair (if you don't have one)
solana-keygen new -o ~/my-keypair.json

# 3. Airdrop SOL
solana airdrop 2

# 4. Build programs
cd C:\Users\Rey\Desktop\percolator-fork
cargo build-sbf

# 5. Deploy Router
solana program deploy target/sbf-solana-solana/release/percolator_router.so

# 6. Deploy Slab
solana program deploy target/sbf-solana-solana/release/percolator_slab.so

# 7. Verify deployment
solana program show <ROUTER_PROGRAM_ID>
solana program show <SLAB_PROGRAM_ID>
```

---

## 🔗 Step 2: Update Dashboard Environment Variables

Update your `.env.local` in the dashboard project:

```env
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_ROUTER_PROGRAM=YOUR_ROUTER_PROGRAM_ID
NEXT_PUBLIC_SLAB_PROGRAM=YOUR_SLAB_PROGRAM_ID
NEXT_PUBLIC_COMMITMENT=confirmed
NEXT_PUBLIC_NETWORK=devnet
```

Also update Vercel environment variables:
1. Go to https://vercel.com/dashboard
2. Select `percolator-dashboard`
3. Go to Settings → Environment Variables
4. Update with your devnet program IDs

---

## 💰 Step 3: Fund Your Trading Account

### Get Devnet SOL

```powershell
# Check balance
solana balance

# Airdrop SOL (max 5 SOL per request, can repeat)
solana airdrop 5
```

### Use Phantom Wallet

1. Open Phantom wallet
2. Click Settings → Network → Select "Devnet"
3. Copy your wallet address
4. Visit https://faucet.solana.com
5. Paste address, get 2 SOL
6. Repeat as needed

---

## 🎯 Step 4: Initialize Collateral Account

Before trading, initialize your collateral account in the Router:

```rust
// Call this instruction to set up your trading account
// Program: Router (RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr)
// Instruction: Initialize

// This creates a Vault PDA for your wallet
```

The dashboard will handle this when you first connect your wallet (pending implementation).

---

## 📊 Step 5: Test Trading Flow

### Local Testing

```bash
# Run integration tests (if available)
cd C:\Users\Rey\Desktop\percolator-fork
cargo test --test integration -- --nocapture
```

### Manual Testing via Dashboard

1. ✅ Connect Phantom wallet to devnet
2. ✅ Deposit collateral (USDC or SOL)
3. ✅ Place a test order
4. ✅ Check order status
5. ✅ Monitor PnL

---

## 🔍 Verification Commands

Check program status and accounts:

```powershell
# Verify programs are deployed
solana program show RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
solana program show SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk

# View your account info
solana account <YOUR_WALLET_ADDRESS>

# Check recent transactions
solana transactions
```

---

## 🐛 Troubleshooting

### "Program not found"
- Verify program IDs are correct
- Check program is deployed to correct network
- Run deploy script again

### "Insufficient funds"
- Request more devnet SOL
- Use multiple airdrop requests
- Check account balance: `solana balance`

### "Instruction execution failed"
- Check account initialization
- Verify collateral is deposited
- Review program logs: `solana logs <PROGRAM_ID>`

### "Wallet not recognized"
- Ensure Phantom is set to Devnet
- Clear browser cache and reconnect
- Check Vercel env vars are updated

---

## 📚 Next: Real Trading Functionality

Once programs are deployed, implement:

1. **Deposit/Withdraw** - Transfer USDC to Vault
2. **Commit Fill** - Submit orders to Slab
3. **Portfolio Tracking** - Real-time PnL calculation
4. **Cross-Slab Routing** - Multi-market orders via Router

See `TRADING_IMPLEMENTATION.md` for code examples.

---

## 🚀 Common Workflow

```
1. Deploy programs to devnet ✅
   ↓
2. Update dashboard env vars ✅
   ↓
3. Fund devnet wallet ✅
   ↓
4. Connect dashboard to wallet ✅
   ↓
5. Deposit collateral → ✅
   ↓
6. Place order → ✅
   ↓
7. Monitor portfolio → ✅
```

---

## 📖 Resources

- [Solana Devnet Faucet](https://faucet.solana.com)
- [Percolator Docs](https://github.com/aeyakovenko/percolator)
- [Solana CLI Docs](https://docs.solana.com/cli)
- [Phantom Wallet](https://phantom.app)

---

**Happy trading! 🚀**
