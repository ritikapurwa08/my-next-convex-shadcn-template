"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { MaterialIcon } from "@/components/ui/material-icon";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, password, flow: "signIn" });
      router.push("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => signIn("google");

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-on-surface-variant"
            htmlFor="email"
          >
            Email address
          </label>
          <div className="relative">
            <MaterialIcon
              name="mail"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none"
            />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-200 placeholder:text-outline-variant text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              className="block text-sm font-semibold text-on-surface-variant"
              htmlFor="password"
            >
              Password
            </label>
            <Link
              href="#"
              className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <MaterialIcon
              name="lock"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none"
            />
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-200 placeholder:text-outline-variant text-sm"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-error-container/20 border border-error/20 rounded-xl text-sm text-error">
          <MaterialIcon name="error" className="text-base shrink-0" />
          {error}
        </div>
      )}

      {/* CTA */}
      <div className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-linear-to-br from-primary to-primary-container text-white font-headline font-bold rounded-xl shadow-[0_12px_32px_-4px_rgba(0,63,177,0.2)] active:scale-[0.98] disabled:opacity-60 transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="relative py-4 flex items-center gap-4">
          <div className="grow h-px bg-surface-container-high" />
          <span className="text-xs text-outline uppercase font-bold tracking-widest">
            or
          </span>
          <div className="grow h-px bg-surface-container-high" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full py-3 flex items-center justify-center gap-3 bg-surface-container-low text-on-surface font-semibold rounded-xl hover:bg-surface-container-high transition-colors active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </form>
  );
}
