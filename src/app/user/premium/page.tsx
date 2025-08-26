<<<<<<< HEAD
=======
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Check, Crown, Zap, Star } from "lucide-react"
// import { toast } from "sonner"
// import { loadStripe } from "@stripe/stripe-js"
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
// import { usePremium } from "@/contexts/PremiumContext"

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// interface SubscriptionPlan {
//   id: string
//   name: string
//   description: string | null
//   price: number
//   currency: string
//   interval: "month" | "year"
//   intervalCount: number
//   stripePriceId: string | null
//   isActive: boolean
//   features: string | null
// }

// interface UserSubscription {
//   id: string
//   status: "active" | "canceled" | "expired" | "pending"
//   currentPeriodStart: string
//   currentPeriodEnd: string
//   cancelAtPeriodEnd: boolean
//   plan: {
//     name: string
//     price: number
//     currency: string
//     interval: string
//     intervalCount: number
//   }
// }

// export default function PremiumPage() {
//   return (
//     <Elements stripe={stripePromise}>
//       <PremiumContent />
//     </Elements>
//   )
// }

// function PremiumContent() {
//   const [plans, setPlans] = useState<SubscriptionPlan[]>([])
//   const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [processingPayment, setProcessingPayment] = useState(false)
//   const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

//   const stripe = useStripe()
//   const elements = useElements()

//   const { refreshPremiumStatus } = usePremium()

//   useEffect(() => {
//     fetchPlans()
//     fetchCurrentSubscription()
//   }, [])

//   const fetchPlans = async () => {
//     try {
//       const response = await fetch("/api/admin/subscription-plans")
//       if (response.ok) {
//         const data = await response.json()
//         setPlans(data.filter((plan: SubscriptionPlan) => plan.isActive))
//       }
//     } catch (error) {
//       console.error("Error fetching plans:", error)
//       toast.error("Failed to load subscription plans")
//     }
//   }

//   const fetchCurrentSubscription = async () => {
//     try {
//       const response = await fetch("/api/user/subscription")
//       if (response.ok) {
//         const data = await response.json()
//         setCurrentSubscription(data.subscription)
//       }
//     } catch (error) {
//       console.error("Error fetching subscription:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubscribe = async (plan: SubscriptionPlan) => {
//     if (!stripe || !elements) {
//       toast.error("Payment system not ready")
//       return
//     }

//     setProcessingPayment(true)
//     setSelectedPlan(plan)

//     try {
//       // Get current user
//       const userResponse = await fetch("/api/user/current")
//       if (!userResponse.ok) {
//         throw new Error("Failed to get user information")
//       }
//       const { user } = await userResponse.json()

//       // Create subscription
//       const subscriptionResponse = await fetch("/api/stripe/create-subscription", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user.id,
//           planId: plan.id,
//         }),
//       })

//       if (!subscriptionResponse.ok) {
//         throw new Error("Failed to create subscription")
//       }

//       const { clientSecret } = await subscriptionResponse.json()

//       // Confirm payment
//       const { error } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement)!,
//         },
//       })

//       if (error) {
//         throw new Error(error.message)
//       }

//       toast.success("Successfully subscribed to premium!")
//       fetchCurrentSubscription()
//       await refreshPremiumStatus()
//     } catch (error) {
//       console.error("Subscription error:", error)
//       toast.error(error instanceof Error ? error.message : "Failed to subscribe")
//     } finally {
//       setProcessingPayment(false)
//       setSelectedPlan(null)
//     }
//   }

//   const handleCancelSubscription = async () => {
//     if (!currentSubscription) return

//     try {
//       const response = await fetch("/api/stripe/cancel-subscription", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           subscriptionId: currentSubscription.id,
//           cancelAtPeriodEnd: true,
//         }),
//       })

//       if (response.ok) {
//         toast.success("Subscription will cancel at the end of your billing period")
//         fetchCurrentSubscription()
//         await refreshPremiumStatus()
//       } else {
//         throw new Error("Failed to cancel subscription")
//       }
//     } catch (error) {
//       console.error("Cancel error:", error)
//       toast.error("Failed to cancel subscription")
//     }
//   }

//   const formatPrice = (price: number, currency: string, interval: string, intervalCount: number) => {
//     const amount = price / 100
//     const period = intervalCount === 1 ? interval : `${intervalCount} ${interval}s`
//     return `$${amount.toFixed(2)} / ${period}`
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
//     if (status === "active" && cancelAtPeriodEnd) {
//       return <Badge variant="outline">Canceling</Badge>
//     }

//     switch (status) {
//       case "active":
//         return <Badge variant="default">Active</Badge>
//       case "canceled":
//         return <Badge variant="destructive">Canceled</Badge>
//       case "expired":
//         return <Badge variant="secondary">Expired</Badge>
//       case "pending":
//         return <Badge variant="outline">Pending</Badge>
//       default:
//         return <Badge variant="secondary">{status}</Badge>
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-64 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-6 space-y-8">
//       <div className="text-center space-y-4">
//         <div className="flex items-center justify-center gap-2">
//           <Crown className="h-8 w-8 text-yellow-500" />
//           <h1 className="text-4xl font-bold">Upgrade to Premium</h1>
//         </div>
//         <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//           Unlock advanced features and take your SQL skills to the next level with our premium subscription plans.
//         </p>
//       </div>

//       {/* Current Subscription Status */}
//       {currentSubscription && (
//         <Card className="border-yellow-200 bg-yellow-50">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Crown className="h-5 w-5 text-yellow-500" />
//               Current Subscription
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <div className="text-sm text-muted-foreground">Plan</div>
//                 <div className="font-medium">{currentSubscription.plan.name}</div>
//               </div>
//               <div>
//                 <div className="text-sm text-muted-foreground">Status</div>
//                 <div>{getStatusBadge(currentSubscription.status, currentSubscription.cancelAtPeriodEnd)}</div>
//               </div>
//               <div>
//                 <div className="text-sm text-muted-foreground">Next Billing</div>
//                 <div className="font-medium">{formatDate(currentSubscription.currentPeriodEnd)}</div>
//               </div>
//             </div>
//             {currentSubscription.status === "active" && !currentSubscription.cancelAtPeriodEnd && (
//               <div className="mt-4">
//                 <Button variant="outline" onClick={handleCancelSubscription}>
//                   Cancel Subscription
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* Subscription Plans */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {plans.map((plan) => {
//           const features = plan.features ? JSON.parse(plan.features) : []
//           const isCurrentPlan = currentSubscription?.plan.name === plan.name
//           const isPopular = plan.interval === "year"

//           return (
//             <Card key={plan.id} className={`relative ${isPopular ? "border-primary shadow-lg" : ""}`}>
//               {isPopular && (
//                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                   <Badge className="bg-primary text-primary-foreground">
//                     <Star className="h-3 w-3 mr-1" />
//                     Most Popular
//                   </Badge>
//                 </div>
//               )}
//               <CardHeader className="text-center">
//                 <CardTitle className="text-2xl">{plan.name}</CardTitle>
//                 <CardDescription>{plan.description}</CardDescription>
//                 <div className="text-3xl font-bold">
//                   {formatPrice(plan.price, plan.currency, plan.interval, plan.intervalCount)}
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   {features.map((feature: string, index: number) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <Check className="h-4 w-4 text-green-500" />
//                       <span className="text-sm">{feature}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {isCurrentPlan ? (
//                   <Button disabled className="w-full">
//                     Current Plan
//                   </Button>
//                 ) : (
//                   <Button
//                     className="w-full"
//                     onClick={() => handleSubscribe(plan)}
//                     disabled={processingPayment}
//                     variant={isPopular ? "default" : "outline"}
//                   >
//                     {processingPayment && selectedPlan?.id === plan.id ? (
//                       <>
//                         <Zap className="h-4 w-4 mr-2 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <Crown className="h-4 w-4 mr-2" />
//                         Subscribe Now
//                       </>
//                     )}
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Payment Form */}
//       {selectedPlan && (
//         <Card className="max-w-md mx-auto">
//           <CardHeader>
//             <CardTitle>Payment Details</CardTitle>
//             <CardDescription>Enter your payment information to subscribe to {selectedPlan.name}</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="p-4 border rounded-lg">
//                 <CardElement
//                   options={{
//                     style: {
//                       base: {
//                         fontSize: "16px",
//                         color: "#424770",
//                         "::placeholder": {
//                           color: "#aab7c4",
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//               <div className="text-xs text-muted-foreground">
//                 Your payment information is secure and encrypted. You can cancel anytime.
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Premium Features */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Zap className="h-5 w-5 text-blue-500" />
//               Advanced Problems
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">
//               Access to premium SQL problems with complex scenarios and real-world datasets.
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Star className="h-5 w-5 text-yellow-500" />
//               Priority Support
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">Get priority support and faster response times for your questions.</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Crown className="h-5 w-5 text-purple-500" />
//               Exclusive Content
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">
//               Access exclusive tutorials, advanced techniques, and premium learning materials.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


>>>>>>> d762d5a (premium pages updated)
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
<<<<<<< HEAD
import { Check, Crown, Zap, Star } from "lucide-react"
=======
import { Check, Crown, Zap, Star, AlertCircle, Loader2 } from "lucide-react"
>>>>>>> d762d5a (premium pages updated)
import { toast } from "sonner"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { usePremium } from "@/contexts/PremiumContext"
<<<<<<< HEAD
=======
import { Alert, AlertDescription } from "@/components/ui/alert"
>>>>>>> d762d5a (premium pages updated)

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

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
}

interface UserSubscription {
  id: string
  status: "active" | "canceled" | "expired" | "pending"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  plan: {
    name: string
    price: number
    currency: string
    interval: string
    intervalCount: number
  }
}

export default function PremiumPage() {
  return (
    <Elements stripe={stripePromise}>
      <PremiumContent />
    </Elements>
  )
}

function PremiumContent() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
<<<<<<< HEAD
=======
  const [plansError, setPlansError] = useState<string | null>(null)
>>>>>>> d762d5a (premium pages updated)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  const stripe = useStripe()
  const elements = useElements()

  const { refreshPremiumStatus } = usePremium()

  useEffect(() => {
    fetchPlans()
    fetchCurrentSubscription()
  }, [])

  const fetchPlans = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch("/api/admin/subscription-plans")
      if (response.ok) {
        const data = await response.json()
        setPlans(data.filter((plan: SubscriptionPlan) => plan.isActive))
      }
    } catch (error) {
      console.error("Error fetching plans:", error)
=======
      console.log("[v0] Fetching subscription plans...")
      const response = await fetch("/api/user/subscription-plans")

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Plans fetched successfully:", data.length, "plans")
        setPlans(data.filter((plan: SubscriptionPlan) => plan.isActive))
        setPlansError(null)
      } else {
        console.log("[v0] User endpoint failed, trying admin endpoint...")
        const adminResponse = await fetch("/api/admin/subscription-plans")

        if (adminResponse.ok) {
          const adminData = await adminResponse.json()
          console.log("[v0] Admin plans fetched:", adminData.length, "plans")
          setPlans(adminData.filter((plan: SubscriptionPlan) => plan.isActive))
          setPlansError(null)
        } else {
          throw new Error(`Failed to fetch plans: ${adminResponse.status}`)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching plans:", error)
      setPlansError("Unable to load subscription plans. Please try again later.")
>>>>>>> d762d5a (premium pages updated)
      toast.error("Failed to load subscription plans")
    }
  }

  const fetchCurrentSubscription = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch("/api/user/subscription")
      if (response.ok) {
        const data = await response.json()
        setCurrentSubscription(data.subscription)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error)
=======
      console.log("[v0] Fetching current subscription...")
      const response = await fetch("/api/user/subscription")
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Current subscription:", data.subscription ? "found" : "none")
        setCurrentSubscription(data.subscription)
      } else if (response.status !== 404) {
        console.error("[v0] Subscription fetch error:", response.status)
      }
    } catch (error) {
      console.error("[v0] Error fetching subscription:", error)
>>>>>>> d762d5a (premium pages updated)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!stripe || !elements) {
      toast.error("Payment system not ready")
      return
    }

<<<<<<< HEAD
=======
    if (!plan.stripePriceId) {
      toast.error("This plan is not properly configured for payments")
      return
    }

>>>>>>> d762d5a (premium pages updated)
    setProcessingPayment(true)
    setSelectedPlan(plan)

    try {
<<<<<<< HEAD
=======
      console.log("[v0] Starting subscription process for plan:", plan.name)

>>>>>>> d762d5a (premium pages updated)
      // Get current user
      const userResponse = await fetch("/api/user/current")
      if (!userResponse.ok) {
        throw new Error("Failed to get user information")
      }
      const { user } = await userResponse.json()

      // Create subscription
      const subscriptionResponse = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          planId: plan.id,
        }),
      })

      if (!subscriptionResponse.ok) {
<<<<<<< HEAD
        throw new Error("Failed to create subscription")
=======
        const errorData = await subscriptionResponse.json()
        throw new Error(errorData.error || "Failed to create subscription")
>>>>>>> d762d5a (premium pages updated)
      }

      const { clientSecret } = await subscriptionResponse.json()

      // Confirm payment
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

<<<<<<< HEAD
=======
      console.log("[v0] Subscription successful")
>>>>>>> d762d5a (premium pages updated)
      toast.success("Successfully subscribed to premium!")
      fetchCurrentSubscription()
      await refreshPremiumStatus()
    } catch (error) {
<<<<<<< HEAD
      console.error("Subscription error:", error)
=======
      console.error("[v0] Subscription error:", error)
>>>>>>> d762d5a (premium pages updated)
      toast.error(error instanceof Error ? error.message : "Failed to subscribe")
    } finally {
      setProcessingPayment(false)
      setSelectedPlan(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return

    try {
<<<<<<< HEAD
=======
      console.log("[v0] Canceling subscription:", currentSubscription.id)
>>>>>>> d762d5a (premium pages updated)
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: currentSubscription.id,
          cancelAtPeriodEnd: true,
        }),
      })

      if (response.ok) {
        toast.success("Subscription will cancel at the end of your billing period")
        fetchCurrentSubscription()
        await refreshPremiumStatus()
      } else {
<<<<<<< HEAD
        throw new Error("Failed to cancel subscription")
      }
    } catch (error) {
      console.error("Cancel error:", error)
      toast.error("Failed to cancel subscription")
=======
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to cancel subscription")
      }
    } catch (error) {
      console.error("[v0] Cancel error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription")
>>>>>>> d762d5a (premium pages updated)
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
      month: "long",
      day: "numeric",
    })
  }

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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
<<<<<<< HEAD
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
=======
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading premium plans...</span>
>>>>>>> d762d5a (premium pages updated)
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold">Upgrade to Premium</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock advanced features and take your SQL skills to the next level with our premium subscription plans.
        </p>
      </div>

<<<<<<< HEAD
=======
      {plansError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {plansError}
            <Button variant="link" className="p-0 h-auto ml-2" onClick={fetchPlans}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

>>>>>>> d762d5a (premium pages updated)
      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Plan</div>
                <div className="font-medium">{currentSubscription.plan.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div>{getStatusBadge(currentSubscription.status, currentSubscription.cancelAtPeriodEnd)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Next Billing</div>
                <div className="font-medium">{formatDate(currentSubscription.currentPeriodEnd)}</div>
              </div>
            </div>
            {currentSubscription.status === "active" && !currentSubscription.cancelAtPeriodEnd && (
              <div className="mt-4">
                <Button variant="outline" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans */}
<<<<<<< HEAD
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const features = plan.features ? JSON.parse(plan.features) : []
          const isCurrentPlan = currentSubscription?.plan.name === plan.name
          const isPopular = plan.interval === "year"

          return (
            <Card key={plan.id} className={`relative ${isPopular ? "border-primary shadow-lg" : ""}`}>
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-3xl font-bold">
                  {formatPrice(plan.price, plan.currency, plan.interval, plan.intervalCount)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {isCurrentPlan ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(plan)}
                    disabled={processingPayment}
                    variant={isPopular ? "default" : "outline"}
                  >
                    {processingPayment && selectedPlan?.id === plan.id ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
=======
      {plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const features = plan.features ? JSON.parse(plan.features) : []
            const isCurrentPlan = currentSubscription?.plan.name === plan.name
            const isPopular = plan.interval === "year"

            return (
              <Card key={plan.id} className={`relative ${isPopular ? "border-primary shadow-lg" : ""}`}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    {formatPrice(plan.price, plan.currency, plan.interval, plan.intervalCount)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {features.length > 0 ? (
                      features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">No features listed</div>
                    )}
                  </div>

                  {isCurrentPlan ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(plan)}
                      disabled={processingPayment || !plan.stripePriceId}
                      variant={isPopular ? "default" : "outline"}
                    >
                      {processingPayment && selectedPlan?.id === plan.id ? (
                        <>
                          <Zap className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : !plan.stripePriceId ? (
                        "Not Available"
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Subscribe Now
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : !plansError ? (
        <Card>
          <CardContent className="text-center py-12">
            <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Premium Plans Available</h3>
            <p className="text-muted-foreground">
              Premium subscription plans are not currently available. Please check back later.
            </p>
          </CardContent>
        </Card>
      ) : null}
>>>>>>> d762d5a (premium pages updated)

      {/* Payment Form */}
      {selectedPlan && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter your payment information to subscribe to {selectedPlan.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Your payment information is secure and encrypted. You can cancel anytime.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Advanced Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access to premium SQL problems with complex scenarios and real-world datasets.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Priority Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Get priority support and faster response times for your questions.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-500" />
              Exclusive Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access exclusive tutorials, advanced techniques, and premium learning materials.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
