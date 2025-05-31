import { Button } from "@/src/components/ui/button";
import { getFirebaseApp } from "@/src/firebase";
import { setUser } from "@/src/redux/slices/userSlice";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useDispatch } from "react-redux";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    getFirebaseApp();
  }, []);

  const handleRegister = (email: string, password: string) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        console.log(user);
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.refreshToken,
          })
        );
        router.push("/account/my-account");
      })
      .catch(console.error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(email, password);
  };

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
          placeholder="Repeat password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" size="lg" disabled={pending} type="submit">
      {pending ? "Sending..." : "Register"}
    </Button>
  );
}
