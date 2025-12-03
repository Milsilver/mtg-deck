import { useState, useEffect } from 'react';
import { scryfallAPI, type ScryfallCard } from '../api/scryfall';

interface CardSearchProps {
    onCardSelect: (card: ScryfallCard) => void;
}

export default function CardSearch({ onCardSelect }: CardSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ScryfallCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                const autocomplete = await scryfallAPI.autocomplete(query);
                setSuggestions(autocomplete);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const cards = await scryfallAPI.search(searchQuery);
            setResults(cards.slice(0, 15)); // Limit to 15 results for compact display
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
        setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        handleSearch(suggestion);
        setSuggestions([]);
    };

    return (
        <div className="space-y-3">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </form>

            {loading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                    <p className="mt-2 text-xs text-gray-400">Recherche...</p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {results.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => onCardSelect(card)}
                            className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                        >
                            {card.image_uris?.small && (
                                <img
                                    src={card.image_uris.small}
                                    alt={card.name}
                                    className="w-full h-auto"
                                    loading="lazy"
                                />
                            )}
                            <div className="p-2">
                                <p className="font-semibold text-sm truncate">{card.name}</p>
                                {card.mana_cost && (
                                    <p className="text-xs text-gray-400">{card.mana_cost}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                    Aucune carte trouvée
                </div>
            )}
        </div>
    );
}
