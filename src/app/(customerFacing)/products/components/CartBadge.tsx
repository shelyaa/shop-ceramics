'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store'; 

export const CartBadge = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalQty = cartItems.reduce((a, c) => a + c.qty, 0);

  return (
    <Link href="/purchase" aria-label="Кошик" className="relative">
      <ShoppingBag className="w-6 h-6" />
      {totalQty > 0 && (
        <div className="absolute -bottom-1 -right-2 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center">
          {totalQty}
        </div>
      )}
    </Link>
  );
};
