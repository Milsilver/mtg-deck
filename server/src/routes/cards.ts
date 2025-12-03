import { Router } from 'express';
import prisma from '../db.js';
import axios from 'axios';

const router = Router();

// Search cards in local database
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            res.status(400).json({ error: 'query parameter q is required' });
            return;
        }

        const cards = await prisma.card.findMany({
            where: {
                name: {
                    contains: query
                }
            },
            take: 50
        });

        res.json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single card
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const card = await prisma.card.findUnique({
            where: { id }
        });

        if (!card) {
            res.status(404).json({ error: 'Card not found' });
            return;
        }

        res.json(card);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch card from Scryfall and add to database
router.post('/fetch', async (req, res) => {
    try {
        const { scryfallId } = req.body;

        if (!scryfallId) {
            res.status(400).json({ error: 'scryfallId is required' });
            return;
        }

        // Check if card already exists
        const existingCard = await prisma.card.findUnique({
            where: { scryfallId }
        });

        if (existingCard) {
            res.json(existingCard);
            return;
        }

        // Fetch from Scryfall
        const response = await axios.get(`https://api.scryfall.com/cards/${scryfallId}`);
        const scryfallCard = response.data;

        // Create card in database
        const card = await prisma.card.create({
            data: {
                scryfallId: scryfallCard.id,
                name: scryfallCard.name,
                manaCost: scryfallCard.mana_cost || null,
                typeLine: scryfallCard.type_line || null,
                oracleText: scryfallCard.oracle_text || null,
                imageUrl: scryfallCard.image_uris?.normal || null,
                colors: scryfallCard.colors?.join(',') || ''
            }
        });

        res.status(201).json(card);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
