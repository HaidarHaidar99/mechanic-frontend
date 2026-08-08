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
      <div className="border-b border-zinc-200 dark:border-zinc-900 pb-4">
        <h1 className="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-heading">
          {currentLang === 'en' ? 'Contact Message Box' : 'صندوق رسائل الاتصال'}
        </h1>
        <p className="text-xs text-zinc-400">
          {currentLang === 'en' ? 'Read and manage customer inquiries and messages.' : 'قراءة وإدارة الاستفسارات والرسائل الواردة من العملاء.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-900 text-xs">
        {['all', 'new', 'read', 'archived'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              filter === tab
                ? 'border-red-600 text-red-650 dark:border-red-500 dark:text-red-500'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Inbox layout split pane */}
      {loading ? (
        <div className="text-center py-12 text-xs text-zinc-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4.5 h-4.5 animate-spin" />
          <span>Loading messages...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left panel: messages list */}
          <div className="lg:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-250 dark:border-zinc-900 rounded-3xl bg-white dark:bg-[#121215]/20">
                <Mail className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                <p className="text-xs text-zinc-500 font-semibold">{currentLang === 'en' ? 'No messages found.' : 'لا توجد رسائل.'}</p>
              </div>
            ) : (
              filteredMessages.map(m => (
                <div
                  key={m.id}
                  onClick={() => handleOpenMessage(m)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    selectedMessage && selectedMessage.id === m.id
                      ? 'bg-red-500/5 dark:bg-red-500/5 border-red-500/40'
                      : m.status === 'new'
                      ? 'bg-white dark:bg-[#121215] border-zinc-300 dark:border-zinc-800 shadow-sm font-semibold'
                      : 'bg-white/60 dark:bg-[#121215]/60 border-zinc-205 dark:border-zinc-900/80 shadow-sm text-zinc-500'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className={`p-2 rounded-lg shrink-0 ${
                    m.status === 'new'
                      ? 'bg-red-500/10 text-red-500'
                      : m.status === 'read'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-zinc-500/10 text-zinc-400'
                  }`}>
                    {m.status === 'new' ? <Mail className="w-4.5 h-4.5 animate-pulse" /> : <MailOpen className="w-4.5 h-4.5" />}
                  </div>

                  {/* Summary details */}
                  <div className="flex-grow min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white truncate font-heading">
                        {m.name}
                      </h3>
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 shrink-0 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 truncate uppercase tracking-wider">
                      {m.email} | {m.phone}
                    </div>
                    
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1">
                      {m.message}
                    </p>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Right panel: message details reader view */}
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-sm transition-colors min-h-[350px] flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-6 flex-grow flex flex-col justify-between h-full animate-fade-in">
                
                {/* Header details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900/60">
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-550 uppercase tracking-widest font-heading">
                      Message Reader
                    </span>
                    <button 
                      onClick={() => setSelectedMessage(null)}
                      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full text-zinc-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-950 dark:text-white font-heading">
                      <User className="w-4 h-4 text-red-500" />
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <Mail className="w-4 h-4 shrink-0" />
                      <a href={`mailto:${selectedMessage.email}`} className="hover:underline">{selectedMessage.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <Phone className="w-4 h-4 shrink-0 text-green-500" />
                      <a href={`tel:${selectedMessage.phone}`} className="hover:underline">{selectedMessage.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-grow my-4 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900/60 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-zinc-700 dark:text-zinc-350 max-h-[30vh] overflow-y-auto font-sans">
                  {selectedMessage.message}
                </div>

                {/* Status operations */}
                <div className="flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-900/60 pt-4 mt-auto">
                  {selectedMessage.status !== 'read' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-sm"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>
                  )}

                  {selectedMessage.status !== 'archived' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'archived')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-500 hover:bg-zinc-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-sm"
                      title="Archive message"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 text-zinc-400 space-y-3 flex-grow animate-fade-in">
                <MailOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                <p className="text-xs font-bold uppercase tracking-widest">
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
