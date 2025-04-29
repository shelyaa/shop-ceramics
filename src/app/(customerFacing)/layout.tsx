import { Nav, NavLink } from "@/src/components/Nav";
import logoSrc from "@/src/assets/svitanok.svg";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react"; // або будь-які інші іконки

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <div className="container mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <Image src={logoSrc} alt="svitanok logo" width={110} height={110} priority />
          </Link>

          <div className="flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/collections">Collections</NavLink>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/orders">My Orders</NavLink>
          </div>

          <div className="flex space-x-6">
            <Link href="/favorites" aria-label="Обране">
              <Heart className="w-6 h-6" />
            </Link>
            <Link href="/cart" aria-label="Кошик">
              <ShoppingBag className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </Nav>

      <div className="container mx-auto my-4 flex justify-center">
        <div className="w-full max-w-7xl">{children}</div>
      </div>
    </>
  );
}