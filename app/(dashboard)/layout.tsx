import Sidebar from "@/components/layout/sidebar";
import RightSidebar from "@/components/layout/right-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      {/* Left Navigation */}
      <Sidebar />

      {/* Main Content Area - Margins offset the fixed sidebars */}
      <main className="flex-1 ml-64 mr-80 p-10 min-h-screen">{children}</main>

      {/* Right Quick Stats */}
      <RightSidebar />
    </div>
  );
}
