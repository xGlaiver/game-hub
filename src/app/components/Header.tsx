import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-blue-900 text-white p-1 shadow-2xl">
            <div className="max-w-4xl mx-auto flex justify-center">
                <Link href="/">
                    <h1 className="text-3xl font-bold">Game Hub</h1>
                </Link>
            </div>
        </header>
    );
}
