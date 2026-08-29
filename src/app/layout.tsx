import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { azeret, barlow, bungee } from "./fonts";

export const metadata: Metadata = {
    title: "Game Hub",
    description: "La sala giochi dove si gioca in due, sullo stesso schermo.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="it"
            className={`${bungee.variable} ${barlow.variable} ${azeret.variable}`}
        >
            <body className="min-h-full bg-sala font-testo text-ink antialiased">
                <div className="flex min-h-full flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                </div>
            </body>
        </html>
    );
}
