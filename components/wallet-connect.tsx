"use client"

import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useEffect, useState } from "react"

interface WalletConnectProps {
  onConnect: () => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const { setVisible } = useWalletModal()
  const { connected, connecting, wallet } = useWallet()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (connected && isHydrated) {
      onConnect()
    }
  }, [connected, isHydrated, onConnect])

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary"></div>
            <CardTitle className="text-3xl">Solana Perpetual DEX</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Spinner className="h-6 w-6" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary"></div>
          <CardTitle className="text-3xl">Solana Perpetual DEX</CardTitle>
          <CardDescription>Connect your wallet to start trading</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button onClick={() => setVisible(true)} disabled={connecting} className="w-full" size="lg">
            {connecting ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Connecting...
              </div>
            ) : connected ? (
              `Connected (${wallet?.adapter.name})`
            ) : (
              "Connect Wallet"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">By connecting, you agree to our Terms of Service</p>
        </CardContent>
      </Card>
    </div>
  )
}
