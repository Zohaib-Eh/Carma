"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, Loader2, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useWallet } from "@/components/ConcordiumProvider"
import { WalletConnectorButton, BROWSER_WALLET } from "@/components/WalletConnector"

export default function ConnectWalletPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()
  const walletProps = useWallet()

  const handleWalletConnect = () => {
    setIsConnecting(true)
  }

  const handleWalletConnected = () => {
    setIsConnecting(false)
    setIsConnected(true)

    // Redirect to verification after wallet connection
    setTimeout(() => {
      router.push("/verify")
    }, 1500)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 backdrop-blur-md bg-background/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/50">
                <span className="text-primary-foreground font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Carma
              </span>
            </div>
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <Card className="p-8 bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30"
                animate={isConnecting ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: isConnecting ? Number.POSITIVE_INFINITY : 0 }}
              >
                {isConnected ? (
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                ) : (
                  <Wallet className="w-12 h-12 text-primary" />
                )}
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                Connect Your Wallet
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Connect your blockchain wallet to securely store your verification and booking information
              </p>
            </div>

            {isConnected ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="p-6 bg-primary/10 border border-primary/30 rounded-xl">
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Wallet Connected!</h3>
                  <p className="text-muted-foreground">Redirecting to verification...</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Secure Storage</p>
                      <p className="text-sm text-muted-foreground">Your bookings are stored on the blockchain</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">One-Time Verification</p>
                      <p className="text-sm text-muted-foreground">Verify your license once, use everywhere</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Privacy First</p>
                      <p className="text-sm text-muted-foreground">Your data is encrypted and secure</p>
                    </div>
                  </div>
                </div>

                <WalletConnectorButton
                  {...walletProps}
                  connectorType={BROWSER_WALLET}
                  connectorName="Browser Wallet"
                  onConnected={handleWalletConnected}
                  className="cursor-pointer"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleWalletConnect}
                      disabled={isConnecting}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground h-14 text-base font-semibold shadow-lg shadow-primary/30 transition-all"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Connecting Wallet...
                        </>
                      ) : (
                        <>
                          <Wallet className="mr-2 h-5 w-5" />
                          Connect Wallet
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </WalletConnectorButton>

                <p className="text-xs text-center text-muted-foreground">
                  Supports Concordium Browser Wallet and WalletConnect
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
