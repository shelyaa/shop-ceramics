import Hero from "@/src/components/Hero";
import db from "@/src/db/db";
import { cache } from "@/src/lib/cache";

import { ProductGridSection } from "./products/components/ProductGridSection";

const getMostPopularProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orderItems: { _count: "desc" } },
    take: 6,
  });
}, ["/", "getMostPopularProducts"], {revalidate: 60 * 60 * 24});

const  getNewestProducts = cache(() => {
    return db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      });
}, ["/", "getNewestProducts"]) 
  

export default function HomePage() {
  return (
    <>
   <main className="space-y-12">
   <Hero />
   <ProductGridSection
     title="MOST POPULAR"
     productsFetcher={getMostPopularProducts}
   />
   <ProductGridSection title="NEWEST" productsFetcher={getNewestProducts} />
 </main>
 </>
  );
}

