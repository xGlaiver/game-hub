import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
    title: "Game Hub",
    description: "A hub for all your gaming needs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="it">
            <body>
                <div className="flex flex-col h-full">
                    <Header />
                    {children}
                </div>
            </body>
        </html>
    );
}
