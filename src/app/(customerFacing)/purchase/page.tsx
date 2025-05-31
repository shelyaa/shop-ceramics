"use client";

import { Button } from "@/src/components/ui/button";
import { formatCurrency } from "@/src/lib/formatters";
import { addToCart, removeFromCart } from "@/src/redux/slices/cartSlice";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function PurchasePage() {
  const dispatch = useDispatch();
  const { loading, cartItems, itemsPrice } = useSelector((state) => state.cart);

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const addToCartHandler = async (product: Product, qty: number) => {
    dispatch(addToCart({ ...product, qty }));
  };

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">SHOPPING CART</h1>
      {!loading ? (
        <div>Loading...</div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-8 mt-10">
          <p className="">CART IS EMPTY</p>

          <Link href="/products">
            <button className="px-6 py-2 font-medium border-2 border-black hover:bg-[#0059b3] hover:border-[#0059b3] hover:text-white transition w-full">
              GO SHOPPING
            </button>
          </Link>
        </div>
      ) : (
        <div className="">
            <div className="md:col-span-3 space-y-6">
              {cartItems.map((item: Product) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-6"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.imagePath}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                      width={100}
                      height={100}
                    />
                    <div>
                      <h2 className="font-semibold">{item.name}</h2>
                      
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
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

                  <p className="font-medium w-16 text-right">
                    {formatCurrency(item.priceInCents / 100)}
                  </p>

                  <button
                    onClick={() => removeFromCartHandler(item.id)}
                    className="text-gray-500 hover:text-red-600 text-xl"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT side: Summary */}
            <div className="border-t md:border-none mt-4 md:pt-0 flex flex-col gap-4 w-100">
               <p className="text-xl font-semibold">Total: {formatCurrency(itemsPrice / 100)}</p>

              <Button className="w-full border-2 border-black bg-white text-black hover:bg-black hover:text-white transition">
                CHECKOUT
              </Button>
            </div>
          </div>
      )}
    </div>
  );
}
