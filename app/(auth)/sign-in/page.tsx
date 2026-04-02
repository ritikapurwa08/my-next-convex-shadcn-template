"use client";

import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/ui/material-icon";

import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
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
          <SignInForm />
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
