"use client";

import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { formatCurrency } from "@/src/lib/formatters";
import { userOrderExists } from "@/src/app/actions/orders";
import { useAuth } from "@/src/hooks/use-auth";
import { Input } from "@/src/components/ui/input";
import { Label } from "@radix-ui/react-label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import citiesRaw from "../../../../data/cities.json";
import { motion, AnimatePresence } from "framer-motion";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

type Product = {
  id: string;
  name: string;
  imagePath: string;
  description: string;
  priceInCents: number;
};

type CartItem = {
  id: string;
  quantity: number;
  priceInCents: number;
};

export function CheckoutCartForm({
  products,
  cartItems,
  clientSecret,
}: {
  products: Product[];
  cartItems: CartItem[];
  clientSecret: string;
}) {
  const totalPrice = cartItems.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.id);
    return acc + (product?.priceInCents || 0) * item.quantity;
  }, 0);

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6">
      <h2 className="text-3xl font-bold">Your Cart</h2>
      <div className="grid grid-cols-1  gap-4">
        {cartItems.map((item) => {
          const product = products.find((p) => p.id === item.id);
          if (!product) return null;
          return (
            <Card key={product.id} className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-1/3 aspect-video">
                <Image
                  src={product.imagePath}
                  alt={product.name}
                  fill
                  className="object-cover rounded-l-md"
                />
              </div>
              <div className="flex flex-col justify-between p-4 w-full">
                <div>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div>
                  <span className="font-bold">
                    {item.quantity} ×{" "}
                    {formatCurrency(product.priceInCents / 100)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })} 
      </div>

      <UserInfoForm />

      <Elements options={{ clientSecret, locale: "en" }} stripe={stripePromise}>
        <Form totalPrice={totalPrice} cartItems={cartItems} />
      </Elements>
    </div>
  );
}

function Form({
  totalPrice,
  cartItems,
}: {
  totalPrice: number;
  cartItems: CartItem[];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { email } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    const alreadyPurchased = await Promise.all(
      cartItems.map((item) => userOrderExists(email, item.id))
    );

    if (alreadyPurchased.some((exists) => exists)) {
      setErrorMessage(
        "At least one of these products has already been purchased. Please visit My Orders."
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        } 
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <div className="px-4">
          <PaymentElement />
        </div>
        <div className="px-4 mt-4">
          <LinkAuthenticationElement
            options={{
              defaultValues: { email: email || "" },
            }}
          />
        </div>
        <CardContent />
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={isLoading || !stripe || !elements}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase All - ${formatCurrency(totalPrice / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

type City = {
  object_name: string;
  object_category: string;
};

function capitalize(str: string) {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

const cities = citiesRaw as City[];
const cityNames = Array.from(
  new Set(
    cities
      .filter((c) => c.object_category === "Місто")
      .map((city) => capitalize(city.object_name))
  )
);


function UserInfoForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [deliveryDepartment, setDeliveryDepartment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formIsOpen, setFormIsOpen] = useState(true);

  // Валідація
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = "Введіть ім'я";
    if (!lastName.trim()) newErrors.lastName = "Введіть прізвище";
    if (!city.trim()) newErrors.city = "Оберіть місто";
    if (!deliveryDepartment.trim()) newErrors.deliveryDepartment = "Введіть номер відділення";
    if (!/^\+380\d{9}$/.test(phoneNumber)) newErrors.phoneNumber = "Введіть коректний телефон";
    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // API-запит для запису даних юзера в БД
      const res = await fetch("/api/user-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          city,
          deliveryDepartment,
          phoneNumber,
        }),
      });
      if (!res.ok) throw new Error("Помилка при збереженні даних");

      setFormIsOpen(false);
    } catch (err: any) {
      setSubmitError(err.message || "Щось пішло не так");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Shipping</CardTitle>
            {!formIsOpen && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormIsOpen(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <AnimatePresence initial={false}>
          {formIsOpen && (
            <motion.div
              key="form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                  {errors.firstName && <div className="text-destructive text-xs">{errors.firstName}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    
                  />
                  {errors.lastName && <div className="text-destructive text-xs">{errors.lastName}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <PhoneInput
                    country="ua"
                    inputClass="w-full"
                    value={phoneNumber}
                    onChange={phone => setPhoneNumber("+" + phone)}
                    inputProps={{ required: true, name: "phone", id: "phone" }}
                  />
                  {errors.phoneNumber && <div className="text-destructive text-xs">{errors.phoneNumber}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Місто доставки</Label>
                  <Autocomplete
                    options={cityNames}
                    value={city}
                    onChange={(_, value) => setCity(value || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="city"
                        
                        placeholder="Оберіть місто"
                        error={!!errors.city}
                        helperText={errors.city}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDepartment">Відділення доставки</Label>
                  <Input
                    id="deliveryDepartment"
                    name="deliveryDepartment"
                    value={deliveryDepartment}
                    onChange={e => setDeliveryDepartment(e.target.value)}
                    required
                  />
                  {errors.deliveryDepartment && <div className="text-destructive text-xs">{errors.deliveryDepartment}</div>}
                </div>
                {submitError && <div className="text-destructive text-xs">{submitError}</div>}
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Збереження..." : "Перейти до оплати"}
                </Button>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </form>
  );
}
