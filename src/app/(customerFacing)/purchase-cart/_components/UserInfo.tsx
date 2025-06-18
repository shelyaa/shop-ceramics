"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";

export function UserInfo() {
  return <Form />;
}

function Form() {
  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className="text-destructive"></CardDescription>
        </CardHeader>
        <div className="px-4"></div>
        <div className="px-4 mt-4"></div>
        <CardContent />
        <CardFooter>
          <Button className="w-full" size="lg">
            sdc
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
