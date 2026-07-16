import Footer from "@/shared/components/Footer";
import Header from "@/shared/components/Header";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="mt-16">{children}</main>
      <Footer />
    </>
  );
}
