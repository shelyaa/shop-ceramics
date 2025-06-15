import { ProductCard, ProductCardSkeleton } from "@/src/components/ProductCard";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";

type ProductGridSectionProps = {
  productsFetcher: () => Promise<Product[]>;
  title: string;
};

export function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="outline" asChild className="hover:bg-[#0059b3] hover:text-white rounded-md">
          <Link href="/products" className="space-x-2 ">
            <span >VIEW ALL</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense
            productsFetcher={productsFetcher}
          />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  const products = await productsFetcher(); 

  return (
    <>
      {products.map((product) => (
        <div key={product.id} >
          <ProductCard {...product}  /> 
        </div>
      ))}
    </>
  );
}