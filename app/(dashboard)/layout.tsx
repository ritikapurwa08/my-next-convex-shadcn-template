"use client";

import Sidebar from "@/components/layout/sidebar";
import RightSidebar from "@/components/layout/right-sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideRightSidebar = pathname === "/admin/questions";

  return (
    <div className="flex min-h-screen">
      {/* Left Navigation */}
      <Sidebar />

      {/* Main Content Area - Margins offset the fixed sidebars */}
      <main className={cn("flex-1 ml-64 p-10 min-h-screen", hideRightSidebar ? "mr-0" : "mr-80")}>
        {children}
      </main>

      {/* Right Quick Stats */}
      {!hideRightSidebar && <RightSidebar />}
    </div>
  );
}
