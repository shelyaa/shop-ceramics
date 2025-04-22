import { Nav, NavLink } from "@/src/components/Nav";

export const dynamic = 'force-dynamic';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <Nav>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/collections">Collections</NavLink>
      <NavLink href="/products">Products</NavLink>
      <NavLink href="/orders">My Orders</NavLink>
    </Nav>
    <div className="container mx-auto my-4 flex justify-center px-4">
        <div className="w-full max-w-7xl">{children}</div>
      </div>
  </>;
}
