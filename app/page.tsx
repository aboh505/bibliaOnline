'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import Link from 'next/link';
import { getBibles, getBooks, getChapters, getChapterContent } from '../utils/api';
import { FavoriteButton } from '../components/favorites';

interface Verse {
  id: string;
  number: string;
  text: string;
}

interface Chapter {
  reference: string;
  verses: Verse[];
}

export default function Home() {
  const [bibles, setBibles] = useState<any[]>([]);
  const [selectedBible, setSelectedBible] = useState('');
  const [selectedBibleName, setSelectedBibleName] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedBookName, setSelectedBookName] = useState('');
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [content, setContent] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const loadBibles = async () => {
      try {
        setLoading(true);
        const data = await getBibles();
        if (data?.data) {
          setBibles(data.data);
        }
      } catch (err) {
        console.error('Erreur chargement bibles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBibles();
  }, []);

  useEffect(() => {
    if (selectedBible) {
      const loadBooks = async () => {
        try {
          const data = await getBooks(selectedBible);
          if (data?.data) {
            setBooks(data.data);
          }
          setSelectedBook('');
          setChapters([]);
          setContent(null);
        } catch (err) {
          console.error('Erreur chargement livres:', err);
        }
      };
      loadBooks();
    }
  }, [selectedBible]);

  useEffect(() => {
    if (selectedBible && selectedBook) {
      const loadChapters = async () => {
        try {
          const data = await getChapters(selectedBible, selectedBook);
          if (data?.data) {
            setChapters(data.data);
          }
          setSelectedChapter('');
          setContent(null);
        } catch (err) {
          console.error('Erreur chargement chapitres:', err);
        }
      };
      loadChapters();
    }
  }, [selectedBible, selectedBook]);

  useEffect(() => {
    if (selectedBible && selectedChapter) {
      const loadContent = async () => {
        try {
          setLoading(true);
          const data = await getChapterContent(selectedBible, selectedChapter);
          if (data?.data) {
            setContent(data.data);
          }
        } catch (err) {
          console.error('Erreur chargement contenu:', err);
        } finally {
          setLoading(false);
        }
      };
      loadContent();
    }
  }, [selectedBible, selectedChapter]);

  const filteredBibles = bibles.filter(bible =>
    bible.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePreviousChapter = () => {
    const currentChapterIndex = chapters.findIndex(chapter => chapter.id === selectedChapter);
    if (currentChapterIndex > 0) {
      setSelectedChapter(chapters[currentChapterIndex - 1].id);
    }
  };

  const handleNextChapter = () => {
    const currentChapterIndex = chapters.findIndex(chapter => chapter.id === selectedChapter);
    if (currentChapterIndex < chapters.length - 1) {
      setSelectedChapter(chapters[currentChapterIndex + 1].id);
    }
  };

  const handleBibleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bible = bibles.find(b => b.id === e.target.value);
    setSelectedBible(e.target.value);
    setSelectedBibleName(bible?.name || '');
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const book = books.find(b => b.id === e.target.value);
    setSelectedBook(e.target.value);
    setSelectedBookName(book?.name || '');
  };

  return (
    <div className="min-h-screen">
      <header className="header">
        <Link href="/">
          <h1> BibliaOnline </h1>
        </Link>
        <nav>
          <Link href="/about">À propos</Link>
          <Link href="/favorites">Favoris</Link>
        </nav>
      </header>

      <main className="bible-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher une version de la Bible..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <Search className="search-icon" />
        </div>

        <div className="select-grid">
          <select
            value={selectedBible}
            onChange={handleBibleChange}
            className="select"
          >
            <option value="">Sélectionner une Bible</option>
            {filteredBibles.map(bible => (
              <option key={bible.id} value={bible.id}>
                {bible.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBook}
            onChange={handleBookChange}
            className="select"
            disabled={!selectedBible}
          >
            <option value="">Sélectionner un livre</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>

          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="select"
            disabled={!selectedBook}
          >
            <option value="">Sélectionner un chapitre</option>
            {chapters.map(chapter => (
              <option key={chapter.id} value={chapter.id}>
                Chapitre {chapter.number}
              </option>
            ))}
          </select>
        </div>

        {selectedChapter && (
          <div className="chapter-controls">
            <div className="verse-size-controls">
              <button
                onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                className="size-button"
                aria-label="Réduire la taille du texte"
              >
                <ZoomOut />
              </button>
              <button
                onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                className="size-button"
                aria-label="Augmenter la taille du texte"
              >
                <ZoomIn />
              </button>
            </div>
          </div>
        )}

        {loading && <div className="loading">Chargement des versets...</div>}

        {!loading && content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center text-2xl font-bold mb-4">{content.reference}</h2>
            <div className="space-y-4">
              {content.verses.map(verse => (
                <motion.div
                  key={verse.id}
                  className="verse-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="verse-content">
                    <span className="verse-number">
                      {verse.number}
                    </span>
                    <p className="verse-text" style={{ fontSize: `${fontSize}px` }}>
                      {verse.text}
                    </p>
                    <FavoriteButton
                      verse={verse}
                      bibleId={selectedBible}
                      bookId={selectedBook}
                      chapterId={selectedChapter}
                      bibleName={selectedBibleName}
                      bookName={selectedBookName}
                      chapterNumber={content?.reference.split(' ').pop() || ''}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="chapter-navigation">
              <button
                onClick={handlePreviousChapter}
                disabled={!chapters.length || chapters[0].id === selectedChapter}
                className="nav-button"
              >
                <ChevronLeft />
                Précédent
              </button>
              <button
                onClick={handleNextChapter}
                disabled={!chapters.length || chapters[chapters.length - 1].id === selectedChapter}
                className="nav-button"
              >
                Suivant
                <ChevronRight />
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
