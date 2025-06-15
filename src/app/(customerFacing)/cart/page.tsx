"use client";

import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useAuth } from "@/src/hooks/use-auth";
import { formatCurrency } from "@/src/lib/formatters";
import { addToCart, removeFromCart } from "@/src/redux/slices/cartSlice";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PurchasePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, cartItems, itemsPrice } = useSelector((state) => state.cart);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const [checkoutDisabled, setCheckoutDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("CHECKOUT");

  const { isAuth } = useAuth();

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const addToCartHandler = async (product: Product, qty: number) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const goToCheckout = () => {
    const cartParam = encodeURIComponent(JSON.stringify(cartItems));
    setCheckoutDisabled(true);
    setButtonText("REDIRECTING...");

    if (!isAuth) {
      setShowAuthMessage(true);
      setTimeout(() => {
        router.push(`/account/?redirect=/purchase-cart?cart=${cartParam}`);
      }, 2000);
      return;
    }
    setShowAuthMessage(false);
    setCheckoutDisabled(false);
    setButtonText("CHECKOUT");
    router.push(`/purchase-cart?cart=${cartParam}/`);
  };

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">SHOPPING CART</h1>

      {!loading ? (
        <div>Loading...</div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-8 mt-10">
          <p>CART IS EMPTY</p>
          <Link href="/products">
            <button className="px-6 py-2 font-medium border-2 border-black hover:bg-[#0059b3] hover:border-[#0059b3] hover:text-white transition w-full">
              GO SHOPPING
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item: Product) => (
                <TableRow key={item.id}>
                  <TableCell className="flex items-center gap-4 py-4">
                    <Image
                      src={item.imagePath}
                      alt={item.name}
                      className="w-30 h-30 object-cover rounded"
                      width={120}
                      height={120}
                    />
                    <span className="font-medium">{item.name}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => addToCartHandler(item, item.qty - 1)}
                        disabled={item.qty === 1}
                        className="text-xl px-2 disabled:text-gray-400"
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => addToCartHandler(item, item.qty + 1)}
                        className="text-xl px-2"
                      >
                        +
                      </button>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(item.priceInCents / 100)}
                  </TableCell>

                  <TableCell className="text-center">
                    <button
                      onClick={() => removeFromCartHandler(item.id)}
                      className="text-gray-500 hover:text-red-600 text-xl"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 border-t pt-4 flex flex-col items-start gap-4">
            <p className="text-xl font-semibold">
              Total: {formatCurrency(itemsPrice / 100)}
            </p>
            <Button
              className="w-full md:w-64 border-2 border-black bg-white text-black hover:bg-[#0059b3] hover:border-[#0059b3] hover:text-white transition "
              size="lg"
              disabled={checkoutDisabled}
              onClick={goToCheckout}
              type="button"
            >
              {buttonText}
            </Button>

            {showAuthMessage && (
              <div className="text-red-400">
                To proceed to payment, please log in or sign up.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
