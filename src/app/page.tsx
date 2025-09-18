import Link from 'next/link'

const listGames = [{ name: "Abaco Zuzzurellone", link: "/abaco" }];

export default function Home() {
    return (
        <div className="h-full bg-gradient-to-b from-cyan-900 to-blue-900 text-white">
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex flex-col items-center justify-center pt-6 ">
                    <h1 className="text-4xl font-bold text-center">
                        Benvenuto alla Game Hub
                    </h1>
                    <p className="text-lg text-center">
                        La tua destinazione unica per tutto ciò che riguarda il
                        gaming.
                    </p>
                    <div className="flex flex-col items-center justify-center mt-6 bg-cyan-950 w-full p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Giochi</h2>
                        <ul className="space-y-2">
                            {listGames.map((game) => (
                                <li key={game.name}>
                                    <Link
                                        href={game.link}
                                        className="text-cyan-400 hover:underline"
                                    >
                                        {game.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
