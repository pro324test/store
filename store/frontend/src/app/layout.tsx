import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "متجر متعدد البائعين - Multivendor Store",
  description: "منصة التجارة الإلكترونية متعددة البائعين مع واجهة ثنائية اللغة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}