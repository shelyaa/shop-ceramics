"use client";

import { useAppDispatch } from "@/src/hooks/redux-hooks";
import { clearCart } from "@/src/redux/slices/cartSlice";
import { useEffect } from "react";

export default function ClearCartOnSuccess() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return null; 
}