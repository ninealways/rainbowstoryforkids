import "./globals.css";

export const metadata = {
  title: "Rainbow Story For Kids | Learn, Play & Grow",
  description:
    "A colorful, searchable learning-video library for curious young minds."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
