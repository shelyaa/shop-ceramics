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
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function MyAccount() {
  const [data, action] = useActionState(emailOrderHistory, {});
  const {email} = useAuth();

  return (
    <form action={action} className="max-2-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My Order</CardTitle>
          <CardDescription>
            Enter your email and we will email you your order history and
            download links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" required name="email" id="email" value={email}/>
            {data.error && <div className="text-destructive">{data.error}</div>}
          </div>
        </CardContent>
        <CardFooter>
          {data.message ? <p>{data.message}</p> : <SubmitButton />}
        </CardFooter>
      </Card>
    </form>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" size="lg" disabled={pending} type="submit">
        {pending ? "Sending..." : "Send"}
      </Button>
    );
  }

  <button className="button">Купити</button>
  

  