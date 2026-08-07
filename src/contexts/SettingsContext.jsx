import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/settings');
      if (res.success) {
        setSettings(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch settings');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching global settings:', err);
      setError(err.message || 'Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
