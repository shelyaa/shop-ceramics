"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { formatCurrency } from "@/src/lib/formatters";
import { Label } from "@radix-ui/react-label";
import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addProduct, updateProduct } from "../../_actions/products";
import React from "react";
import { Product } from "@prisma/client";
import Image from "next/image";

export function ProductForm({ product }: { product?: Product | null }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    priceInCents: product?.priceInCents || "",
    category: product?.category || "MUG",
    description: product?.description || "",
  });

  const [error, action] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      return product == null
        ? addProduct(prevState, formData)
        : updateProduct(product.id, prevState, formData);
    },
    {}
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "priceInCents" ? Number(value) : value,
    }));
  };

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={formData.priceInCents}
          onChange={handleChange}
        />
        <div className="text-muted-foreground">
          {formatCurrency(Number(formData.priceInCents || 0) / 100)}
        </div>
        {error.priceInCents && (
          <div className="text-destructive">{error.priceInCents}</div>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        >
          <option value="MUG">Mug</option>
          <option value="GLASS">Glass</option>
          <option value="TEASET">Tea set</option>
          <option value="DECORATION">Decoration</option>
          <option value="VASE">Vase</option>
          <option value="SCULPTURE">Sculpture</option>
          <option value="OTHER">Other</option>
        </select>
        {error.category && (
          <div className="text-destructive">{error.category}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product && (
          <div className="text-muted-foreground">{product.filePath}</div>
        )}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product && (
          <Image
            src={product.imagePath}
            height="400"
            width="400"
            alt="Product Image"
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
