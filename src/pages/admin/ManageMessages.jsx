import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { 
  Mail, MailOpen, Archive, CheckCircle, Trash2, 
  Calendar, Phone, User, AlertCircle, RefreshCw, X 
} from 'lucide-react';

export default function ManageMessages() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState('all'); // 'all' | 'new' | 'read' | 'archived'
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessagesList = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/messages');
      if (res.success) {
        setMessages(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch messages');
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not load message inbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagesList();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await apiRequest(`/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      if (res.success) {
        // Update local state without full reload
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
        
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        throw new Error(res.message || 'Status update failed');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not update message status');
    }
  };

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'new') {
      // Auto mark as read when opened
      handleUpdateStatus(msg.id, 'read');
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-gray-250 dark:border-gray-850 pb-4">
        <h1 className="text-xl font-bold text-gray-950 dark:text-white uppercase tracking-wider">
          {currentLang === 'en' ? 'Contact Message Box' : 'صندوق رسائل الاتصال'}
        </h1>
        <p className="text-xs text-gray-400">
          {currentLang === 'en' ? 'Read and manage customer inquiries and messages.' : 'قراءة وإدارة الاستفسارات والرسائل الواردة من العملاء.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs sm:text-sm">
        {['all', 'new', 'read', 'archived'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              filter === tab
                ? 'border-red-650 text-red-600 dark:border-red-500 dark:text-red-500'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-955/20 text-red-400 rounded-xl text-sm border border-red-900/50">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Inbox layout split pane */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading messages...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left panel: messages list */}
          <div className="lg:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#16181c]/20">
                <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{currentLang === 'en' ? 'No messages found.' : 'لا توجد رسائل.'}</p>
              </div>
            ) : (
              filteredMessages.map(m => (
                <div
                  key={m.id}
                  onClick={() => handleOpenMessage(m)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                    selectedMessage && selectedMessage.id === m.id
                      ? 'bg-red-50/20 dark:bg-red-950/10 border-red-500/50'
                      : m.status === 'new'
                      ? 'bg-white dark:bg-[#16181c] border-gray-350 dark:border-gray-700 shadow-sm font-semibold'
                      : 'bg-white dark:bg-[#16181c]/60 border-gray-200 dark:border-gray-800 shadow-sm text-gray-500'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className={`p-2 rounded-lg shrink-0 ${
                    m.status === 'new'
                      ? 'bg-red-500/10 text-red-550'
                      : m.status === 'read'
                      ? 'bg-blue-500/10 text-blue-550'
                      : 'bg-gray-550/10 text-gray-500'
                  }`}>
                    {m.status === 'new' ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </div>

                  {/* Summary details */}
                  <div className="flex-grow min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {m.name}
                      </h3>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400 truncate">
                      {m.email} | {m.phone}
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-450 truncate mt-1">
                      {m.message}
                    </p>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Right panel: message details reader view */}
          <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm transition-colors min-h-[300px] flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-6 flex-grow flex flex-col justify-between h-full">
                
                {/* Header details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-150 dark:border-gray-850">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Message Reader
                    </span>
                    <button 
                      onClick={() => setSelectedMessage(null)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                      <User className="w-4 h-4 text-red-500" />
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${selectedMessage.email}`} className="hover:underline">{selectedMessage.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Phone className="w-4 h-4 text-green-500" />
                      <a href={`tel:${selectedMessage.phone}`} className="hover:underline">{selectedMessage.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-grow my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-300 max-h-[30vh] overflow-y-auto">
                  {selectedMessage.message}
                </div>

                {/* Status operations */}
                <div className="flex items-center justify-end gap-2 border-t border-gray-150 dark:border-gray-855 pt-4">
                  {selectedMessage.status !== 'read' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>
                  )}

                  {selectedMessage.status !== 'archived' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'archived')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                      title="Archive message"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400 space-y-2 flex-grow">
                <MailOpen className="w-10 h-10 text-gray-300" />
                <p className="text-sm font-semibold">
                  {currentLang === 'en' ? 'Select a message to read' : 'اختر رسالة لعرض محتواها'}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
