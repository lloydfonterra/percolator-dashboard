# Deploy Percolator Dashboard to Vercel

Your perpetual DEX dashboard is ready for production deployment! Follow these steps to go live.

---

## 🚀 **Quick Deploy (5 minutes)**

### **Step 1: Deploy Programs to Devnet**

Open PowerShell in `C:\Users\Rey\Desktop\percolator-fork`:

```powershell
powershell -ExecutionPolicy Bypass -File deploy-devnet.ps1
```

**This will:**
- ✅ Configure Solana CLI for devnet
- ✅ Check your balance
- ✅ Airdrop SOL if needed
- ✅ Build programs
- ✅ Deploy Router program
- ✅ Deploy Slab program
- ✅ Show you the .env values to use

**Save the output!** You'll need those values.

---

### **Step 2: Create .env.local**

In `C:\Users\Rey\Desktop\perp\`, create a new file `.env.local`:

```bash
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_ROUTER_PROGRAM=RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
NEXT_PUBLIC_SLAB_PROGRAM=SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
NEXT_PUBLIC_COMMITMENT=confirmed
```

---

### **Step 3: Push Dashboard to GitHub**

```powershell
cd C:\Users\Rey\Desktop\perp

# Initialize git
git init
git add .
git commit -m "Percolator perpetual DEX dashboard"
git branch -M main

# Add your GitHub repo (create it first on github.com)
git remote add origin https://github.com/YOUR_USERNAME/percolator-dashboard.git
git push -u origin main
```

---

### **Step 4: Deploy to Vercel**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select your `percolator-dashboard` repository
5. Click "Import"
6. In **Environment Variables**, add:
   ```
   NEXT_PUBLIC_RPC_ENDPOINT = https://api.devnet.solana.com
   NEXT_PUBLIC_ROUTER_PROGRAM = RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
   NEXT_PUBLIC_SLAB_PROGRAM = SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
   NEXT_PUBLIC_COMMITMENT = confirmed
   ```
7. Click "Deploy"

**Done!** Your dashboard is now live! 🎉

---

## 📋 **What You Now Have**

After deployment:

| Component | Location | Status |
|-----------|----------|--------|
| **Router Program** | Solana Devnet | ✅ Deployed |
| **Slab Program** | Solana Devnet | ✅ Deployed |
| **Dashboard** | Vercel | ✅ Live |
| **RPC Connection** | Devnet | ✅ Connected |
| **Wallet Integration** | Built-in | ✅ Ready |

---

## 🎯 **Your Live Dashboard URL**

After Vercel deployment, you'll get a URL like:
```
https://percolator-dashboard.vercel.app
```

**Share this link!** Anyone can now:
- Connect their Solana wallet
- Trade on your perpetual DEX
- See real positions & margin
- Experience capital efficiency!

---

## ⚙️ **Dashboard Features**

✅ **Wallet Connection** - Connect Phantom, Magic Eden, etc.  
✅ **Order Form** - Place long/short positions  
✅ **Portfolio Tracking** - Real positions from on-chain  
✅ **Market Data** - Live Solana devnet prices  
✅ **Position Management** - Modify/close positions  
✅ **Risk Dashboard** - Margin, liquidation prices  

---

## 🔄 **Continuous Deployment**

From now on:
1. Make changes locally
2. Commit to GitHub: `git push origin main`
3. Vercel automatically redeploys in ~2 minutes
4. Your live dashboard updates instantly!

---

## 🧪 **Testing on Live Dashboard**

After deployment:
1. Visit your Vercel URL
2. Connect wallet (get testnet SOL: `solana airdrop 1`)
3. Place a trade through the order form
4. Watch position appear in portfolio
5. Check margin & liquidation prices

---

## 🚨 **Important Notes**

- Devnet is for **testing only** - funds are worthless
- Mainnet deployment: Use `--url mainnet-beta` (requires real SOL)
- Programs are **already deployed** to devnet with the script
- Dashboard is **production-ready** on Vercel

---

## 📚 **Next Steps**

1. ✅ Deploy programs to devnet (run script)
2. ✅ Create .env.local
3. ✅ Push to GitHub
4. ✅ Deploy to Vercel
5. 🎯 Test on live dashboard
6. 📱 Share with friends & users!

---

## 💡 **Pro Tips**

- **Want to test locally first?** Run `npm run dev` in perp directory
- **Custom domain?** Add to Vercel settings
- **Multiple environments?** Create separate Vercel projects for staging/production
- **Monitor logs?** Vercel dashboard shows all deployments & errors

---

**Your perpetual DEX is now live on the internet!** 🌍🚀

Enjoy your Percolator DEX! Questions? Check PERCOLATOR_INTEGRATION.md
