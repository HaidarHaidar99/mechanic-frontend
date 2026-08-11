import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const cached = localStorage.getItem('favorites');
      return cached ? JSON.parse(cached).filter(Boolean) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (productId) => {
    setFavoriteIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId) => {
    return favoriteIds.includes(productId);
  };

  // Allows clean-up of stale IDs when products list is loaded and mapped
  const cleanupStaleFavorites = (activeProductIds) => {
    setFavoriteIds(prev => prev.filter(id => activeProductIds.includes(id)));
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteIds,
      toggleFavorite,
      isFavorite,
      cleanupStaleFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
