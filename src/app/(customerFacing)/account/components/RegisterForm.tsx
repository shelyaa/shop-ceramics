import { Button } from "@/src/components/ui/button";
import { getFirebaseApp } from "@/src/firebase";
import { setUser } from "@/src/redux/slices/userSlice";
import { browserLocalPersistence, createUserWithEmailAndPassword, getAuth, setPersistence } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    getFirebaseApp();
  }, []);

  const validate = () => {
    if (!email || !password || !checkPassword) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return false;
    }
    if (password !== checkPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleRegister = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence);
        try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.refreshToken,
        })
      );
      router.push("/account/my-account");
    } catch (err: unknown) {
      let msg = "Registration failed. Please try again.";
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        typeof (err as { code: string }).code === "string"
      ) {
        const code = (err as { code: string }).code;
        if (code === "auth/email-already-in-use") {
          msg = "Email is already in use.";
        } else if (code === "auth/invalid-email") {
          msg = "Invalid email address.";
        } else if (code === "auth/weak-password") {
          msg = "Password should be at least 6 characters.";
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      handleRegister(email, password);
    }
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm py-1">{error}</div>
      )}
      <Button className="w-full" size="lg" disabled={loading} type="submit">
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}