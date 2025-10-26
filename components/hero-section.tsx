"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { LoginModal } from "@/components/login-modal"
import Link from "next/link"

export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(168,85,247,0.1),transparent_40%)]" />
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.nav
        className="absolute top-0 left-0 right-0 z-50 px-6 py-6 backdrop-blur-md bg-background/30 border-b border-border/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/50">
                <span className="text-primary-foreground font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Carma
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:scale-105"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.div
            className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm text-primary font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Powered by Concordium Blockchain
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance leading-tight">
            <span className="text-foreground">Rent Cars</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
              Without Paperwork
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto text-balance leading-relaxed">
            No more paperwork. No more carrying your physical license. Just verify once, book your car, and drive away.
          </p>

          <motion.div
            className="flex items-center justify-center mb-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.98 }} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 animate-gradient" />
              <Button
                size="lg"
                onClick={() => setShowLoginModal(true)}
                className="relative bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground text-xl px-12 py-8 h-auto rounded-2xl shadow-2xl shadow-primary/50 transition-all hover:shadow-primary/70 font-semibold"
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Start Renting Now
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </section>
  )
}
