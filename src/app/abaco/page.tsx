import AbacoPageClient from "./client";

export default function AbacoPage() {
    return (
        <div className="h-full bg-gradient-to-b from-cyan-900 to-blue-900 text-white">
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex flex-col gap-2 items-center justify-center pt-6 ">
                    <h1 className="text-4xl font-bold text-center">
                        Abaco - Zuzzurellone
                    </h1>
                    <p className="text-lg text-center">
                        Benvenuto alla pagina di Abaco - Zuzzurellone.
                    </p>
                    <p className="text-base text-center">
                        Indovina la parola racchiusa tra le parole "abaco" e
                        "zuzzurellone!"
                    </p>
                    {/* Contenuto del gioco Abaco Zuzzurellone */}
                    <div className="flex flex-col items-center justify-center mt-6 bg-cyan-950 w-full p-6 rounded-lg shadow-lg">
                        <AbacoPageClient />
                    </div>
                </div>
            </div>
        </div>
    );
}
