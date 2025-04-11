import Footer from "@/components/layout/Footer";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <>
      {children}
      <Footer />
    </>
  );
}
