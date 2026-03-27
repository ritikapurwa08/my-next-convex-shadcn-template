"use client";

import { useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { profileImages } from "@/components/profile/profile-images";
import AvatarPicker from "@/components/profile/avatar-selector";

export default function SignUpPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<StaticImageData | undefined>();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    if (!avatar) {
      setError("Please select an avatar to personalise your profile");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signIn("password", {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        image: avatar.src,
        flow: "signUp",
      });
      router.push("/");
    } catch {
      setError("Signup failed. This email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => signIn("google");

  return (
    <main className="flex min-h-screen w-full">
      {/* ── Left: Visual Panel ── */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-on-surface">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=2000&auto=format&fit=crop"
            alt="The Exam Orbit Inspiration"
            fill
            className="object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-tr from-primary/40 to-transparent z-10" />

        <div className="relative z-20 flex flex-col justify-between p-16 w-full">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <MaterialIcon
                name="auto_awesome"
                className="text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
            </div>
            <span className="font-headline font-extrabold text-2xl text-white tracking-tight">
              The Exam Orbit
            </span>
          </div>

          {/* Hero text */}
          <div className="max-w-md">
            <h1 className="font-headline font-extrabold text-5xl text-white leading-tight mb-6">
              Your Academic Journey, Redefined.
            </h1>
            <p className="text-white/80 text-lg font-body leading-relaxed">
              Step into a digital atelier designed for focus, precision, and
              mastery. Align your goals with our celestial guidance system.
            </p>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-primary/40 flex items-center justify-center overflow-hidden"
                >
                  {profileImages[i] && (
                    <Image
                      src={profileImages[i]}
                      alt=""
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-white/90 text-sm font-medium">
              Joined by 12,000+ scholars this month
            </p>
          </div>
        </div>
      </section>

      {/* ── Right: Form ── */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-surface overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MaterialIcon
                name="auto_awesome"
                className="text-white text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
            </div>
            <span className="font-headline font-bold text-xl text-primary">
              The Exam Orbit
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-headline font-extrabold text-3xl text-on-surface">
              Create an account
            </h2>
            <p className="text-secondary font-body">
              Begin your orbit towards academic excellence.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Avatar picker */}
            <div className="flex flex-col items-center gap-3 py-2">
              <AvatarPicker
                images={profileImages}
                value={avatar}
                onChange={setAvatar}
              />
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-on-surface-variant"
                  htmlFor="first_name"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  required
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-secondary/50 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-on-surface-variant"
                  htmlFor="last_name"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-secondary/50 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-on-surface-variant"
                htmlFor="sign-up-email"
              >
                Email Address
              </label>
              <div className="relative">
                <MaterialIcon
                  name="mail"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl pointer-events-none"
                />
                <input
                  id="sign-up-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-secondary/50 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-on-surface-variant"
                htmlFor="sign-up-password"
              >
                Password
              </label>
              <div className="relative">
                <MaterialIcon
                  name="lock"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl pointer-events-none"
                />
                <input
                  id="sign-up-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-secondary/50 text-sm"
                />
              </div>
              <p className="text-xs text-secondary mt-1">
                Must be at least 6 characters long.
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-secondary-container text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label
                className="text-sm text-secondary leading-tight cursor-pointer"
                htmlFor="terms"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-primary font-semibold hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-primary font-semibold hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-error-container/20 border border-error/20 rounded-xl text-sm text-error">
                <MaterialIcon name="error" className="text-base shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-linear-to-r from-primary to-primary-container text-white font-headline font-bold rounded-xl shadow-[0_8px_20px_-4px_rgba(0,63,177,0.3)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Sign Up
                  <MaterialIcon name="arrow_forward" className="text-xl" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-surface text-secondary font-medium uppercase tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-lowest shadow-sm hover:bg-surface-container-low transition-colors font-semibold text-on-surface-variant"
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

          <p className="text-center font-body text-secondary">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-bold hover:underline transition-all"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
