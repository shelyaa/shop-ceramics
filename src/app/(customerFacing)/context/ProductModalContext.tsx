"use client";

import { createContext, useContext, useState } from "react";
import ProductModal from "../products/components/ProductModal";


interface Product {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
}

interface ModalContextProps {
  selectedProduct: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
}

const ProductModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useProductModal = () => {
  const context = useContext(ProductModalContext);
  if (!context) throw new Error("useProductModal must be used within ProductModalProvider");
  return context;
};

export const ProductModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openModal = (product: Product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return (
    <ProductModalContext.Provider value={{ selectedProduct, openModal, closeModal }}>
      {children}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </ProductModalContext.Provider>
  );
};

