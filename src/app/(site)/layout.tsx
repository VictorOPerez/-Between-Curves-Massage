import Footer from "@/components/layout/Footer";
import NavbarMinimal from "@/components/sections/NavbarMinimal";
export const metadata = {
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>

      <NavbarMinimal />
      {children}
      <Footer />

    </div>
  );
}
