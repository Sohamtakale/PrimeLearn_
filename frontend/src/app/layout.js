import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
    title: "PrimeLearn | Chart Your Learning Universe",
    description: "AI-powered adaptive learning platform.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body className="antialiased min-h-screen bg-brand-secondary text-text-primary selection:bg-brand-primary/30">
                <main className="relative flex min-h-screen flex-col">
                    {children}
                </main>
            </body>
        </html>
    );
}
