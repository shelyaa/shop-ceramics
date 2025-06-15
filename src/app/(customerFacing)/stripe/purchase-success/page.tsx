import db from "@/src/db/db";
import { formatCurrency } from "@/src//lib/formatters";
import Image from "next/image";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );
  if (!paymentIntent.metadata.cart) return notFound();

  let productIds: string[];
  try {
    productIds = JSON.parse(paymentIntent.metadata.cart);
  } catch {
    return notFound();
  }

  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="grid gap-6">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      {products.map((product) => (
        <div key={product.id} className="flex gap-4 items-center">
          <div className="aspect-video flex-shrink-0 w-1/3 relative">
            <Image
              src={product.imagePath}
              fill
              alt={product.name}
              className="object-cover rounded-md"
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
          </div>
        </div>
      ))}
    </div>
  );
}

// async function createDownloadVerification(productId: string) {
//   return (
//     await db.downloadVerification.create({
//       data: {
//         productId,
//         expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
//       },
//     })
//   ).id;
// }
