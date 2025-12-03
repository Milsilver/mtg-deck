import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Get all folders for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId as string;

        if (!userId) {
            res.status(400).json({ error: 'userId is required' });
            return;
        }

        const folders = await prisma.folder.findMany({
            where: { userId },
            include: {
                children: true,
                decks: true
            }
        });

        res.json(folders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a folder
router.post('/', async (req, res) => {
    try {
        const { name, userId, parentId } = req.body;

        if (!name || !userId) {
            res.status(400).json({ error: 'name and userId are required' });
            return;
        }

        const folder = await prisma.folder.create({
            data: {
                name,
                userId,
                parentId
            }
        });

        res.status(201).json(folder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a folder
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parentId } = req.body;

        const folder = await prisma.folder.update({
            where: { id },
            data: {
                name,
                parentId
            }
        });

        res.json(folder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a folder
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.folder.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
