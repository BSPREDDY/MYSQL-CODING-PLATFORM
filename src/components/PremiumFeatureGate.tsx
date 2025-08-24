"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Lock } from "lucide-react"
import { usePremium } from "@/contexts/PremiumContext"
import Link from "next/link"

interface PremiumFeatureGateProps {
  children: ReactNode
  fallback?: ReactNode
  featureName?: string
  description?: string
}

export function PremiumFeatureGate({
  children,
  fallback,
  featureName = "Premium Feature",
  description = "This feature is available to premium subscribers only.",
}: PremiumFeatureGateProps) {
  const { isPremium, loading } = usePremium()

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded h-32"></div>
  }

  if (isPremium) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="h-5 w-5 text-gray-400" />
          {featureName}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/user/premium">
          <Button className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Upgrade to Premium
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
