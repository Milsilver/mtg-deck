import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DeckEditor from './pages/DeckEditor';
import MyDecks from './pages/MyDecks';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-decks" element={<MyDecks />} />
          <Route path="/deck/:id?" element={<DeckEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
