'use client'
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex  justify-center bg-white">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">MY ACCOUNT</h1>

        <div className="flex justify-center mb-6 space-x-6 bg-gray-100 p-1 rounded-full">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              isLogin ? "bg-white shadow text-black" : "text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              !isLogin ? "bg-white shadow text-black" : "text-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        <div className="bg-gray-100 rounded-xl p-6">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
