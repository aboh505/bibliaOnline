'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface Verse {
  id: string;
  number: string;
  text: string;
}

interface FavoriteButtonProps {
  verse: Verse;
  bibleId: string;
  bookId: string;
  chapterId: string;
  bibleName: string;
  bookName: string;
  chapterNumber: string;
}

export function FavoriteButton({ 
  verse, 
  bibleId, 
  bookId, 
  chapterId,
  bibleName,
  bookName,
  chapterNumber
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: any) => fav.verseId === verse.id));
  }, [verse.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const existingIndex = favorites.findIndex((fav: any) => fav.verseId === verse.id);

    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
      setIsFavorite(false);
      showNotificationMessage('Verset retiré des favoris');
    } else {
      favorites.push({
        verseId: verse.id,
        bibleId,
        bookId,
        chapterId,
        bibleName,
        bookName,
        chapterNumber,
        number: verse.number,
        text: verse.text,
      });
      setIsFavorite(true);
      showNotificationMessage('Verset ajouté aux favoris');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const showNotificationMessage = (message: string) => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <>
      <button
        onClick={toggleFavorite}
        className="favorite-button"
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Heart
          className={isFavorite ? 'favorite-icon favorite-icon-active' : 'favorite-icon'}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </button>

      {showNotification && (
        <div className="notification">
          {isFavorite ? 'Verset ajouté aux favoris' : 'Verset retiré des favoris'}
        </div>
      )}
    </>
  );
}
