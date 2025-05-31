import { ProductCardSkeleton } from "@/src/components/ProductCard";
import { Suspense } from "react";
import ProductsSuspense from "@/src/app/(customerFacing)/products/components/ProductsSuspense";

export default function ProductsPage() {
  return (
    <div>
      
      <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
      >
        <ProductsSuspense />
      </Suspense>
      
    </div>
  );
}
