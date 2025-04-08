const API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
const API_URL = 'https://api.scripture.api.bible/v1';

interface Verse {
  id: string;
  reference: string;
  content: string;
  verseCount?: number;
  orgId?: string;
  bookId?: string;
  chapterId?: string;
}

interface APIResponse {
  data: {
    id: string;
    bibleId: string;
    number: string;
    content: string;
    reference: string;
    verseCount: number;
    verses: Verse[];
  };
}

export const getBibles = async () => {
  try {
    const response = await fetch(`${API_URL}/bibles`, {
      headers: {
        'api-key': API_KEY as string
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Bibles disponibles:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des bibles:', error);
    throw error;
  }
};

export const getBooks = async (bibleId: string) => {
  try {
    const response = await fetch(`${API_URL}/bibles/${bibleId}/books`, {
      headers: {
        'api-key': API_KEY as string
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Livres disponibles:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    throw error;
  }
};

export const getChapters = async (bibleId: string, bookId: string) => {
  try {
    const response = await fetch(`${API_URL}/bibles/${bibleId}/books/${bookId}/chapters`, {
      headers: {
        'api-key': API_KEY as string
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Chapitres disponibles:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des chapitres:', error);
    throw error;
  }
};

export const getChapterContent = async (bibleId: string, chapterId: string) => {
  try {
    console.log('Récupération du chapitre:', { bibleId, chapterId });
    
    // Récupérer le contenu du chapitre directement
    const response = await fetch(`${API_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-verse-numbers=true`, {
      headers: {
        'api-key': API_KEY as string
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    console.log('Données brutes reçues:', rawData);

    if (!rawData || !rawData.data) {
      throw new Error('Format de réponse invalide');
    }

    // Extraire les versets du contenu
    const content = rawData.data.content;
    const reference = rawData.data.reference;
    
    // Diviser le contenu en versets en utilisant les numéros de versets comme séparateurs
    const versesMatch = content.match(/\[(\d+)\](.*?)(?=\[\d+\]|$)/g) || [];
    
    const verses = versesMatch.map(match => {
      const [_, number, text] = match.match(/\[(\d+)\](.*)/) || [];
      return {
        id: `${chapterId}-${number}`,
        number,
        text: text.trim()
      };
    });

    console.log('Versets formatés:', verses);

    if (verses.length === 0) {
      throw new Error('Aucun verset trouvé dans ce chapitre');
    }

    const result = {
      data: {
        reference,
        verses
      }
    };

    console.log('Résultat final:', result);
    return result;

  } catch (error) {
    console.error('Erreur lors de la récupération des versets:', error);
    throw error;
  }
};
