"use client";
import { Nav, NavLink } from "@/src/components/Nav";
import logoSrc from "@/src/assets/svitanok.svg";
import Image from "next/image";
import Link from "next/link";
import { Menu, User, X } from "lucide-react";
import { ProductModalProvider } from "./context/ProductModalContext";
import { CartBadge } from "./products/components/CartBadge";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Nav>
        <div className="container mx-auto flex items-center justify-between py-3">
          <Link href="/">
            <Image
              src={logoSrc}
              alt="svitanok logo"
              width={110}
              height={110}
              priority
            />
          </Link>

          <div className="hidden md:flex gap-6 font-semibold uppercase">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
          </div>

          <div className="flex space-x-6">
            <CartBadge />
            <Link href="/account" aria-label="Аккаунт" className="relative">
              <User className="w-6 h-6" />
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </Nav>
      
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 mt-4 bg-white shadow-md py-4 font-semibold uppercase">
          <NavLink href="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink href="/products" onClick={() => setMenuOpen(false)}>
            Products
          </NavLink>
       
        </div>
      )}

      <div className="container mx-auto my-4 flex justify-center mt-25">
        <ProductModalProvider>
          <div className="w-full max-w-7xl">{children}</div>
        </ProductModalProvider>
      </div>

      
    </>
  );
}
