import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import deckRoutes from './routes/decks.js';
import folderRoutes from './routes/folders.js';
import cardRoutes from './routes/cards.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/cards', cardRoutes);

app.get('/', (req, res) => {
  res.send('MTG Deck Hub API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
