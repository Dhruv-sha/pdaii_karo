import {
  Space_Grotesk,
  Fraunces,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Padai Karo",
  description: "Smart exam prep workspace",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${fraunces.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
