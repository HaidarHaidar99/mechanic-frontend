import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AnnouncementsContext = createContext(null);

export function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useState([]);
  const [adminAnnouncements, setAdminAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch enabled announcements for public navbar banner
  const fetchPublicAnnouncements = async () => {
    try {
      const res = await apiRequest('/announcements');
      if (res.success) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      console.error('Error loading public announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all announcements for admin panel
  const fetchAdminAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/announcements/admin');
      if (res.success) {
        setAdminAnnouncements(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch admin announcements');
      }
      setError(null);
    } catch (err) {
      console.error('Error loading admin announcements:', err);
      setError(err.message || 'Failed to load announcements inbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicAnnouncements();
  }, []);

  const createAnnouncement = async (payload) => {
    const res = await apiRequest('/announcements', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    if (res.success && res.data) {
      // Update local state immediately on successful API response
      setAdminAnnouncements(prev => {
        const updated = [...prev, res.data];
        return updated.sort((a, b) => a.order - b.order);
      });
      // Refetch public list so the banner updates instantly if toggled
      fetchPublicAnnouncements();
      return res.data;
    } else {
      throw new Error(res.message || 'Failed to create announcement');
    }
  };

  const updateAnnouncement = async (id, payload) => {
    const res = await apiRequest(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    if (res.success && res.data) {
      // Update local state immediately on successful API response
      setAdminAnnouncements(prev => {
        const updated = prev.map(item => item.id === id ? res.data : item);
        return updated.sort((a, b) => a.order - b.order);
      });
      fetchPublicAnnouncements();
      return res.data;
    } else {
      throw new Error(res.message || 'Failed to update announcement');
    }
  };

  const deleteAnnouncement = async (id) => {
    const res = await apiRequest(`/announcements/${id}`, {
      method: 'DELETE'
    });

    if (res.success) {
      // Update local state immediately on successful API response
      setAdminAnnouncements(prev => prev.filter(item => item.id !== id));
      fetchPublicAnnouncements();
    } else {
      throw new Error(res.message || 'Failed to delete announcement');
    }
  };

  return (
    <AnnouncementsContext.Provider value={{
      announcements,
      adminAnnouncements,
      loading,
      error,
      fetchAdminAnnouncements,
      fetchPublicAnnouncements,
      createAnnouncement,
      updateAnnouncement,
      deleteAnnouncement
    }}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementsContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementsProvider');
  }
  return context;
}
