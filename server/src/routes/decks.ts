import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Get all decks for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId as string;

        if (!userId) {
            res.status(400).json({ error: 'userId is required' });
            return;
        }

        const decks = await prisma.deck.findMany({
            where: { userId },
            include: {
                cards: {
                    include: {
                        card: true
                    }
                },
                folder: true
            }
        });

        res.json(decks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single deck
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deck = await prisma.deck.findUnique({
            where: { id },
            include: {
                cards: {
                    include: {
                        card: true
                    }
                },
                folder: true
            }
        });

        if (!deck) {
            res.status(404).json({ error: 'Deck not found' });
            return;
        }

        res.json(deck);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a deck
router.post('/', async (req, res) => {
    try {
        const { name, description, userId, folderId } = req.body;

        if (!name || !userId) {
            res.status(400).json({ error: 'name and userId are required' });
            return;
        }

        const deck = await prisma.deck.create({
            data: {
                name,
                description,
                userId,
                folderId
            }
        });

        res.status(201).json(deck);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a deck
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, folderId } = req.body;

        const deck = await prisma.deck.update({
            where: { id },
            data: {
                name,
                description,
                folderId
            }
        });

        res.json(deck);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a deck
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.deck.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a card to a deck
router.post('/:id/cards', async (req, res) => {
    try {
        const { id } = req.params;
        const { cardId, quantity, isSideboard } = req.body;

        if (!cardId || !quantity) {
            res.status(400).json({ error: 'cardId and quantity are required' });
            return;
        }

        const deckCard = await prisma.deckCard.create({
            data: {
                deckId: id,
                cardId,
                quantity,
                isSideboard: isSideboard || false
            }
        });

        res.status(201).json(deckCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove a card from a deck
router.delete('/:id/cards/:cardId', async (req, res) => {
    try {
        const { id, cardId } = req.params;

        await prisma.deckCard.deleteMany({
            where: {
                deckId: id,
                cardId
            }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
