"use client";
import { emailOrderHistory } from "@/src/actions/orders";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useAuth } from "@/src/hooks/use-auth";
import { removeUser } from "@/src/redux/slices/userSlice";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useDispatch } from "react-redux";

export default function MyAccount() {
  const [data, action] = useActionState(emailOrderHistory, {});
  const { email } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    dispatch(removeUser());
    router.push("/account");
  };

  const initials = email
    ? email
        .split("@")[0]
        .split(/[._]/)
        .map((v) => v[0]?.toUpperCase())
        .join("")
        .slice(0, 2)
    : "U";

  return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-12">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          {/* Кружечок як фото профілю */}
          <div className="w-14 h-14 rounded-full bg-[#0059b3] flex items-center justify-center text-2xl font-bold text-white shadow">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">My Account</h1>
            <div className="text-lg font-semibold">{email}</div>
          </div>
        </div>
        <form action={action} className="mb-8">
          <Card className="border-2 border-gray-200 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl mb-1">My Order</CardTitle>
              <CardDescription className="text-base">
                Enter your email and we will email you your order history and download links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">Email</Label>
                <Input
                  type="email"
                  required
                  name="email"
                  id="email"
                  value={email}
                  className="rounded-lg border-gray-300"
                
                />
                {data.error && (
                  <div className="text-destructive">{data.error}</div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {data.message ? (
                <p className="text-green-600">{data.message}</p>
              ) : (
                <SubmitButton />
              )}
            </CardFooter>
          </Card>
        </form>
        <Button
          onClick={handleLogout}

        >
          Log out from account
        </Button>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full "
      size="lg"
      disabled={pending}
      type="submit"
    >
      {pending ? "Sending..." : "Send"}
    </Button>
  );
}