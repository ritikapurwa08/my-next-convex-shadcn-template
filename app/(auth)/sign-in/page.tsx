"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function SignInPage() {
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
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden w-full">
      {/* ── Left: Form ── */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest relative z-10">
        <div className="w-full max-w-md space-y-10">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MaterialIcon
                  name="orbit"
                  className="text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                />
              </div>
              <h1 className="font-headline font-extrabold text-2xl tracking-tight text-primary">
                The Exam Orbit
              </h1>
            </div>
            <p className="text-secondary font-medium mt-6">
              Welcome back to your Digital Atelier.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-headline font-bold text-3xl text-on-surface">
              Sign In
            </h2>
            <p className="text-secondary text-sm">
              Continue your academic journey where you left off.
            </p>
          </div>

          {/* Form */}
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
                {/* Google logo SVG */}
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

          <p className="text-center text-sm text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-primary hover:underline decoration-2 underline-offset-4"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>

      {/* ── Right: Atmospheric Panel ── */}
      <section className="hidden md:flex flex-1 relative bg-surface-container-low overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
            alt="Modern Academic Library"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60" />
        </div>

        <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
          <div className="max-w-md bg-white/70 backdrop-blur-xl border border-white/20 p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full">
              <MaterialIcon
                name="auto_awesome"
                className="text-on-primary-fixed-variant text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-primary-fixed-variant">
                Personalized Prep
              </span>
            </div>
            <h3 className="font-headline font-extrabold text-3xl leading-tight text-on-surface">
              Elevate your learning in the{" "}
              <span className="text-primary">Digital Atelier.</span>
            </h3>
            <p className="text-secondary leading-relaxed font-medium">
              Your preparation is an art form. Join thousands of students using
              our quiet, focused ecosystem to master their exams with organic
              precision.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-white/40 rounded-2xl border border-white/40">
                <span className="block font-headline font-bold text-2xl text-primary">
                  94%
                </span>
                <span className="text-xs font-semibold text-on-surface-variant opacity-80 uppercase tracking-tighter">
                  Success Rate
                </span>
              </div>
              <div className="p-4 bg-white/40 rounded-2xl border border-white/40">
                <span className="block font-headline font-bold text-2xl text-primary">
                  50k+
                </span>
                <span className="text-xs font-semibold text-on-surface-variant opacity-80 uppercase tracking-tighter">
                  Scholars
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blurs */}
        <div className="absolute bottom-12 right-12 w-32 h-32 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
        <div className="absolute top-24 left-24 w-24 h-24 bg-tertiary-fixed/30 blur-2xl rounded-full" />
      </section>
    </main>
  );
}
