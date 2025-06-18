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
  searchParams: any;
}) {
  const { cart } = await searchParams;

  if (!cart) return notFound();

  let cartItems;
  try {
    cartItems = JSON.parse(decodeURIComponent(cart)) as {
      id: string;
      quantity: number;
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
    return acc + price * item.quantity;
  }, 0);
  const minimalCart = cartItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: "usd",
    metadata: {
      cart: JSON.stringify(minimalCart),
    },
  });

  if (!paymentIntent.client_secret) throw new Error("Stripe error");

  return (
    <div>
      <CheckoutCartForm
        products={products}
        cartItems={cartItems}
        clientSecret={paymentIntent.client_secret}
      />
    </div>
  );
}
