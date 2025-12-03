import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deckAPI } from '../api/backend';

interface Deck {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    cards: any[];
}

export default function MyDecks() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }
        loadDecks();
    }, []);

    const loadDecks = async () => {
        setLoading(true);
        try {
            const response = await deckAPI.getAll(user.id);
            setDecks(response.data);
        } catch (error) {
            console.error('Error loading decks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (deckId: string) => {
        if (!confirm('Are you sure you want to delete this deck?')) return;

        try {
            await deckAPI.delete(deckId);
            loadDecks();
        } catch (error) {
            console.error('Error deleting deck:', error);
            alert('Failed to delete deck');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    <p className="mt-4 text-gray-400">Loading decks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            My Decks
                        </h1>
                        <p className="text-gray-400 mt-2">Welcome back, {user.email}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to="/deck"
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                        >
                            + New Deck
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Decks Grid */}
                {decks.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🃏</div>
                        <h2 className="text-2xl font-semibold mb-2">No decks yet</h2>
                        <p className="text-gray-400 mb-6">Create your first deck to get started!</p>
                        <Link
                            to="/deck"
                            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                        >
                            Create Deck
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {decks.map((deck) => {
                            const cardCount = deck.cards?.reduce((sum, c) => sum + c.quantity, 0) || 0;
                            return (
                                <div
                                    key={deck.id}
                                    className="bg-gray-800 rounded-lg p-6 hover:ring-2 hover:ring-purple-500 transition-all"
                                >
                                    <h3 className="text-xl font-semibold mb-2">{deck.name}</h3>
                                    {deck.description && (
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {deck.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                        <span>{cardCount} cards</span>
                                        <span>{new Date(deck.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/deck/${deck.id}`}
                                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-center font-semibold transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(deck.id)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
