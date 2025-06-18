import { addToCart } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { Product } from "@prisma/client";

type Props = {
  product: Product;
  onClose: () => void;
};

export default function AddToCart({ product, onClose }: Props) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    onClose();
  };
  
  return (
    <button
      className="px-6 py-2 font-medium border-2 border-black hover:bg-[#0059b3] hover:border-[#0059b3] hover:text-white transition w-ful rounded-sm"
      onClick={(e) => {
        e.stopPropagation();
        handleAddToCart();
      }}
    >
      ADD TO CART
    </button>
  );
}
