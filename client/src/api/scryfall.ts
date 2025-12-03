import axios from 'axios';

const SCRYFALL_API = 'https://api.scryfall.com';

export interface ScryfallCard {
    id: string;
    name: string;
    mana_cost?: string;
    type_line?: string;
    oracle_text?: string;
    image_uris?: {
        small?: string;
        normal?: string;
        large?: string;
    };
    colors?: string[];
    cmc?: number;
    power?: string;
    toughness?: string;
    loyalty?: string;
    set_name?: string;
    rarity?: string;
}

export const scryfallAPI = {
    search: async (query: string): Promise<ScryfallCard[]> => {
        try {
            const response = await axios.get(`${SCRYFALL_API}/cards/search`, {
                params: { q: query, order: 'name' },
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Scryfall search error:', error);
            return [];
        }
    },

    getCard: async (id: string): Promise<ScryfallCard | null> => {
        try {
            const response = await axios.get(`${SCRYFALL_API}/cards/${id}`);
            return response.data;
        } catch (error) {
            console.error('Scryfall get card error:', error);
            return null;
        }
    },

    getById: async (id: string): Promise<ScryfallCard> => {
        const response = await axios.get(`${SCRYFALL_API}/cards/${id}`);
        return response.data;
    },

    autocomplete: async (query: string): Promise<string[]> => {
        try {
            const response = await axios.get(`${SCRYFALL_API}/cards/autocomplete`, {
                params: { q: query },
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Scryfall autocomplete error:', error);
            return [];
        }
    },
};

