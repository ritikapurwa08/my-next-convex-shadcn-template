"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: "dashboard" },
    { name: "Quiz", href: "/quiz", icon: "quiz" },
    { name: "History", href: "/history", icon: "history" },
    { name: "Management", href: "/admin", icon: "settings_applications" },
    { name: "Analytics", href: "/analytics", icon: "analytics" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col py-8 px-4 gap-y-2 z-50">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-headline font-extrabold tracking-tight text-blue-800 dark:text-blue-300">
          The Exam Orbit
        </h1>
        <p className="text-[10px] font-body uppercase tracking-[0.2em] text-secondary mt-1">
          Digital Atelier
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-y-1">
        {navItems.map((item) => {
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
      </nav>

      <div className="mt-auto flex flex-col gap-y-1 pt-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-x-3 px-3 py-4 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MaterialIcon name="account_circle" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Alex Rivera</p>
            <p className="text-[10px] text-secondary">Premium Plan</p>
          </div>
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-x-3 px-3 py-2 rounded-xl text-slate-500 font-medium hover:bg-slate-200/50 transition-all"
        >
          <MaterialIcon name="settings" className="text-sm" />
          <span className="text-xs font-body">Settings</span>
        </Link>

        <button className="flex items-center gap-x-3 px-3 py-2 rounded-xl text-error font-medium hover:bg-error-container/20 transition-all w-full text-left">
          <MaterialIcon name="logout" className="text-sm" />
          <span className="text-xs font-body">Logout</span>
        </button>
      </div>
    </aside>
  );
}
