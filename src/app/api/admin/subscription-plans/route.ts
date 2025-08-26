<<<<<<< HEAD
=======
// import { type NextRequest, NextResponse } from "next/server"
// import { appDb } from "@/appDb/postgres"
// import { subscriptionPlans } from "@/appDb/postgres/schema"
// import { eq } from "drizzle-orm"
// import { stripe } from "@/lib/stripe"

// export async function GET() {
//   try {
//     const plans = await appDb.select().from(subscriptionPlans)
//     return NextResponse.json(plans)
//   } catch (error) {
//     console.error("Error fetching subscription plans:", error)
//     return NextResponse.json({ error: "Failed to fetch subscription plans" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { name, description, price, currency, interval, intervalCount, features } = await request.json()

//     if (!name || !price || !interval) {
//       return NextResponse.json({ error: "Name, price, and interval are required" }, { status: 400 })
//     }

//     // Create Stripe price
//     const stripePrice = await stripe.prices.create({
//       unit_amount: Math.round(price * 100), // Convert to cents
//       currency: currency || "usd",
//       recurring: {
//         interval: interval,
//         interval_count: intervalCount || 1,
//       },
//       product_data: {
//         name,
//         description,
//       },
//     })

//     // Create plan in database
//     const [plan] = await appDb
//       .insert(subscriptionPlans)
//       .values({
//         name,
//         description,
//         price: Math.round(price * 100), // Store in cents
//         currency: currency || "usd",
//         interval,
//         intervalCount: intervalCount || 1,
//         stripePriceId: stripePrice.id,
//         features: JSON.stringify(features || []),
//       })
//       .returning()

//     return NextResponse.json(plan)
//   } catch (error) {
//     console.error("Error creating subscription plan:", error)
//     return NextResponse.json({ error: "Failed to create subscription plan" }, { status: 500 })
//   }
// }

// export async function PUT(request: NextRequest) {
//   try {
//     const { id, name, description, price, currency, interval, intervalCount, features, isActive } = await request.json()

//     if (!id) {
//       return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
//     }

//     const updateData: any = {
//       updatedAt: new Date(),
//     }

//     if (name !== undefined) updateData.name = name
//     if (description !== undefined) updateData.description = description
//     if (isActive !== undefined) updateData.isActive = isActive
//     if (features !== undefined) updateData.features = JSON.stringify(features)

//     // If price or interval changed, create new Stripe price
//     if (price !== undefined || interval !== undefined || intervalCount !== undefined) {
//       const [currentPlan] = await appDb.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id))

//       if (currentPlan) {
//         const stripePrice = await stripe.prices.create({
//           unit_amount: Math.round((price || currentPlan.price / 100) * 100),
//           currency: currency || currentPlan.currency,
//           recurring: {
//             interval: interval || currentPlan.interval,
//             interval_count: intervalCount || currentPlan.intervalCount,
//           },
//           product_data: {
//             name: name || currentPlan.name,
//             description: description || currentPlan.description,
//           },
//         })

//         updateData.stripePriceId = stripePrice.id
//         if (price !== undefined) updateData.price = Math.round(price * 100)
//         if (interval !== undefined) updateData.interval = interval
//         if (intervalCount !== undefined) updateData.intervalCount = intervalCount
//       }
//     }

//     const [updatedPlan] = await appDb
//       .update(subscriptionPlans)
//       .set(updateData)
//       .where(eq(subscriptionPlans.id, id))
//       .returning()

//     return NextResponse.json(updatedPlan)
//   } catch (error) {
//     console.error("Error updating subscription plan:", error)
//     return NextResponse.json({ error: "Failed to update subscription plan" }, { status: 500 })
//   }
// }


>>>>>>> d762d5a (premium pages updated)
import { type NextRequest, NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { subscriptionPlans } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"
<<<<<<< HEAD
import { stripe } from "@/lib/stripe"
=======

let stripe: any = null
try {
  const stripeModule = await import("@/lib/stripe")
  stripe = stripeModule.stripe
} catch (error) {
  console.warn("Stripe not configured, plans will be created without Stripe integration")
}
>>>>>>> d762d5a (premium pages updated)

export async function GET() {
  try {
    const plans = await appDb.select().from(subscriptionPlans)
    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching subscription plans:", error)
    return NextResponse.json({ error: "Failed to fetch subscription plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
<<<<<<< HEAD
    const { name, description, price, currency, interval, intervalCount, features } = await request.json()

    if (!name || !price || !interval) {
      return NextResponse.json({ error: "Name, price, and interval are required" }, { status: 400 })
    }

    // Create Stripe price
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Convert to cents
      currency: currency || "usd",
      recurring: {
        interval: interval,
        interval_count: intervalCount || 1,
      },
      product_data: {
        name,
        description,
      },
    })
=======
    const { name, description, price, currency, interval, intervalCount, features, isActive } = await request.json()

    if (!name || price === undefined || !interval) {
      return NextResponse.json({ error: "Name, price, and interval are required" }, { status: 400 })
    }

    let stripePriceId = null

    if (stripe) {
      try {
        const stripePrice = await stripe.prices.create({
          unit_amount: Math.round(price * 100), // Convert to cents
          currency: currency || "usd",
          recurring: {
            interval: interval,
            interval_count: intervalCount || 1,
          },
          product_data: {
            name,
            description: description || undefined,
          },
        })
        stripePriceId = stripePrice.id
      } catch (stripeError) {
        console.error("Stripe error:", stripeError)
        // Continue without Stripe integration
      }
    }
>>>>>>> d762d5a (premium pages updated)

    // Create plan in database
    const [plan] = await appDb
      .insert(subscriptionPlans)
      .values({
        name,
<<<<<<< HEAD
        description,
=======
        description: description || null,
>>>>>>> d762d5a (premium pages updated)
        price: Math.round(price * 100), // Store in cents
        currency: currency || "usd",
        interval,
        intervalCount: intervalCount || 1,
<<<<<<< HEAD
        stripePriceId: stripePrice.id,
        features: JSON.stringify(features || []),
=======
        stripePriceId,
        features: JSON.stringify(features || []),
        isActive: isActive !== undefined ? isActive : true,
>>>>>>> d762d5a (premium pages updated)
      })
      .returning()

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Error creating subscription plan:", error)
<<<<<<< HEAD
    return NextResponse.json({ error: "Failed to create subscription plan" }, { status: 500 })
=======
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create subscription plan",
      },
      { status: 500 },
    )
>>>>>>> d762d5a (premium pages updated)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, price, currency, interval, intervalCount, features, isActive } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (isActive !== undefined) updateData.isActive = isActive
    if (features !== undefined) updateData.features = JSON.stringify(features)

<<<<<<< HEAD
    // If price or interval changed, create new Stripe price
    if (price !== undefined || interval !== undefined || intervalCount !== undefined) {
      const [currentPlan] = await appDb.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id))

      if (currentPlan) {
        const stripePrice = await stripe.prices.create({
          unit_amount: Math.round((price || currentPlan.price / 100) * 100),
          currency: currency || currentPlan.currency,
          recurring: {
            interval: interval || currentPlan.interval,
            interval_count: intervalCount || currentPlan.intervalCount,
          },
          product_data: {
            name: name || currentPlan.name,
            description: description || currentPlan.description,
          },
        })

        updateData.stripePriceId = stripePrice.id
        if (price !== undefined) updateData.price = Math.round(price * 100)
        if (interval !== undefined) updateData.interval = interval
        if (intervalCount !== undefined) updateData.intervalCount = intervalCount
      }
    }

=======
    if (stripe && (price !== undefined || interval !== undefined || intervalCount !== undefined)) {
      try {
        const [currentPlan] = await appDb.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id))

        if (currentPlan) {
          const stripePrice = await stripe.prices.create({
            unit_amount: Math.round((price !== undefined ? price : currentPlan.price / 100) * 100),
            currency: currency || currentPlan.currency,
            recurring: {
              interval: interval || currentPlan.interval,
              interval_count: intervalCount || currentPlan.intervalCount,
            },
            product_data: {
              name: name || currentPlan.name,
              description: description || currentPlan.description || undefined,
            },
          })

          updateData.stripePriceId = stripePrice.id
        }
      } catch (stripeError) {
        console.error("Stripe error during update:", stripeError)
        // Continue without updating Stripe
      }
    }

    if (price !== undefined) updateData.price = Math.round(price * 100)
    if (interval !== undefined) updateData.interval = interval
    if (intervalCount !== undefined) updateData.intervalCount = intervalCount

>>>>>>> d762d5a (premium pages updated)
    const [updatedPlan] = await appDb
      .update(subscriptionPlans)
      .set(updateData)
      .where(eq(subscriptionPlans.id, id))
      .returning()

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error("Error updating subscription plan:", error)
<<<<<<< HEAD
    return NextResponse.json({ error: "Failed to update subscription plan" }, { status: 500 })
=======
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update subscription plan",
      },
      { status: 500 },
    )
>>>>>>> d762d5a (premium pages updated)
  }
}
