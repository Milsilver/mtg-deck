# MTG Deck Hub 🃏

A modern, full-stack web application for creating, managing, and organizing Magic: The Gathering decks.

## Features ✨

- **Deck Management**: Create, edit, and organize your MTG decks
- **Card Search**: Search for cards using the Scryfall API with autocomplete
- **Card Preview**: View detailed card information with images
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Updates**: Instant feedback when adding or removing cards

## Tech Stack 🛠️

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API requests

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma** ORM for database management
- **SQLite** database
- **bcrypt** for password hashing

### External APIs
- **Scryfall API** for Magic: The Gathering card data

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Milsilver/mtg-deck.git
cd mtg-deck-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
cd server
npx prisma migrate dev
cd ..
```

4. Start the development server:
```bash
npm start
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Project Structure 📁

```
mtg-deck-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client modules
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── db.ts          # Database client
│   │   └── index.ts       # Server entry point
│   ├── prisma/            # Database schema and migrations
│   └── package.json
└── package.json           # Root package.json
```

## Usage 💡

1. **Register/Login**: Create an account or log in to access your decks
2. **Create a Deck**: Click "Create New Deck" and give it a name
3. **Add Cards**: Click "Ajouter une carte" to search and add cards to your deck
4. **View Card Details**: Click on any card in your deck to see its full details
5. **Manage Your Decks**: View all your decks in the "My Decks" page

## API Endpoints 🔌

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Decks
- `GET /api/decks` - Get all decks for a user
- `GET /api/decks/:id` - Get a specific deck
- `POST /api/decks` - Create a new deck
- `PUT /api/decks/:id` - Update a deck
- `DELETE /api/decks/:id` - Delete a deck

### Cards
- `POST /api/decks/:id/cards` - Add a card to a deck
- `DELETE /api/decks/:deckId/cards/:cardId` - Remove a card from a deck
- `POST /api/cards/fetch` - Fetch card data from Scryfall

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments 🙏

- [Scryfall](https://scryfall.com/) for providing the comprehensive MTG card database API
- Magic: The Gathering is a trademark of Wizards of the Coast LLC

## Contact 📧

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ for the MTG community
