import type { ScryfallCard } from '../api/scryfall';

interface CardPreviewProps {
    card: ScryfallCard | null;
    onClose?: () => void;
}

export default function CardPreview({ card, onClose }: CardPreviewProps) {
    if (!card) {
        return (
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                <p className="text-gray-400 text-center text-sm">
                    Cliquez sur une carte pour voir les détails
                </p>
            </div>
        );
    }

    const imageUrl = card.image_uris?.small || card.image_uris?.normal;

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start gap-4">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={card.name}
                        className="w-32 rounded-lg shadow-lg flex-shrink-0"
                    />
                )}

                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold">{card.name}</h3>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                aria-label="Fermer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {card.mana_cost && (
                        <p className="text-sm font-semibold text-purple-400">{card.mana_cost}</p>
                    )}

                    {card.type_line && (
                        <p className="text-sm text-gray-300">{card.type_line}</p>
                    )}

                    {card.oracle_text && (
                        <p className="text-xs leading-relaxed text-gray-400 whitespace-pre-line line-clamp-4">
                            {card.oracle_text}
                        </p>
                    )}

                    <div className="flex gap-4 text-xs text-gray-400">
                        {card.power && card.toughness && (
                            <span className="font-semibold">{card.power}/{card.toughness}</span>
                        )}
                        {card.loyalty && (
                            <span className="font-semibold">Loyauté: {card.loyalty}</span>
                        )}
                        {card.rarity && (
                            <span className="capitalize">{card.rarity}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
