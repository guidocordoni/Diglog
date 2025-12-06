
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchHero from './components/SearchHero';
import ResultsArea from './components/ResultsArea';
import SavedView from './components/SavedView';
import Footer from './components/Footer';
import { SearchState, DatabaseFilter, ImageAttachment, SavedItem } from './types';
import { searchArtifacts } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'search' | 'saved'>('search');
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    image: null,
    isSearching: false,
    resultText: null,
    groundingMetadata: null,
    error: null,
  });

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem('diglog_saved');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load saved items", e);
      return [];
    }
  });

  const handleSearch = async (query: string, filter: DatabaseFilter, image: ImageAttachment | null) => {
    setView('search');
    setSearchState(prev => ({ 
      ...prev, 
      isSearching: true, 
      query, 
      image,
      error: null 
    }));
    
    try {
      const { text, groundingMetadata } = await searchArtifacts(query, filter, image);
      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        resultText: text,
        groundingMetadata,
        error: null,
      }));
    } catch (error: any) {
      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        error: error.message || "An unexpected error occurred.",
      }));
    }
  };

  const handleSaveCurrent = () => {
    if (!searchState.resultText) return;

    // Check if already saved
    if (savedItems.some(item => item.resultText === searchState.resultText)) return;

    const newItem: SavedItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      query: searchState.query,
      image: searchState.image,
      resultText: searchState.resultText || '',
      groundingMetadata: searchState.groundingMetadata
    };

    const newItems = [newItem, ...savedItems];
    setSavedItems(newItems);
    localStorage.setItem('diglog_saved', JSON.stringify(newItems));
  };

  const handleDeleteSaved = (id: string) => {
    const newItems = savedItems.filter(item => item.id !== id);
    setSavedItems(newItems);
    localStorage.setItem('diglog_saved', JSON.stringify(newItems));
  };

  const handleLoadSaved = (item: SavedItem) => {
    setSearchState({
      query: item.query,
      image: item.image,
      isSearching: false,
      resultText: item.resultText,
      groundingMetadata: item.groundingMetadata,
      error: null
    });
    setView('search');
  };

  const isCurrentResultSaved = React.useMemo(() => {
     return !!searchState.resultText && savedItems.some(item => item.resultText === searchState.resultText);
  }, [searchState.resultText, savedItems]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header 
        onShowSaved={() => setView(view === 'saved' ? 'search' : 'saved')} 
        savedCount={savedItems.length} 
      />
      <main className="flex-grow">
        {view === 'saved' ? (
          <SavedView 
            items={savedItems} 
            onLoad={handleLoadSaved} 
            onDelete={handleDeleteSaved} 
            onClose={() => setView('search')}
          />
        ) : (
          <>
            <SearchHero 
                onSearch={handleSearch} 
                isSearching={searchState.isSearching} 
            />
            <ResultsArea 
              state={searchState} 
              onSave={handleSaveCurrent}
              isSaved={isCurrentResultSaved}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
