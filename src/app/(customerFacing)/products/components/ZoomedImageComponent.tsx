import Image from "next/image";

interface Props {
  imagePath: string;
  onClose: () => void;
}

export default function ZoomedImage({ imagePath, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-0 right-2 text-white text-4xl font-extralight z-10"
      >
        ×
      </button>
      <div
        className="relative max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imagePath}
          alt="Zoomed product image"
          width={1000}
          height={1000}
          className="object-contain max-w-full max-h-screen"
        />
      </div>
    </div>
  );
}
