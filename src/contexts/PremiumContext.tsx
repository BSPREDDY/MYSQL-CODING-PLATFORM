"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface PremiumStatus {
  isPremium: boolean
  premiumExpiresAt: string | null
  subscriptionStatus: "active" | "canceled" | "expired" | "pending" | null
  planName: string | null
  loading: boolean
}

interface PremiumContextType extends PremiumStatus {
  refreshPremiumStatus: () => Promise<void>
  updatePremiumStatus: (status: Partial<PremiumStatus>) => void
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    premiumExpiresAt: null,
    subscriptionStatus: null,
    planName: null,
    loading: true,
  })

  const refreshPremiumStatus = async () => {
    try {
      const response = await fetch("/api/user/premium-status")
      if (response.ok) {
        const data = await response.json()
        setPremiumStatus({
          isPremium: data.isPremium,
          premiumExpiresAt: data.premiumExpiresAt,
          subscriptionStatus: data.subscriptionStatus,
          planName: data.planName,
          loading: false,
        })
      } else {
        setPremiumStatus((prev) => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error("Error fetching premium status:", error)
      setPremiumStatus((prev) => ({ ...prev, loading: false }))
    }
  }

  const updatePremiumStatus = (status: Partial<PremiumStatus>) => {
    setPremiumStatus((prev) => ({ ...prev, ...status }))
  }

  useEffect(() => {
    refreshPremiumStatus()

    // Set up periodic refresh every 5 minutes
    const interval = setInterval(refreshPremiumStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const contextValue: PremiumContextType = {
    ...premiumStatus,
    refreshPremiumStatus,
    updatePremiumStatus,
  }

  return <PremiumContext.Provider value={contextValue}>{children}</PremiumContext.Provider>
}

export function usePremium() {
  const context = useContext(PremiumContext)
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider")
  }
  return context
}
