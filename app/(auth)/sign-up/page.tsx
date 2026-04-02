"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import { profileImages } from "@/components/profile/profile-images";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
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

          <SignUpForm />

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
