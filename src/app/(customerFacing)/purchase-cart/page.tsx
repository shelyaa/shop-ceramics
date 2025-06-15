// app/purchase-cart/page.tsx

import Stripe from "stripe";
import db from "@/src/db/db";
import { notFound } from "next/navigation";
import { CheckoutCartForm } from "./_components/CheckoutCartForm";

export const dynamicParams = true;


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});

export default async function PurchaseCartPage({
  searchParams,
}: {
  searchParams: { cart: string };
}) {
  if (!searchParams.cart) return notFound();

  let cartItems;
  try {
    cartItems = JSON.parse(decodeURIComponent(searchParams.cart)) as {
      id: string;
      qty: number;
      priceInCents: number;
    }[];
  } catch {
    return notFound();
  }

  const productIds = cartItems.map((item) => item.id);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  const totalAmount = cartItems.reduce((acc, item) => {
    const price = products.find((p) => p.id === item.id)?.priceInCents || 0;
    return acc + price * item.qty;
  }, 0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: "usd",
    metadata: {
      cart: JSON.stringify(cartItems.map((item) => item.id)),
    },
  });

  if (!paymentIntent.client_secret) throw new Error("Stripe error");

  return (
    <CheckoutCartForm
      products={products}
      cartItems={cartItems}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
