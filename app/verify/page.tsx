"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight, Sparkles, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useWallet } from "@/components/ConcordiumProvider"
import { IdentityVerification } from "@/components/IdentityVerification"

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "invalid" | "expired">("idle")
  const router = useRouter()
  const walletProps = useWallet()

  // Get the connection from wallet props
  const connection = walletProps.activeConnector?.getConnections()[0]
  const account = connection ? walletProps.connectedAccounts.get(connection) : undefined

  const handleVerificationComplete = (status: 'success' | 'invalid' | 'expired') => {
    setIsVerifying(false)
    setVerificationStatus(status)

    if (status === "success") {
      setTimeout(() => {
        router.push("/cars")
      }, 2000)
    }
  }

  const { requestIdentityProof } = IdentityVerification({
    connector: connection || null,
    account,
    onVerificationComplete: handleVerificationComplete,
    isVerifying,
    setIsVerifying,
  })

  const handleVerifyFromWallet = async () => {
    if (!connection || !account) {
      alert('Please connect your wallet first at /connect-wallet')
      return
    }
    await requestIdentityProof()
  }

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case "invalid":
        return {
          icon: <XCircle className="w-12 h-12 text-destructive" />,
          title: "Invalid Document Type",
          message: "Please upload your driving license for verification.",
          color: "destructive",
        }
      case "expired":
        return {
          icon: <AlertCircle className="w-12 h-12 text-yellow-500" />,
          title: "License Expired",
          message: "Your driving license is expired. Please renew it before proceeding.",
          color: "yellow",
        }
      case "success":
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-primary" />,
          title: "Verification Successful!",
          message: "Your license has been verified on the blockchain. Redirecting to car selection...",
          color: "primary",
        }
      default:
        return null
    }
  }

  const statusInfo = getStatusMessage()

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
          className="w-full max-w-2xl"
        >
          <Card className="p-8 bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30"
                animate={isVerifying ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 1, repeat: isVerifying ? Number.POSITIVE_INFINITY : 0 }}
              >
                {statusInfo ? statusInfo.icon : <Shield className="w-12 h-12 text-primary" />}
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                Verify Your License
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Your ID details are stored in your wallet. Click below to verify your driving license.
              </p>
            </div>

            {statusInfo ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div
                  className={`p-6 rounded-xl border ${
                    verificationStatus === "success"
                      ? "bg-primary/10 border-primary/30"
                      : verificationStatus === "expired"
                        ? "bg-yellow-500/10 border-yellow-500/30"
                        : "bg-destructive/10 border-destructive/30"
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    {statusInfo.icon}
                    <h3 className="text-xl font-semibold text-foreground">{statusInfo.title}</h3>
                    <p className="text-muted-foreground">{statusInfo.message}</p>
                  </div>
                </div>

                {verificationStatus !== "success" && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setVerificationStatus("idle")}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground h-12 text-base font-semibold shadow-lg shadow-primary/30"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3 p-6 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">1</span>
                    </div>
                    <span className="text-foreground font-medium">Connect to your wallet</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isVerifying ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isVerifying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span className="text-sm font-bold">2</span>
                      )}
                    </div>
                    <span className={isVerifying ? "text-foreground font-medium" : "text-muted-foreground"}>
                      Blockchain verification in progress
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <span className="text-muted-foreground">Start renting cars</span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleVerifyFromWallet}
                    disabled={isVerifying}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground h-14 text-base font-semibold shadow-lg shadow-primary/30 transition-all"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying on Blockchain...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Verify My License
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                  <span>Your data is encrypted and stored securely on the blockchain</span>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
