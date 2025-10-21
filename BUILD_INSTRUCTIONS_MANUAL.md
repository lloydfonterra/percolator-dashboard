# 🚀 Percolator Build - MANUAL INSTRUCTIONS

**Status**: Ready for Manual Execution  
**Date**: October 21, 2025

---

## ⚠️ Important Note

The automated build encountered toolchain installation issues. The solution is to execute these commands **manually and directly** in PowerShell as Administrator.

**Everything below is copy-paste ready!**

---

## 📋 Step 1: Prepare Environment

Open **PowerShell as Administrator** and run:

```powershell
$env:HOME = "$env:USERPROFILE"
Write-Host "HOME set to: $env:HOME"
cd C:\Users\Rey\Desktop\percolator-fork
Write-Host "Working directory: $(Get-Location)"
```

---

## 📋 Step 2: Verify Prerequisites

Run these to verify everything is installed:

```powershell
rustc --version
cargo --version
solana --version
```

**Expected output:**
```
rustc 1.90.0
cargo 1.90.0
solana-cli 1.18.x
```

---

## 🧹 Step 3: Clean Previous Builds

```powershell
cargo clean
Write-Host "Clean complete"
```

---

## 🏗️ Step 4: Regenerate Lock File

```powershell
cargo update
Write-Host "Lock file updated"
```

---

## 🔨 Step 5: BUILD ALL PROGRAMS

This is the critical step. Run:

```powershell
Write-Host "Starting Solana program build..." -ForegroundColor Cyan
cargo build-sbf
Write-Host "Build complete!" -ForegroundColor Green
```

**This will take 5-10 minutes. Let it run completely.**

**Expected output at the end:**
```
   Compiling percolator_common v0.1.0
   Compiling percolator_router v0.1.0
   Compiling percolator_slab v0.1.0
    Finished sbf-solana-solana/debug profile [unoptimized + debuginfo] target(s) in 120s
```

---

## ✅ Step 6: Verify Build Success

After the build completes, verify the .so files exist:

```powershell
$routerSo = "C:\Users\Rey\Desktop\percolator-fork\target\sbf-solana-solana\debug\percolator_router.so"
$slabSo = "C:\Users\Rey\Desktop\percolator-fork\target\sbf-solana-solana\debug\percolator_slab.so"

if (Test-Path $routerSo) {
    Write-Host "✅ Router .so exists: $(Get-Item $routerSo | % { "{0:N2} KB" -f ($_.Length/1KB) })" -ForegroundColor Green
} else {
    Write-Host "❌ Router .so NOT found!" -ForegroundColor Red
}

if (Test-Path $slabSo) {
    Write-Host "✅ Slab .so exists: $(Get-Item $slabSo | % { "{0:N2} KB" -f ($_.Length/1KB) })" -ForegroundColor Green
} else {
    Write-Host "❌ Slab .so NOT found!" -ForegroundColor Red
}
```

---

## 🚀 Step 7: Start Local Validator

**IMPORTANT**: Open a **NEW PowerShell window as Administrator**

In the NEW window, run:

```powershell
$env:HOME = "$env:USERPROFILE"
Write-Host "Starting local Solana validator..." -ForegroundColor Cyan
solana-test-validator
```

**Leave this window OPEN and RUNNING!** You'll see:
```
Validator identity: ABC...XYZ
Ledger location: C:\Users\Rey\.local\share\solana\test-ledger
Log: C:\Users\Rey\.local\share\solana\test-ledger\validator.log
⠈ Initializing...
```

---

## 📋 Step 8: Configure CLI (Back in ORIGINAL window)

Go back to your ORIGINAL PowerShell window and run:

```powershell
solana config set --url http://localhost:8899
solana config get
```

**Expected output:**
```
Config File: C:\Users\Rey\.config\solana\cli\config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/
Keypair Path: C:\Users\Rey\.config\solana\cli\id.json
Commitment: confirmed
```

---

## 💰 Step 9: Airdrop SOL

```powershell
$address = solana address
Write-Host "Your address: $address" -ForegroundColor Cyan

Write-Host "Airdropping 2 SOL..." -ForegroundColor Cyan
solana airdrop 2

Start-Sleep -Seconds 3

$balance = solana balance
Write-Host "Your balance: $balance" -ForegroundColor Green
```

---

## 🚀 Step 10: Deploy Router Program

```powershell
$routerFile = "C:\Users\Rey\Desktop\percolator-fork\target\sbf-solana-solana\debug\percolator_router.so"

if (Test-Path $routerFile) {
    Write-Host "Deploying Router program..." -ForegroundColor Cyan
    $routerDeploy = solana program deploy $routerFile
    Write-Host $routerDeploy -ForegroundColor Green
    
    # Extract Program ID
    $routerId = $routerDeploy | Select-String "Program Id: (\S+)" | % { $_.Matches[0].Groups[1].Value }
    Write-Host "✅ Router Program ID: $routerId" -ForegroundColor Green
} else {
    Write-Host "❌ Router .so file not found!" -ForegroundColor Red
}
```

---

## 🚀 Step 11: Deploy Slab Program

```powershell
$slabFile = "C:\Users\Rey\Desktop\percolator-fork\target\sbf-solana-solana\debug\percolator_slab.so"

if (Test-Path $slabFile) {
    Write-Host "Deploying Slab program..." -ForegroundColor Cyan
    $slabDeploy = solana program deploy $slabFile
    Write-Host $slabDeploy -ForegroundColor Green
    
    # Extract Program ID
    $slabId = $slabDeploy | Select-String "Program Id: (\S+)" | % { $_.Matches[0].Groups[1].Value }
    Write-Host "✅ Slab Program ID: $slabId" -ForegroundColor Green
} else {
    Write-Host "❌ Slab .so file not found!" -ForegroundColor Red
}
```

---

## ✅ Step 12: Verify Deployment

```powershell
Write-Host "Verifying Router program..." -ForegroundColor Cyan
solana program show RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr

Write-Host "`nVerifying Slab program..." -ForegroundColor Cyan
solana program show SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
```

**Expected output for each:**
```
Program Id: RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: ...
Authority: ...
```

---

## 🎉 SUCCESS!

If you see Program IDs and they verify successfully, you're done! 

**You have successfully:**
- ✅ Built Router program
- ✅ Built Slab program  
- ✅ Started local validator
- ✅ Deployed both programs
- ✅ Verified deployments

---

## 💾 Save Your Program IDs

**Write these down or save them somewhere safe:**

```
Router Program ID: RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
Slab Program ID: SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
RPC Endpoint: http://localhost:8899
```

---

## 🚀 Next Phase

Once deployment is complete:

1. **Update Dashboard .env.local**:
   ```env
   NEXT_PUBLIC_RPC_ENDPOINT=http://localhost:8899
   NEXT_PUBLIC_ROUTER_PROGRAM=RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
   NEXT_PUBLIC_SLAB_PROGRAM=SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
   ```

2. **Connect Dashboard to Local Programs**

3. **Run Unit Tests**:
   ```powershell
   cd C:\Users\Rey\Desktop\percolator-fork
   cargo test --lib
   ```

---

## 🐛 Troubleshooting

**"Build still running?"**
- The build can take 5-15 minutes on first run
- Wait patiently, it compiles many dependencies

**"Validator won't start?"**
- Make sure port 8899 is free
- Try: `netstat -ano | findstr :8899`

**"Deployment fails?"**
- Check validator is running in other window
- Check you have SOL balance: `solana balance`

**"Programs don't verify?"**
- Wait 30 seconds and try again
- Check RPC is correct: `solana config get`

---

## 📚 Full Documentation

See `BUILD_AND_DEPLOY_GUIDE.md` in the Percolator fork for complete details and troubleshooting.

---

**Follow these steps exactly and you'll have Percolator running locally!** 🎯
