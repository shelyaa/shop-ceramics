import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import db from "@/src/db/db";
import PurchaseReceiptEmail from "@/src/email/PurchaseReceipt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);


export async function POST(req: NextRequest) {
  console.log("Stripe webhook received!");
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    console.log("Event type:", event.type);
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;
    console.log("Charge metadata:", charge.metadata);
    console.log("Charge billing_details.email:", charge.billing_details.email);
    console.log("cartItems raw:", charge.metadata.cartItems);
    console.log("cart raw:", charge.metadata.cart);
    let cartItems: { id: string; quantity: number }[] = [];
    try {
      cartItems = JSON.parse(charge.metadata.cart);
    } catch (e) {
      console.error("cart parse error:", e, charge.metadata?.cart);
      return new NextResponse("Bad Request: cart missing", { status: 400 });
    }

    if (!email || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("Invalid payload", { email, cartItems });
      return new NextResponse("Bad Request", { status: 400 });
    }

    let order;
    try {
      const {
        orders: [createdOrder],
      } = await db.user.upsert({
        where: { email },
        create: {
          email,
          orders: {
            create: [
              {
                pricePaidInCents,
                orderItems: {
                  create: cartItems.map((item) => ({
                    product: { connect: { id: item.id } },
                    quantity: item.quantity,
                  })),
                },
              },
            ],
          },
        },
        update: {
          orders: {
            create: [
              {
                pricePaidInCents,
                orderItems: {
                  create: cartItems.map(item => ({
                    product: { connect: { id: item.id } },
                    quantity: item.quantity,
                  })),
                },
              },
            ],
          },
        },
        select: {
          orders: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { orderItems: { include: { product: true } }, user: true },
          },
        },
      });
      order = createdOrder;
      console.log("Order created via upsert:", order);
    } catch (e) {
      console.error("Order creation error (upsert):", e);
      return new NextResponse("Order creation error", { status: 500 });
    }

    const downloadVerificationIds: string[] = [];
    try {
      for (const item of cartItems) {
        const verification = await db.downloadVerification.create({
          data: {
            productId: item.id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          },
        })
        downloadVerificationIds.push(verification.id)
      }
    } catch (e) {
      console.error("downloadVerification creation error:", e);
      return new NextResponse("downloadVerification error", { status: 500 });
    }

    try {
      await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Order Confirmation",
        react: (
          <PurchaseReceiptEmail
            order={order}
            products={order.orderItems.map((oi) => ({
              name: oi.product.name,
              imagePath: oi.product.imagePath,
              description: oi.product.description,
            }))}
            downloadVerificationIds={downloadVerificationIds}
          />
        ),
      });
    } catch (e) {
      console.error("Email send error:", e);
      // Не повертаємо помилку, щоб Stripe не повторював webhook
    }
  }

  return new NextResponse();
}
