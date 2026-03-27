export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-surface flex selection:bg-primary-fixed selection:text-on-primary-fixed">
      {children}
    </div>
  );
}
