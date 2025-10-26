"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email?: string
  walletAddress?: string
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (method: "wallet" | "email", data: any) => Promise<void>
  logout: () => void
  updateVerificationStatus: (verified: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("carma_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (method: "wallet" | "email", data: any) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      ...(method === "wallet" ? { walletAddress: data.address } : { email: data.email }),
      isVerified: false,
    }
    setUser(newUser)
    localStorage.setItem("carma_user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("carma_user")
  }

  const updateVerificationStatus = (verified: boolean) => {
    if (user) {
      const updatedUser = { ...user, isVerified: verified }
      setUser(updatedUser)
      localStorage.setItem("carma_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateVerificationStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
