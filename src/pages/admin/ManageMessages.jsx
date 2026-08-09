import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { 
  Mail, MailOpen, Archive, CheckCircle, Trash2, 
  Calendar, Phone, User, AlertCircle, RefreshCw, X 
} from 'lucide-react';
import Button from '../../components/common/Button';
import IconButton from '../../components/common/IconButton';
import Badge from '../../components/common/Badge';

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
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
          Inbox console
        </span>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
          {currentLang === 'en' ? 'Contact Message Box' : 'صندوق رسائل الاتصال'}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {currentLang === 'en' ? 'Read and manage customer inquiries and messages.' : 'قراءة وإدارة الاستفسارات والرسائل الواردة من العملاء.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-[var(--border)] text-xs font-heading">
        {['all', 'new', 'read', 'archived'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              filter === tab
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl text-xs font-bold border border-[var(--danger)]/20">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main split view layout */}
      {loading ? (
        <div className="text-center py-16 text-xs text-[var(--text-secondary)] flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent)]" />
          <span>Loading messages...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* List pane */}
          <div className="lg:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[var(--border-strong)] rounded-3xl bg-[var(--surface-elevated)]/30">
                <Mail className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">{currentLang === 'en' ? 'No messages found.' : 'لا توجد رسائل.'}</p>
              </div>
            ) : (
              filteredMessages.map(m => (
                <div
                  key={m.id}
                  onClick={() => handleOpenMessage(m)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    selectedMessage && selectedMessage.id === m.id
                      ? 'bg-[var(--accent)]/5 border-[var(--accent)]/30 shadow-sm'
                      : m.status === 'new'
                      ? 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)] shadow-sm'
                      : 'bg-[var(--surface-elevated)]/60 border-[var(--border)] opacity-70 hover:opacity-100 hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    m.status === 'new'
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] animate-pulse'
                      : 'bg-[var(--surface-hover)] text-[var(--text-muted)]'
                  }`}>
                    {m.status === 'new' ? <Mail className="w-4.5 h-4.5" /> : <MailOpen className="w-4.5 h-4.5" />}
                  </div>

                  <div className="flex-grow min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-[var(--text-primary)] truncate font-heading uppercase">
                        {m.name}
                      </h3>
                      <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 shrink-0 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-[10px] font-bold text-[var(--text-secondary)] truncate uppercase tracking-widest">
                      {m.email} | {m.phone}
                    </div>
                    
                    <p className="text-xs text-[var(--text-secondary)] truncate mt-1">
                      {m.message}
                    </p>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Reader Pane */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-6 flex-grow flex flex-col justify-between h-full animate-fade-in">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest font-heading">
                      Message Reader
                    </span>
                    <IconButton 
                      icon={X}
                      variant="ghost"
                      onClick={() => setSelectedMessage(null)}
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)] font-heading">
                      <User className="w-4 h-4 text-[var(--accent)]" />
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Mail className="w-4 h-4 shrink-0 text-[var(--text-muted)]" />
                      <a href={`mailto:${selectedMessage.email}`} className="hover:underline">{selectedMessage.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Phone className="w-4 h-4 shrink-0 text-green-500" />
                      <a href={`tel:${selectedMessage.phone}`} className="hover:underline">{selectedMessage.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-bold">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Message Body Content */}
                <div className="flex-grow my-4 p-4 bg-[var(--page-bg)] border border-[var(--border)] rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-[var(--text-primary)] max-h-[30vh] overflow-y-auto font-sans">
                  {selectedMessage.message}
                </div>

                {/* Action updates */}
                <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] pt-4 mt-auto">
                  {selectedMessage.status !== 'read' && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                      variant="primary"
                      icon={CheckCircle}
                    >
                      Read
                    </Button>
                  )}

                  {selectedMessage.status !== 'archived' && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'archived')}
                      variant="secondary"
                      icon={Archive}
                    >
                      Archive
                    </Button>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 text-[var(--text-muted)] space-y-3 flex-grow">
                <Mail className="w-8 h-8 text-[var(--text-muted)]" />
                <p className="text-[10px] font-black uppercase tracking-widest">
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
