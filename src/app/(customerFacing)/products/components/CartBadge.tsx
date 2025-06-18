'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store'; 
import { useEffect, useState } from 'react';

export const CartBadge = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalQty = cartItems.reduce((a, c) => a + c.quantity, 0);

  return (
    <Link href="/cart" aria-label="Кошик" className="relative">
      <ShoppingBag className="w-6 h-6" />
      {/* Рендер бейдж тільки після монтування, щоб уникнути розбіжності */}
      {mounted && totalQty > 0 && (
        <div className="absolute -bottom-1 -right-2 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center">
          {totalQty}
        </div>
      )}
    </Link>
  );
};