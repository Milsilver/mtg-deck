import type { ScryfallCard } from '../api/scryfall';

interface CardDisplayProps {
    card: ScryfallCard;
    onAdd?: (card: ScryfallCard) => void;
    quantity?: number;
    onRemove?: () => void;
    onQuantityChange?: (quantity: number) => void;
}

export default function CardDisplay({ card, onAdd, quantity, onRemove, onQuantityChange }: CardDisplayProps) {
    const imageUrl = card.image_uris?.normal || card.image_uris?.small;

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={card.name}
                    className="w-full h-auto"
                    loading="lazy"
                />
            )}
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{card.name}</h3>
                {card.mana_cost && (
                    <p className="text-sm text-gray-400 mb-1">{card.mana_cost}</p>
                )}
                {card.type_line && (
                    <p className="text-sm text-gray-400 mb-2">{card.type_line}</p>
                )}
                {card.oracle_text && (
                    <p className="text-sm text-gray-300 mb-3 line-clamp-3">{card.oracle_text}</p>
                )}

                {quantity !== undefined ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onQuantityChange?.(Math.max(0, quantity - 1))}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                        >
                            -
                        </button>
                        <span className="px-4 py-1 bg-gray-700 rounded">{quantity}</span>
                        <button
                            onClick={() => onQuantityChange?.(quantity + 1)}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                        >
                            +
                        </button>
                        <button
                            onClick={onRemove}
                            className="ml-auto px-4 py-1 bg-red-600 hover:bg-red-700 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ) : onAdd && (
                    <button
                        onClick={() => onAdd(card)}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                    >
                        Add to Deck
                    </button>
                )}
            </div>
        </div>
    );
}
