import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <div className="text-center space-y-8 p-8">
                <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    MTG Deck Hub
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl">
                    Create, visualize, organize, and share your Magic: The Gathering decks
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        to="/login"
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
