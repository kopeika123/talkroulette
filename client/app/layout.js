import "./globals.css";

export const metadata = {
  title: "TalkRoulette",
  description: "Random video chat demo built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
