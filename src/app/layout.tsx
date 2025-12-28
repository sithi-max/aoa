import "./globals.css";

export const metadata = {
  title: "AOA",
  description: "Anonymous Opinion Arena",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
