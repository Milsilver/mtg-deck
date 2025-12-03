import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deckAPI, cardAPI } from '../api/backend';
import { scryfallAPI, type ScryfallCard } from '../api/scryfall';
import SearchModal from '../components/SearchModal';
import CardPreview from '../components/CardPreview';

interface DeckCard {
    id: string;
    cardId: string;
    quantity: number;
    isSideboard: boolean;
    card: {
        id: string;
        name: string;
        scryfallId: string;
        manaCost?: string;
        typeLine?: string;
        imageUrl?: string;
    };
}

interface Deck {
    id: string;
    name: string;
    description?: string;
    cards: DeckCard[];
}

export default function DeckEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [deckName, setDeckName] = useState('New Deck');
    const [deckDescription, setDeckDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedCard, setSelectedCard] = useState<ScryfallCard | null>(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (id) {
            loadDeck(id);
        }
    }, [id]);

    const loadDeck = async (deckId: string) => {
        setLoading(true);
        try {
            const response = await deckAPI.getOne(deckId);
            const loadedDeck = response.data;
            setDeck(loadedDeck);
            setDeckName(loadedDeck.name);
            setDeckDescription(loadedDeck.description || '');
        } catch (error) {
            console.error('Error loading deck:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveDeck = async () => {
        if (!user.id) {
            alert('Please login first');
            navigate('/login');
            return;
        }

        setSaving(true);
        try {
            if (deck?.id) {
                await deckAPI.update(deck.id, {
                    name: deckName,
                    description: deckDescription,
                });
            } else {
                const response = await deckAPI.create({
                    name: deckName,
                    description: deckDescription,
                    userId: user.id,
                });
                const newDeck = response.data;
                setDeck(newDeck);
                navigate(`/deck/${newDeck.id}`, { replace: true });
            }
            alert('Deck saved successfully!');
        } catch (error) {
            console.error('Error saving deck:', error);
            alert('Failed to save deck');
        } finally {
            setSaving(false);
        }
    };

    const handleCardSelect = async (scryfallCard: ScryfallCard) => {
        if (!deck?.id) {
            alert('Please save the deck first');
            return;
        }

        try {
            const cardResponse = await cardAPI.fetch(scryfallCard.id);
            const dbCard = cardResponse.data;

            await deckAPI.addCard(deck.id, {
                cardId: dbCard.id,
                quantity: 1,
                isSideboard: false,
            });

            loadDeck(deck.id);
        } catch (error) {
            console.error('Error adding card:', error);
            alert('Failed to add card');
        }
    };

    const handleRemoveCard = async (cardId: string) => {
        if (!deck?.id) return;

        try {
            await deckAPI.removeCard(deck.id, cardId);
            loadDeck(deck.id);
        } catch (error) {
            console.error('Error removing card:', error);
        }
    };

    const handleCardClick = async (deckCard: DeckCard) => {
        try {
            const card = await scryfallAPI.getById(deckCard.card.scryfallId);
            setSelectedCard(card);
        } catch (error) {
            console.error('Error fetching card details:', error);
        }
    };

    const mainDeckCards = deck?.cards?.filter((c) => !c.isSideboard) || [];
    const sideboardCards = deck?.cards?.filter((c) => c.isSideboard) || [];
    const totalCards = mainDeckCards.reduce((sum, c) => sum + c.quantity, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    <p className="mt-4 text-gray-400">Loading deck...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Deck Editor
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsSearchModalOpen(true)}
                            className="px-4 md:px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                        >
                            + Ajouter une carte
                        </button>
                        <button
                            onClick={() => navigate('/my-decks')}
                            className="px-4 md:px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={saveDeck}
                            disabled={saving}
                            className="px-4 md:px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Deck'}
                        </button>
                    </div>
                </div>

                {/* Deck Details */}
                <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Deck Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                            placeholder="Deck Name"
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <textarea
                            value={deckDescription}
                            onChange={(e) => setDeckDescription(e.target.value)}
                            placeholder="Description"
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={1}
                        />
                    </div>
                </div>

                {/* Main Layout: 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Card List */}
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Main Deck ({totalCards} cards)
                            </h2>
                            {mainDeckCards.length === 0 ? (
                                <p className="text-gray-400 text-sm">No cards yet. Click "Ajouter une carte" to search and add cards.</p>
                            ) : (
                                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                                    {mainDeckCards.map((deckCard) => (
                                        <div
                                            key={deckCard.id}
                                            onClick={() => handleCardClick(deckCard)}
                                            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{deckCard.card.name}</p>
                                                {deckCard.card.manaCost && (
                                                    <p className="text-sm text-gray-400">{deckCard.card.manaCost}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-2">
                                                <span className="px-3 py-1 bg-gray-800 rounded text-sm">
                                                    {deckCard.quantity}x
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveCard(deckCard.cardId);
                                                    }}
                                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {sideboardCards.length > 0 && (
                            <div className="bg-gray-800 rounded-lg p-4 md:p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Sideboard ({sideboardCards.reduce((sum, c) => sum + c.quantity, 0)} cards)
                                </h2>
                                <div className="space-y-2">
                                    {sideboardCards.map((deckCard) => (
                                        <div
                                            key={deckCard.id}
                                            onClick={() => handleCardClick(deckCard)}
                                            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors"
                                        >
                                            <p className="font-semibold">{deckCard.card.name}</p>
                                            <span className="px-3 py-1 bg-gray-800 rounded text-sm">
                                                {deckCard.quantity}x
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Card Preview */}
                    <div>
                        <div className="sticky top-4">
                            <CardPreview card={selectedCard} onClose={() => setSelectedCard(null)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onCardSelect={handleCardSelect}
            />
        </div>
    );
}
