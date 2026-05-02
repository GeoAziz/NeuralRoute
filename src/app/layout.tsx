import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CommandPalette } from "@/components/dashboard/CommandPalette";

export const metadata: Metadata = {
  title: 'NeuralRoute — Route smarter. Infer faster.',
  description: 'AI-driven LLM routing for maximum efficiency and quality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@600;700;800&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 selection:text-primary">
        {children}
        <CommandPalette />
        <Toaster />
      </body>
    </html>
  );
}
