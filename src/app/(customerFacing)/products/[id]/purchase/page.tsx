import db from "@/src/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { CheckoutForm } from "./_components/CheckoutForm";

export const dynamicParams = true;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});

type PurchasePageProps = {
  params: { id: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export default async function PurchasePage({ params }: PurchasePageProps) {
  const product = await db.product.findUnique({
    where: { id: params.id },
  });

  if (!product) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id },
  });

  if (!paymentIntent.client_secret) {
    throw new Error("Stripe failed to create payment intent");
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}