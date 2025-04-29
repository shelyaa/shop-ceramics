import Image from "next/image";
import heroImage from "@/src/assets/sticker.webp"; // заміни на свій шлях

export default function Hero() {
  return (
    <section className="relative bg-[#e6e6ff] px-6 py-20 lg:px-16 overflow-hidden">
      <div className="max-w-screen-xl mx-auto relative z-10">
        <h1 className="text-[5rem] leading-[1.1] font-semibold tracking-tight text-black whitespace-pre-line">
          {"OBJECTS OF EARTH\nCRAFTED BY HAND\n{ IN ODESA }"}
        </h1>
        <p className="mt-10 text-lg max-w-md text-black-700">
          Formed by hands, shaped by fire.
        </p>

        <div className="mt-12">
          <a
            href="/collections"
            className="inline-block bg-black text-white px-8 py-4 text-base font-semibold rounded-full hover:bg-neutral-800 transition"
          >
            EXPLORE COLLECTION
          </a>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 top-0 w-1/2 z-0 flex items-center justify-end pr-12">
        <Image
          src={heroImage}
          alt="Ceramic artwork"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>
    </section>
  );
}
