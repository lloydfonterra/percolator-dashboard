# Deploy Percolator Programs - Manual Steps

## ⚠️ Important: You MUST Run as Administrator

The `cargo build-sbf` command requires admin privileges.

---

## 🚀 Step-by-Step Instructions

### 1. **Open PowerShell as Administrator**

- Press: **Win + X**
- Click: **Terminal (Admin)** or **Windows PowerShell (Admin)**
- Click: **Yes** when prompted

You should see:
```
PS C:\Users\Rey>  (or similar admin path)
```

### 2. **Run These Commands (Copy & Paste)**

```powershell
$env:HOME="$env:USERPROFILE"
cd C:\Users\Rey\Desktop\percolator-fork
cargo build-sbf
```

**⏳ Wait 3-5 minutes** for the build to complete.

You should see:
```
Finished `sbf-release` profile [optimized] target(s) in X.XXs
```

### 3. **Deploy Router Program**

```powershell
solana program deploy target/sbf-solana-solana/release/percolator_router.so
```

Look for output like:
```
Program deployed to: RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
```

### 4. **Deploy Slab Program**

```powershell
solana program deploy target/sbf-solana-solana/release/percolator_slab.so
```

Look for output like:
```
Program deployed to: SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
```

### 5. **Verify Both Programs**

```powershell
solana program show RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
solana program show SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
```

Both should show program details ✅

---

## ✅ Success Checklist

- [ ] Opened PowerShell **as Administrator**
- [ ] Ran all commands without errors
- [ ] Both programs show in `solana program show`
- [ ] Program IDs match or are noted if different

---

## 🎯 If You Get Errors

### "A required privilege is not held by the client"
- **Solution**: You're NOT running as admin
- **Fix**: Close PowerShell, right-click it, select "Run as administrator"

### "cargo build-sbf not found"
- **Solution**: Solana platform tools not installed
- **Fix**: Run: `curl https://release.solana.com/v1.18.0/install | sh`

### "solana config get" shows wrong network
- **Solution**: Not on devnet
- **Fix**: Run: `solana config set --url https://api.devnet.solana.com`

---

## 📊 Current Status

```
✅ Dashboard - LIVE at https://percolator-dashboard.vercel.app
✅ Account - Funded with 5 SOL
✅ Network - Connected to devnet
⏳ Programs - Ready to deploy (this step)
```

---

## 🎉 After Deployment

Once both programs deploy successfully:

1. **Copy the program IDs** from the output
2. **Check if they match** the default IDs in `.env.local`
3. **If different**, update `.env.local` with new IDs
4. **Visit dashboard** - Connect Phantom wallet
5. **Start trading!** 🚀

---

**Ready? Open admin PowerShell and follow the commands above!** 💪
