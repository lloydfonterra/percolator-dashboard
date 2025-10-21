# Push Dashboard to GitHub

Follow these steps to push your code to GitHub:

## Step 1: Create a Personal Access Token

1. Go to GitHub settings: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `percolator-dashboard-push`
4. Select scopes: 
   - `repo` (full control)
   - `read:user`
5. Click "Generate token"
6. **Copy the token** (you'll only see it once!)

## Step 2: Use the Token to Push

Run this in PowerShell (replace `YOUR_TOKEN` with the token you just created):

```powershell
cd C:\Users\Rey\Desktop\perp
$token = "YOUR_TOKEN"
$url = "https://lloydfonterra:$token@github.com/lloydfonterra/percolator-dashboard.git"
git remote set-url origin $url
git push -u origin master
```

## Step 3: Verify

After pushing, check your repo on GitHub:
https://github.com/lloydfonterra/percolator-dashboard

You should see your code! ✅

---

## 🚀 Next Steps

Once your code is on GitHub, deploy to Vercel:

1. Go to https://vercel.com
2. Click "Add New Project"
3. Select `percolator-dashboard`
4. Add these environment variables:
   ```
   NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
   NEXT_PUBLIC_ROUTER_PROGRAM=RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
   NEXT_PUBLIC_SLAB_PROGRAM=SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
   NEXT_PUBLIC_COMMITMENT=confirmed
   ```
5. Click "Deploy"

Your dashboard will be live in 2-3 minutes! 🎉
