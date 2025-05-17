import { ProductCardFilterClient } from "@/src/app/(customerFacing)/products/ProductCardFilterClient";
import { cache } from "@/src/lib/cache";
import db from "@/src/db/db";

const getProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      priceInCents: true,
      description: true,
      imagePath: true,
    },
  });
}, ["/products", "getProducts"]);

export default async function ProductsSuspense() {
  const products = await getProducts();
  return <ProductCardFilterClient products={products} />;
}
