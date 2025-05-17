"use client";

import { useState } from "react";
import { ProductCard } from "@/src/components/ProductCard";
import { Category } from "@prisma/client";

type CategoryGroupKey =
  | "All"
  | "Mugs & Glasses"
  | "Tea Sets"
  | "Sculptures & Vases"
  | "Decorations"
  | "Other";

const categoryGroups: Record<CategoryGroupKey, Category[]> = {
  All: [],
  "Mugs & Glasses": [Category.MUG, Category.GLASS],
  "Tea Sets": [Category.TEASET],
  Decorations: [Category.DECORATION],
  "Sculptures & Vases": [Category.SCULPTURE, Category.VASE],
  Other: [Category.OTHER],
};

const categories = Object.keys(categoryGroups) as CategoryGroupKey[];

interface Product {
  id: string;
  name: string;
  category: Category;
  priceInCents: number;
  description: string;
  imagePath: string;
}

export function ProductCardFilterClient({ products }: { products: Product[] }) {
  const [activeGroup, setActiveGroup] = useState<CategoryGroupKey>("All");

  const filtered =
    activeGroup === "All"
      ? products
      : products.filter((p) =>
          categoryGroups[activeGroup].includes(p.category)
        );

  return (
    <>
      <div className="flex justify-center border border-black divide-x divide-black rounded overflow-hidden mb-6 flex-wrap">
        {categories.map((groupName) => (
          <button
            key={groupName}
            onClick={() => setActiveGroup(groupName)}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition 
              ${
                activeGroup === groupName
                  ? "bg-[#0059b3] text-white"
                  : "text-black hover:bg-neutral-200"
              }`}
          >
            {groupName.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="cursor-pointer"
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>

    </>
  );
}
