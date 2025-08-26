<<<<<<< HEAD
import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { appDb } from "@/db/postgres"
import { users, userSubscriptions, payments } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"
=======
// import { type NextRequest, NextResponse } from "next/server"
// import { stripe } from "@/lib/stripe"
// import { appDb } from "@/appDb/postgres"
// import { users, userSubscriptions, payments } from "@/appDb/postgres/schema"
// import { eq } from "drizzle-orm"
// import type Stripe from "stripe"

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.text()
//     const signature = request.headers.get("stripe-signature")!

//     let event: Stripe.Event

//     try {
//       event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
//     } catch (err) {
//       console.error("Webhook signature verification failed:", err)
//       return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
//     }

//     switch (event.type) {
//       case "customer.subscription.created":
//       case "customer.subscription.updated": {
//         const subscription = event.data.object as Stripe.Subscription
//         await handleSubscriptionUpdate(subscription)
//         break
//       }

//       case "customer.subscription.deleted": {
//         const subscription = event.data.object as Stripe.Subscription
//         await handleSubscriptionCancellation(subscription)
//         break
//       }

//       case "invoice.payment_succeeded": {
//         const invoice = event.data.object as Stripe.Invoice
//         await handlePaymentSuccess(invoice)
//         break
//       }

//       case "invoice.payment_failed": {
//         const invoice = event.data.object as Stripe.Invoice
//         await handlePaymentFailure(invoice)
//         break
//       }

//       default:
//         console.log(`Unhandled event type: ${event.type}`)
//     }

//     return NextResponse.json({ received: true })
//   } catch (error) {
//     console.error("Webhook error:", error)
//     return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
//   }
// }

// async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
//   const userId = subscription.metadata.userId
//   if (!userId) return

//   const status =
//     subscription.status === "active" ? "active" : subscription.status === "canceled" ? "canceled" : "pending"

//   const currentPeriodStart = new Date(subscription.current_period_start * 1000)
//   const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

//   // Update subscription status
//   await appDb
//     .update(userSubscriptions)
//     .set({
//       status,
//       currentPeriodStart,
//       currentPeriodEnd,
//       cancelAtPeriodEnd: subscription.cancel_at_period_end,
//       updatedAt: new Date(),
//     })
//     .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id))

//   // Update user premium status
//   const isPremium = status === "active"
//   const premiumExpiresAt = isPremium ? currentPeriodEnd : null

//   await appDb
//     .update(users)
//     .set({
//       isPremium,
//       premiumExpiresAt,
//     })
//     .where(eq(users.id, userId))
// }

// async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
//   const userId = subscription.metadata.userId
//   if (!userId) return

//   await appDb
//     .update(userSubscriptions)
//     .set({
//       status: "canceled",
//       canceledAt: new Date(),
//       updatedAt: new Date(),
//     })
//     .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id))

//   await appDb
//     .update(users)
//     .set({
//       isPremium: false,
//       premiumExpiresAt: null,
//     })
//     .where(eq(users.id, userId))
// }

// async function handlePaymentSuccess(invoice: Stripe.Invoice) {
//   const subscriptionId = invoice.subscription as string
//   const userId = invoice.metadata?.userId

//   if (userId && subscriptionId) {
//     // Record successful payment
//     await appDb.insert(payments).values({
//       userId,
//       stripePaymentIntentId: invoice.payment_intent as string,
//       amount: invoice.amount_paid,
//       currency: invoice.currency,
//       status: "completed",
//       description: `Payment for subscription ${subscriptionId}`,
//     })
//   }
// }

// async function handlePaymentFailure(invoice: Stripe.Invoice) {
//   const userId = invoice.metadata?.userId

//   if (userId) {
//     // Record failed payment
//     await appDb.insert(payments).values({
//       userId,
//       stripePaymentIntentId: invoice.payment_intent as string,
//       amount: invoice.amount_due,
//       currency: invoice.currency,
//       status: "failed",
//       description: `Failed payment for invoice ${invoice.id}`,
//     })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { appDb } from "@/db/postgres"
import { users, userSubscriptions, payments, userPremiumAccess, premiumProblems } from "@/db/postgres/schema"
import { eq, and } from "drizzle-orm"
>>>>>>> d762d5a (premium pages updated)
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(subscription)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSuccess(invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailure(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  if (!userId) return

  const status =
    subscription.status === "active" ? "active" : subscription.status === "canceled" ? "canceled" : "pending"

  const currentPeriodStart = new Date(subscription.current_period_start * 1000)
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  // Update subscription status
<<<<<<< HEAD
  await appDb
=======
  const [updatedSubscription] = await appDb
>>>>>>> d762d5a (premium pages updated)
    .update(userSubscriptions)
    .set({
      status,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    })
    .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id))
<<<<<<< HEAD
=======
    .returning()
>>>>>>> d762d5a (premium pages updated)

  // Update user premium status
  const isPremium = status === "active"
  const premiumExpiresAt = isPremium ? currentPeriodEnd : null

  await appDb
    .update(users)
    .set({
      isPremium,
      premiumExpiresAt,
    })
    .where(eq(users.id, userId))
<<<<<<< HEAD
=======

  if (status === "active" && updatedSubscription) {
    await grantPremiumProblemAccess(userId, updatedSubscription.id, updatedSubscription.planId, currentPeriodEnd)
  } else if (status === "canceled" || status === "expired") {
    await revokePremiumProblemAccess(userId)
  }
>>>>>>> d762d5a (premium pages updated)
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  if (!userId) return

  await appDb
    .update(userSubscriptions)
    .set({
      status: "canceled",
<<<<<<< HEAD
      canceledAt: new Date(),
=======
      canceledAt: new Date(),   
>>>>>>> d762d5a (premium pages updated)
      updatedAt: new Date(),
    })
    .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id))

  await appDb
    .update(users)
    .set({
      isPremium: false,
      premiumExpiresAt: null,
    })
    .where(eq(users.id, userId))
<<<<<<< HEAD
=======

  await revokePremiumProblemAccess(userId)
>>>>>>> d762d5a (premium pages updated)
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  const userId = invoice.metadata?.userId

  if (userId && subscriptionId) {
    // Record successful payment
    await appDb.insert(payments).values({
      userId,
      stripePaymentIntentId: invoice.payment_intent as string,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: "completed",
      description: `Payment for subscription ${subscriptionId}`,
    })
<<<<<<< HEAD
=======

    const userSub = await appDb
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.stripeSubscriptionId, subscriptionId))
      .limit(1)

    if (userSub.length > 0 && userSub[0].status === "active") {
      await grantPremiumProblemAccess(userId, userSub[0].id, userSub[0].planId, userSub[0].currentPeriodEnd)
    }
>>>>>>> d762d5a (premium pages updated)
  }
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  const userId = invoice.metadata?.userId

  if (userId) {
    // Record failed payment
    await appDb.insert(payments).values({
      userId,
      stripePaymentIntentId: invoice.payment_intent as string,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: "failed",
      description: `Failed payment for invoice ${invoice.id}`,
    })
  }
}
<<<<<<< HEAD
=======

async function grantPremiumProblemAccess(userId: string, subscriptionId: string, planId: string, expiresAt: Date) {
  try {
    // Get all premium problems associated with this plan
    const planProblems = await appDb
      .select({
        problemId: premiumProblems.problemId,
      })
      .from(premiumProblems)
      .where(and(eq(premiumProblems.planId, planId), eq(premiumProblems.isActive, true)))

    // Grant access to each problem
    for (const planProblem of planProblems) {
      // Check if access already exists
      const existingAccess = await appDb
        .select()
        .from(userPremiumAccess)
        .where(
          and(
            eq(userPremiumAccess.userId, userId),
            eq(userPremiumAccess.problemId, planProblem.problemId),
            eq(userPremiumAccess.subscriptionId, subscriptionId),
          ),
        )
        .limit(1)

      if (existingAccess.length === 0) {
        // Create new access record
        await appDb.insert(userPremiumAccess).values({
          userId,
          problemId: planProblem.problemId,
          subscriptionId,
          grantedAt: new Date(),
          expiresAt,
          isActive: true,
        })
      } else {
        // Update existing access record
        await appDb
          .update(userPremiumAccess)
          .set({
            expiresAt,
            isActive: true,
            updatedAt: new Date(),
          })
          .where(eq(userPremiumAccess.id, existingAccess[0].id))
      }
    }

    console.log(`Granted premium problem access to user ${userId} for plan ${planId}`)
  } catch (error) {
    console.error("Error granting premium problem access:", error)
  }
}

async function revokePremiumProblemAccess(userId: string) {
  try {
    // Deactivate all premium problem access for this user
    await appDb
      .update(userPremiumAccess)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(userPremiumAccess.userId, userId))

    console.log(`Revoked premium problem access for user ${userId}`)
  } catch (error) {
    console.error("Error revoking premium problem access:", error)
  }
}
>>>>>>> d762d5a (premium pages updated)
