"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Crown, Calendar, DollarSign, User } from "lucide-react"
import { toast } from "sonner"

interface UserSubscription {
  id: string
  userId: string
  planId: string
  stripeSubscriptionId: string | null
  status: "active" | "canceled" | "expired" | "pending"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  canceledAt: string | null
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
  }
  plan: {
    name: string
    price: number
    currency: string
    interval: string
    intervalCount: number
  }
}

export default function UserSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/admin/user-subscriptions")
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data)
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      toast.error("Failed to fetch user subscriptions")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async (subscriptionId: string, cancelAtPeriodEnd = true) => {
    try {
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, cancelAtPeriodEnd }),
      })

      if (response.ok) {
        toast.success(
          cancelAtPeriodEnd ? "Subscription will cancel at period end" : "Subscription canceled immediately",
        )
        fetchSubscriptions()
      } else {
        throw new Error("Failed to cancel subscription")
      }
    } catch (error) {
      console.error("Error canceling subscription:", error)
      toast.error("Failed to cancel subscription")
    }
  }

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (status === "active" && cancelAtPeriodEnd) {
      return <Badge variant="outline">Canceling</Badge>
    }

    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatPrice = (price: number, currency: string, interval: string, intervalCount: number) => {
    const amount = price / 100
    const period = intervalCount === 1 ? interval : `${intervalCount} ${interval}s`
    return `$${amount.toFixed(2)} / ${period}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Subscriptions</h1>
          <p className="text-muted-foreground">Manage and monitor user premium subscriptions</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Overview</CardTitle>
            <CardDescription>Current subscription statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {subscriptions.filter((s) => s.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {subscriptions.filter((s) => s.status === "active" && s.cancelAtPeriodEnd).length}
                </div>
                <div className="text-sm text-muted-foreground">Canceling</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {subscriptions.filter((s) => s.status === "canceled").length}
                </div>
                <div className="text-sm text-muted-foreground">Canceled</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {subscriptions.reduce((sum, s) => sum + s.plan.price, 0) / 100}
                </div>
                <div className="text-sm text-muted-foreground">Total MRR ($)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-4 mt-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users or plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Period</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{subscription.user.name}</div>
                          <div className="text-sm text-muted-foreground">{subscription.user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{subscription.plan.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(subscription.status, subscription.cancelAtPeriodEnd)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(
                          subscription.plan.price,
                          subscription.plan.currency,
                          subscription.plan.interval,
                          subscription.plan.intervalCount,
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedSubscription(subscription)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Subscription Details</DialogTitle>
                              <DialogDescription>Manage {subscription.user.name}'s subscription</DialogDescription>
                            </DialogHeader>
                            {selectedSubscription && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">User</Label>
                                    <div className="text-sm">{selectedSubscription.user.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {selectedSubscription.user.email}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Plan</Label>
                                    <div className="text-sm">{selectedSubscription.plan.name}</div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <div>
                                      {getStatusBadge(
                                        selectedSubscription.status,
                                        selectedSubscription.cancelAtPeriodEnd,
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Price</Label>
                                    <div className="text-sm">
                                      {formatPrice(
                                        selectedSubscription.plan.price,
                                        selectedSubscription.plan.currency,
                                        selectedSubscription.plan.interval,
                                        selectedSubscription.plan.intervalCount,
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Current Period</Label>
                                  <div className="text-sm">
                                    {formatDate(selectedSubscription.currentPeriodStart)} -{" "}
                                    {formatDate(selectedSubscription.currentPeriodEnd)}
                                  </div>
                                </div>
                                {selectedSubscription.stripeSubscriptionId && (
                                  <div>
                                    <Label className="text-sm font-medium">Stripe Subscription ID</Label>
                                    <div className="text-xs font-mono bg-muted p-2 rounded">
                                      {selectedSubscription.stripeSubscriptionId}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            <DialogFooter>
                              {selectedSubscription?.status === "active" && !selectedSubscription.cancelAtPeriodEnd && (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    handleCancelSubscription(selectedSubscription.id, true)
                                    setSelectedSubscription(null)
                                  }}
                                >
                                  Cancel at Period End
                                </Button>
                              )}
                              {selectedSubscription?.status === "active" && (
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    handleCancelSubscription(selectedSubscription.id, false)
                                    setSelectedSubscription(null)
                                  }}
                                >
                                  Cancel Immediately
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "No subscriptions match your search." : "No user subscriptions found."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
