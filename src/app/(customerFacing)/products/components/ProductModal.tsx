import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ZoomedImage from "./ZoomedImageComponent";

interface Product {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
}

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const handleImageClick = () => setIsImageZoomed(true);
  const handleZoomClose = () => setIsImageZoomed(false);

  return (
    <>
      {isImageZoomed && (
        <ZoomedImage imagePath={product.imagePath} onClose={handleZoomClose} />
      )}

      {!isImageZoomed && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
          onClick={onClose}
        >
          <div
            className="bg-neutral-100 max-w-4xl w-full p-6 relative rounded shadow-lg overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-0 right-2 text-4xl font-extralight"
            >
              ×
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-[400px] h-[400px] overflow-hidden cursor-zoom-in">
                <Image
                  src={product.imagePath}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  width={400}
                  height={400}
                  onClick={handleImageClick}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-lg font-medium mb-2">
                  {product.priceInCents / 100} €
                </p>
                <p className="mb-4">{product.description}</p>
                <Link href={`/products/${product.id}/purchase`} onClick={onClose}>
                  <button className="px-6 py-2 font-medium border-2 border-black hover:bg-[#0059b3] hover:border-[#0059b3] hover:text-white transition w-full">
                    ADD TO CART
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
