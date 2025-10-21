# Percolator DEX Dashboard

A modern, high-performance perpetual futures DEX frontend built with Next.js and React, designed to work with the Percolator protocol on Solana.

## 🚀 Features

- **Real-time Market Data**: Live price feeds and market statistics
- **Portfolio Management**: Track positions, collateral, and PnL
- **Advanced Trading Interface**: Market and limit orders with leverage
- **Liquidity Pools**: Monitor and provide liquidity
- **Wallet Integration**: Seamless Phantom and other Solana wallets
- **Responsive Design**: Beautiful UI optimized for desktop and mobile

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Solana CLI
- Phantom wallet or other Solana wallet
- Access to a Solana RPC endpoint (devnet or mainnet-beta)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/lloydfonterra/percolator-dashboard.git
cd percolator-dashboard

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Configure your RPC endpoint and program IDs in .env.local
# NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
# NEXT_PUBLIC_ROUTER_PROGRAM=RoutR1VdCpHqj89WEMJhb6TkGT9cPfr1rVjhM3e2YQr
# NEXT_PUBLIC_SLAB_PROGRAM=SLabZ6PsDLh2X6HzEoqxFDMqCVcJXDKCNEYuPzUvGPk
```

## 🏃 Running Locally

```bash
# Development server
pnpm dev

# Open http://localhost:3000 in your browser
```

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables for RPC endpoints and program IDs
4. Deploy!

```bash
git add .
git commit -m "Percolator DEX dashboard"
git push origin master
```

## 📚 Project Structure

```
perp/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── dashboard.tsx    # Main dashboard
│   ├── trading-interface.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
├── providers/          # React context providers
├── public/             # Static assets
└── styles/             # Global styles
```

## 🔗 Integration Points

- **Percolator Router Program**: Global coordinator for collateral and cross-slab routing
- **Percolator Slab Program**: Per-LP perpetual exchange engine
- **Solana Web3.js**: Blockchain interactions
- **Wallet Adapter**: Solana wallet integration

## 📖 Documentation

For more information about Percolator protocol, see:
- [Percolator Repository](https://github.com/aeyakovenko/percolator)
- [Solana Documentation](https://docs.solana.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit PRs or open issues.

## 📄 License

MIT License - see LICENSE file for details

## 🚀 Support

For issues or questions:
1. Check existing GitHub issues
2. Review Percolator documentation
3. Ask on Solana Discord

---

**Built with ❤️ for the Solana community**
