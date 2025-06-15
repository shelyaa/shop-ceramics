"use client";

import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { formatCurrency } from "@/src/lib/formatters";
import { userOrderExists } from "@/src/app/actions/orders";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

type Product = {
  id: string;
  name: string;
  imagePath: string;
  description: string;
  priceInCents: number;
};

type CartItem = {
  id: string;
  qty: number;
  priceInCents: number;
};

export function CheckoutCartForm({
  products,
  cartItems,
  clientSecret,
}: {
  products: Product[];
  cartItems: CartItem[];
  clientSecret: string;
}) {
  const totalPrice = cartItems.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.id);
    return acc + (product?.priceInCents || 0) * item.qty;
  }, 0);

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6">
      <h2 className="text-3xl font-bold">Your Cart</h2>
      <div className="grid grid-cols-1  gap-4">
        {cartItems.map((item) => {
          const product = products.find((p) => p.id === item.id);
          if (!product) return null;
          return (
            <Card key={product.id} className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-1/3 aspect-video">
                <Image
                  src={product.imagePath}
                  alt={product.name}
                  fill
                  className="object-cover rounded-l-md"
                />
              </div>
              <div className="flex flex-col justify-between p-4 w-full">
                <div>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div>
                  <span className="font-bold">
                    {item.qty} × {formatCurrency(product.priceInCents / 100)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Elements  options={{ clientSecret, locale: "en" }} stripe={stripePromise}>
        <Form totalPrice={totalPrice} cartItems={cartItems} />
      </Elements>
    </div>
  );
}

function Form({
  totalPrice,
  cartItems,
}: {
  totalPrice: number;
  cartItems: CartItem[];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    const alreadyPurchased = await Promise.all(
      cartItems.map((item) => userOrderExists(email, item.id))
    );

    if (alreadyPurchased.some((exists) => exists)) {
      setErrorMessage(
        "At least one of these products has already been purchased. Please visit My Orders."
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <div className="px-4">
          <PaymentElement />
        </div>
        <div className="px-4 mt-4">
          <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
        </div>
        <CardContent />
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={isLoading || !stripe || !elements}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase All - ${formatCurrency(totalPrice / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
