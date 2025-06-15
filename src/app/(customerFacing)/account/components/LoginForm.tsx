import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseApp } from "@/src/firebase";
import { setUser } from "@/src/redux/slices/userSlice";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    getFirebaseApp(); 
  }, []);

  const validate = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return false;
    }
    // Basic email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.refreshToken,
        })
      );
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/account/my-account");
      }
    } catch (err: unknown) {
      let msg = "Login failed. Please try again.";
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        typeof (err as { code: string }).code === "string"
      ) {
        const code = (err as { code: string }).code;
        if (code === "auth/user-not-found" || code === "auth/wrong-password") {
          msg = "Invalid email or password.";
        } else if (code === "auth/too-many-requests") {
          msg = "Too many failed attempts. Please try again later.";
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
      handleLogin(email, password);
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
      {error && (
        <div className="text-red-600 text-sm py-1">{error}</div>
      )}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}