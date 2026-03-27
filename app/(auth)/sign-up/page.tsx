"use client";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

import { useState } from "react";
import { profileImages } from "@/components/profile/profile-images";
import { StaticImageData } from "next/image";
import AvatarPicker from "@/components/profile/avatar-selector";

export default function SignUpPage() {
  const [avatar, setAvatar] = useState<StaticImageData | undefined>();
  return (
    <main className="min-h-screen min-w-full flex flex-row overflow-hidden bg-surface">
      {/* Left Side: Functional Sign Up Form (Exactly 50%) */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest relative z-10">
        <div className="w-full max-w-md space-y-10">
          {/* Brand Anchor */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <MaterialIcon name="orbit" className="text-white" />
              </div>
              <h1 className="font-headline font-extrabold text-2xl tracking-tight text-primary">
                The Exam Orbit
              </h1>
            </div>
            <p className="text-secondary font-medium mt-6">
              Welcome to your Digital Atelier.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-headline font-bold text-3xl text-on-surface">
              Create an Account
            </h2>
            <p className="text-secondary text-sm">
              Begin your academic journey with us today.
            </p>
          </div>
          <AvatarPicker
            images={profileImages}
            value={avatar}
            onChange={setAvatar}
          />
          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-on-surface-variant"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="person"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all duration-200 placeholder:text-outline-variant"
                    id="name"
                    name="name"
                    placeholder="Alex Rivera"
                    required
                    type="text"
                  />
                </div>
              </div>

              {/* Email Field */}
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all duration-200 placeholder:text-outline-variant"
                    id="email"
                    name="email"
                    placeholder="name@university.edu"
                    required
                    type="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-on-surface-variant"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="lock"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all duration-200 placeholder:text-outline-variant"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4">
              <button
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl shadow-[0_12px_32px_-4px_rgba(0,63,177,0.2)] active:scale-[0.98] transition-all duration-200"
                type="submit"
              >
                Sign Up
              </button>

              <div className="relative py-4 flex items-center gap-4">
                <div className="flex-grow h-px bg-surface-container-high"></div>
                <span className="text-xs text-outline uppercase font-bold tracking-widest">
                  or
                </span>
                <div className="flex-grow h-px bg-surface-container-high"></div>
              </div>

              <button
                className="w-full py-3 flex items-center justify-center gap-3 bg-surface-container-low text-on-surface font-semibold rounded-xl hover:bg-surface-container-high transition-colors active:scale-[0.98]"
                type="button"
              >
                <MaterialIcon name="login" className="text-lg" />
                Continue with Google
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-secondary">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-primary hover:underline decoration-2 underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>

      {/* Right Side: Academic Illustration/Atmosphere (Exactly 50%) */}
      <section className="hidden lg:flex w-1/2 relative bg-surface-container-low overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Modern Academic Atelier"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Focused Content Overlay */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
          <div className="max-w-md bg-white/40 backdrop-blur-xl p-8 rounded-3xl space-y-6 shadow-2xl border border-white/20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full">
              <MaterialIcon
                name="auto_awesome"
                className="text-on-primary-fixed-variant text-sm"
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

        <div className="absolute bottom-12 right-12 w-32 h-32 bg-primary/20 blur-[60px] rounded-full animate-pulse"></div>
        <div className="absolute top-24 left-24 w-24 h-24 bg-tertiary-fixed/30 blur-[40px] rounded-full"></div>
      </section>

      {/* Support Icons Section */}
      <div className="fixed bottom-6 left-6 flex items-center gap-4 z-20">
        <button className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-xl flex items-center justify-center text-secondary hover:text-primary transition-colors border border-white/40">
          <MaterialIcon name="dark_mode" className="text-lg" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-xl flex items-center justify-center text-secondary hover:text-primary transition-colors border border-white/40">
          <MaterialIcon name="help_outline" className="text-lg" />
        </button>
      </div>
    </main>
  );
}
