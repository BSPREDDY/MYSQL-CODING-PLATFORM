"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, DollarSign, Calendar } from "lucide-react"
import { toast } from "sonner"

interface SubscriptionPlan {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  interval: "month" | "year"
  intervalCount: number
  stripePriceId: string | null
  isActive: boolean
  features: string | null
  createdAt: string
  updatedAt: string
}

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "usd",
    interval: "month" as "month" | "year",
    intervalCount: "1",
    features: "",
    isActive: true,
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/admin/subscription-plans")
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error("Error fetching plans:", error)
      toast.error("Failed to fetch subscription plans")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const features = formData.features.split("\n").filter((f) => f.trim())
      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price),
        intervalCount: Number.parseInt(formData.intervalCount),
        features,
      }

      const url = editingPlan ? "/api/admin/subscription-plans" : "/api/admin/subscription-plans"

      const method = editingPlan ? "PUT" : "POST"

      if (editingPlan) {
        payload.id = editingPlan.id
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(editingPlan ? "Plan updated successfully" : "Plan created successfully")
        setIsCreateDialogOpen(false)
        setEditingPlan(null)
        resetForm()
        fetchPlans()
      } else {
        throw new Error("Failed to save plan")
      }
    } catch (error) {
      console.error("Error saving plan:", error)
      toast.error("Failed to save plan")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "usd",
      interval: "month",
      intervalCount: "1",
      features: "",
      isActive: true,
    })
  }

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    const features = plan.features ? JSON.parse(plan.features).join("\n") : ""
    setFormData({
      name: plan.name,
      description: plan.description || "",
      price: (plan.price / 100).toString(),
      currency: plan.currency,
      interval: plan.interval,
      intervalCount: plan.intervalCount.toString(),
      features,
      isActive: plan.isActive,
    })
    setIsCreateDialogOpen(true)
  }

  const formatPrice = (price: number, currency: string, interval: string, intervalCount: number) => {
    const amount = price / 100
    const period = intervalCount === 1 ? interval : `${intervalCount} ${interval}s`
    return `$${amount.toFixed(2)} / ${period}`
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
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage premium subscription plans and pricing</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
              <DialogDescription>
                {editingPlan
                  ? "Update the subscription plan details"
                  : "Create a new subscription plan with pricing and features"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Premium Plan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="9.99"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Premium features and benefits"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interval">Billing Interval</Label>
                  <Select
                    value={formData.interval}
                    onValueChange={(value: "month" | "year") => setFormData({ ...formData, interval: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="intervalCount">Interval Count</Label>
                  <Input
                    id="intervalCount"
                    type="number"
                    min="1"
                    value={formData.intervalCount}
                    onChange={(e) => setFormData({ ...formData, intervalCount: e.target.value })}
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Unlimited problems&#10;Priority support&#10;Advanced analytics"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active Plan</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingPlan ? "Update Plan" : "Create Plan"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Plans</CardTitle>
            <CardDescription>Current subscription plans available to users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        {plan.description && <div className="text-sm text-muted-foreground">{plan.description}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(plan.price, plan.currency, plan.interval, plan.intervalCount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {plan.intervalCount === 1 ? plan.interval : `${plan.intervalCount} ${plan.interval}s`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.isActive ? "default" : "secondary"}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {plan.features && (
                        <div className="text-sm">
                          {JSON.parse(plan.features)
                            .slice(0, 2)
                            .map((feature: string, index: number) => (
                              <div key={index}>• {feature}</div>
                            ))}
                          {JSON.parse(plan.features).length > 2 && (
                            <div className="text-muted-foreground">+{JSON.parse(plan.features).length - 2} more</div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {plans.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No subscription plans found. Create your first plan to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
