import db from "@/src/db/db";
import { formatCurrency } from "@/src/lib/formatters";
import Image from "next/image";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { Button } from "@/src/components/ui/button";
import ClearCartOnSuccess from "./ClearCart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function createDownloadVerifications(productIds: string[]) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const verifications = await Promise.all(
    productIds.map(async (productId) => {
      const verification = await db.downloadVerification.create({
        data: { productId, expiresAt },
      });
      return { productId, verificationId: verification.id };
    })
  );
  return verifications;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string }>;
}) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent;
  if (!paymentIntentId) return notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!paymentIntent.metadata.cart) return notFound();

  let cartItems: { id: string; quantity: number }[];

  try {
    cartItems = JSON.parse(paymentIntent.metadata.cart);
  } catch {
    return notFound();
  }

  const productIds = cartItems.map((item) => item.id);

  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  if (!products || products.length === 0) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";
  let downloadVerifications: { productId: string; verificationId: string }[] =
    [];

  if (isSuccess) {
    downloadVerifications = await createDownloadVerifications(productIds);
  }

  return (
    <div className="grid gap-6">
      <ClearCartOnSuccess />

      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      {products.map((product) => {
        const verification = downloadVerifications.find(
          (v) => v.productId === product.id
        );
        return (
          <div key={product.id} className="flex gap-10 items-center">
            <div className="aspect-square w-1/5 object-contain relative">
              <Image
                src={product.imagePath}
                fill
                alt={product.name}
                className="object-cover object-center rounded-md"
              />
            </div>
            <div>
              <div className="text-lg">
                {formatCurrency(product.priceInCents / 100)}
              </div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="line-clamp-3 text-muted-foreground">
                {product.description}
              </div>
              <Button className="mt-4" size="lg" asChild>
                {isSuccess && verification ? (
                  <a href={`/products/download/${verification.verificationId}`}>
                    Download
                  </a>
                ) : (
                  <span>Unavailable</span>
                )}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
