"use server";
import db from "@/src/db/db";

// Перевіряє, чи користувач вже купував певний продукт
export async function userOrderExists(email: string, productId: string) {
  return (
    (await db.order.findFirst({
      where: {
        user: { email },
        orderItems: {
          some: { productId },
        },
      },
      select: { id: true },
    })) != null
  );
}