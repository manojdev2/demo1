import { Toaster } from "@/components/ui/toaster";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex items-center h-screen">{children}</main>
      <Toaster />
    </>
  );
}
