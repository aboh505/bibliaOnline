'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

interface FavoriteVerse {
  verseId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  bibleName: string;
  bookName: string;
  chapterNumber: string;
  number: string;
  text: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const removeFromFavorites = (verseId: string) => {
    const updatedFavorites = favorites.filter(fav => fav.verseId !== verseId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const clearAllFavorites = () => {
    localStorage.setItem('favorites', '[]');
    setFavorites([]);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <h1>Mes Versets Favoris</h1>
        <Link href="/" className="back-button">
          Retour à la Bible
        </Link>
      </header>

      <main className="favorites-content">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-favorites"
          >
            <p>Vous n'avez pas encore de versets favoris.</p>
            <Link href="/" className="cta-button">
              Explorer la Bible
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="favorites-actions">
              <p>{favorites.length} verset(s) sauvegardé(s)</p>
              <button
                onClick={clearAllFavorites}
                className="clear-button"
              >
                Tout effacer
              </button>
            </div>

            <div className="favorites-list">
              <AnimatePresence>
                {favorites.map((verse) => (
                  <motion.div
                    key={verse.verseId}
                    className="favorite-verse-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <div className="verse-content">
                      <div className="verse-header">
                        <span className="verse-reference">
                          {verse.bibleName} - {verse.bookName} {verse.chapterNumber}:{verse.number}
                        </span>
                        <button
                          onClick={() => removeFromFavorites(verse.verseId)}
                          className="remove-button"
                          aria-label="Retirer des favoris"
                        >
                          <Trash2 />
                        </button>
                      </div>
                      <p className="verse-text">{verse.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              className="confirmation-toast"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              Modifications sauvegardées
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
