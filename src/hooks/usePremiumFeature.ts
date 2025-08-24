"use client"

import { usePremium } from "../contexts/PremiumContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function usePremiumFeature() {
  const { isPremium, loading } = usePremium()
  const router = useRouter()

  const requirePremium = (callback?: () => void) => {
    if (loading) return false

    if (!isPremium) {
      toast.error("This feature requires a premium subscription")
      router.push("/user/premium")
      return false
    }

    if (callback) callback()
    return true
  }

  const isPremiumFeature = (featureName: string) => {
    // Define which features require premium
    const premiumFeatures = [
      "advanced-problems",
      "contest-analytics",
      "detailed-solutions",
      "priority-support",
      "custom-contests",
    ]

    return premiumFeatures.includes(featureName)
  }

  return {
    isPremium,
    loading,
    requirePremium,
    isPremiumFeature,
  }
}
