"use client"

import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import { usePremium } from "@/contexts/PremiumContext"

interface PremiumBadgeProps {
  variant?: "default" | "compact" | "icon-only"
  showExpiry?: boolean
}

export function PremiumBadge({ variant = "default", showExpiry = false }: PremiumBadgeProps) {
  const { isPremium, premiumExpiresAt, subscriptionStatus, planName, loading } = usePremium()

  if (loading) {
    return <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
  }

  if (!isPremium) {
    return null
  }

  const formatExpiryDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getBadgeVariant = () => {
    if (subscriptionStatus === "canceled") return "outline"
    return "default"
  }

  const getBadgeColor = () => {
    if (subscriptionStatus === "canceled") return "text-yellow-600"
    return "text-yellow-500"
  }

  if (variant === "icon-only") {
    return <Crown className={`h-4 w-4 ${getBadgeColor()}`} />
  }

  if (variant === "compact") {
    return (
      <Badge variant={getBadgeVariant()} className="flex items-center gap-1">
        <Crown className="h-3 w-3" />
        {subscriptionStatus === "canceled" ? "Canceling" : "Premium"}
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getBadgeVariant()} className="flex items-center gap-1">
        <Crown className="h-3 w-3" />
        {planName || "Premium"}
      </Badge>
      {showExpiry && premiumExpiresAt && (
        <span className="text-xs text-muted-foreground">
          {subscriptionStatus === "canceled" ? "Expires" : "Renews"} {formatExpiryDate(premiumExpiresAt)}
        </span>
      )}
    </div>
  )
}
