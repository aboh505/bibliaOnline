const API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
const API_URL = 'https://api.scripture.api.bible/v1';

interface Verse {
  id: string;
  number: string;
  text: string;
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

export async function getChapterContent(bibleId: string, chapterId: string) {
  try {
    const response = await fetch(
      `${API_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
      {
        headers: {
          'api-key': API_KEY as string
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const rawData = await response.json();

    // Extraire les versets du contenu
    const content = rawData.data.content;
    const reference = rawData.data.reference;
    
    try {
      // Diviser le contenu en versets en utilisant les numéros de versets comme séparateurs
      const versesMatch = content.match(/\[(\d+)\](.*?)(?=\[\d+\]|$)/g) || [];
      
      const verses = versesMatch.map((match: string) => {
        const verseMatch = match.match(/\[(\d+)\](.*)/) || [];
        if (verseMatch.length < 3) {
          console.warn('Format de verset invalide:', match);
          return null;
        }
        const verse: Verse = {
          id: `${chapterId}-${verseMatch[1]}`,
          number: verseMatch[1],
          text: verseMatch[2].trim()
        };
        return verse;
      }).filter((verse: Verse | null): verse is Verse => verse !== null);

      return {
        data: {
          reference,
          verses
        }
      };
    } catch (parseError) {
      console.error('Erreur lors du traitement des versets:', parseError);
      return {
        data: {
          reference,
          verses: []
        }
      };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu du chapitre:', error);
    throw error;
  }
}
