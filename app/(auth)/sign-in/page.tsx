import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function SignInPage() {
  return (
    <div className="flex w-full min-h-screen">
      {/* Left Side - Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 bg-surface z-10">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <MaterialIcon name="school" className="text-3xl text-primary" />
              <h1 className="text-2xl font-headline font-extrabold tracking-tight text-primary">
                The Exam Orbit
              </h1>
            </div>
            <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-secondary font-body">
              Please enter your details to sign in and continue your journey.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-secondary font-body group-hover:text-on-surface transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                className="text-sm font-bold text-primary hover:underline font-body"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl text-sm transition-all hover:shadow-[0_8px_20px_-4px_rgba(0,63,177,0.4)] active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-secondary font-body mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative Graphic Panel */}
      <div className="hidden lg:flex w-1/2 bg-surface-container-low relative overflow-hidden items-center justify-center p-12">
        {/* Floating Organic Elements */}
        <div className="absolute bottom-12 right-12 w-64 h-64 bg-primary/20 blur-[80px] rounded-full animate-pulse"></div>
        <div className="absolute top-24 left-24 w-48 h-48 bg-tertiary-fixed/30 blur-[60px] rounded-full"></div>

        {/* Glassmorphism Stats Card */}
        <div className="relative z-10 max-w-lg w-full">
          <div className="bg-white/40 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-4">
              Accelerate Your Academic Journey
            </h3>
            <p className="text-secondary font-body mb-8 leading-relaxed">
              Join thousands of scholars who are mastering their subjects
              through our simulated examination environment.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/40">
              <div className="p-4 bg-white/40 rounded-2xl border border-white/40">
                <span className="block font-headline font-bold text-3xl text-primary mb-1">
                  94%
                </span>
                <span className="text-xs font-semibold text-on-surface-variant opacity-80 uppercase tracking-tighter">
                  Success Rate
                </span>
              </div>
              <div className="p-4 bg-white/40 rounded-2xl border border-white/40">
                <span className="block font-headline font-bold text-3xl text-primary mb-1">
                  50k+
                </span>
                <span className="text-xs font-semibold text-on-surface-variant opacity-80 uppercase tracking-tighter">
                  Scholars
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
