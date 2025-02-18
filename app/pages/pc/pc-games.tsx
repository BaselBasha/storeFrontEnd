// pages/pc/pc-games.tsx
import Link from 'next/link';

export default function PcGamesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#8B0000]">
            KRAKEN
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/pc" className="text-gray-300 hover:text-[#FF0000] transition-colors">
                  Back to PC
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#FF0000] transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">PC Games</h1>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Game Card Example */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
           
            <h2 className="text-2xl font-bold mb-2">Cyberpunk 2077</h2>
            <p className="text-gray-400 mb-4">An open-world RPG set in the vibrant city of Night City.</p>
            <Link
              href="/pc/cyberpunk-2077"
              className="inline-block bg-[#8B0000] text-white py-2 px-4 rounded hover:bg-[#FF0000] transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Another Game Card Example */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
           
            <h2 className="text-2xl font-bold mb-2">The Witcher 3: Wild Hunt</h2>
            <p className="text-gray-400 mb-4">Embark on an epic journey through a vast open world.</p>
            <Link
              href="/pc/the-witcher-3"
              className="inline-block bg-[#8B0000] text-white py-2 px-4 rounded hover:bg-[#FF0000] transition-colors"
            >
              Learn More
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2023 Kraken. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}