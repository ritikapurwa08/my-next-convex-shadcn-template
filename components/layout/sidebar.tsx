"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: "dashboard" },
  { name: "History", href: "/history", icon: "history" },
  { name: "Analytics", href: "/analytics", icon: "analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.current);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    router.push("/sign-in");
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col py-8 px-4 gap-y-2 z-50">
      {/* Logo */}
      <div className="mb-10 px-2">
        <h1 className="text-xl font-headline font-extrabold tracking-tight text-blue-800 dark:text-blue-300">
          The Exam Orbit
        </h1>
        <p className="text-[10px] font-body uppercase tracking-[0.2em] text-secondary mt-1">
          Digital Atelier
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-x-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200",
                isActive
                  ? "text-blue-700 dark:text-blue-400 font-bold border-r-4 border-blue-700 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 scale-[0.98]"
                  : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50",
              )}
            >
              <MaterialIcon name={item.icon} />
              <span className="text-sm font-body">{item.name}</span>
            </Link>
          );
        })}

        {/* Admin links — only visible to admins */}
        {user?.role === "admin" && (
          <>
            <Link
              href="/admin/questions"
              className={cn(
                "flex items-center gap-x-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200",
                pathname === "/admin/questions"
                  ? "text-blue-700 dark:text-blue-400 font-bold border-r-4 border-blue-700 bg-blue-50/50"
                  : "text-slate-500 hover:text-blue-600 hover:bg-slate-200/50",
              )}
            >
              <MaterialIcon name="quiz" />
              <span className="text-sm font-body">Quiz Questions</span>
            </Link>
          </>
        )}
      </nav>

      {/* User profile + logout */}
      <div className="mt-auto flex flex-col gap-y-1 pt-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-x-3 px-3 py-4 mb-2">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "avatar"}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MaterialIcon name="account_circle" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-on-surface truncate">
              {user?.name ?? "Loading…"}
            </p>
            <p className="text-[10px] text-secondary capitalize">
              {user?.role ?? "student"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-x-3 px-3 py-2 rounded-xl text-error font-medium hover:bg-error-container/20 transition-all w-full text-left disabled:opacity-60"
        >
          {loggingOut ? (
            <span className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />
          ) : (
            <MaterialIcon name="logout" className="text-sm" />
          )}
          <span className="text-xs font-body">
            {loggingOut ? "Logging out…" : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}
