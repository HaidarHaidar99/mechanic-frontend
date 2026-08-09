import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  ShoppingBag, Mail, Users, Trash2, CheckCircle2, 
  Archive, ShieldCheck, MailOpen, ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { admin } = useAdminAuth();
  const currentLang = i18n.language || 'en';

  const [stats, setStats] = useState({
    productsCount: 0,
    messagesCount: 0,
    adminsCount: 0
  });

  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, messagesRes] = await Promise.all([
          apiRequest('/admin/stats'),
          apiRequest('/messages?limit=5')
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (messagesRes.success && messagesRes.data) {
          setRecentMessages(messagesRes.data);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* Header Greeting */}
      <div>
        <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
          {currentLang === 'en' ? 'Console Overview' : 'نظرة عامة على لوحة التحكم'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
          {t('admin.nav.dashboard') || 'Dashboard'}
        </h1>
        {admin && (
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-semibold leading-relaxed">
            {currentLang === 'en' 
              ? `Welcome back, ${admin.fullName}. Manage your products, announcements, and customer inbox.`
              : `أهلاً بك مجدداً، ${admin.fullName}. قم بإدارة منتجاتك، وإعلاناتك، وصندوق رسائل العملاء.`}
          </p>
        )}
      </div>

      {/* KPI Stats widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Products KPI */}
        <Link 
          to="/admin/products"
          className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl shadow-sm hover:border-[var(--border-strong)] transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block font-heading">
              {t('admin.dashboard.products') || 'Total Products'}
            </span>
            <div className="text-3xl font-black text-[var(--text-primary)] font-heading">
              {loading ? <Skeleton variant="text" width="40px" height="30px" className="mt-1" /> : stats.productsCount}
            </div>
          </div>
          <div className="p-3.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl group-hover:scale-105 transition-all">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </Link>

        {/* Messages KPI */}
        <Link 
          to="/admin/messages"
          className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl shadow-sm hover:border-[var(--border-strong)] transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block font-heading">
              {t('admin.dashboard.messages') || 'Total Messages'}
            </span>
            <div className="text-3xl font-black text-[var(--text-primary)] font-heading">
              {loading ? <Skeleton variant="text" width="40px" height="30px" className="mt-1" /> : stats.messagesCount}
            </div>
          </div>
          <div className="p-3.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl group-hover:scale-105 transition-all">
            <Mail className="w-6 h-6" />
          </div>
        </Link>

        {/* Admins KPI */}
        <Link 
          to={admin?.role === 'super_admin' ? '/admin/admins' : '#'}
          className={`bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl shadow-sm transition-all flex items-center justify-between group ${
            admin?.role === 'super_admin' ? 'hover:border-[var(--border-strong)]' : 'cursor-default'
          }`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block font-heading">
              {t('admin.dashboard.admins') || 'Total Admins'}
            </span>
            <div className="text-3xl font-black text-[var(--text-primary)] font-heading">
              {loading ? <Skeleton variant="text" width="40px" height="30px" className="mt-1" /> : stats.adminsCount}
            </div>
          </div>
          <div className="p-3.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl group-hover:scale-105 transition-all">
            <Users className="w-6 h-6" />
          </div>
        </Link>

      </div>

      {/* Recent Messages list grid */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-[var(--text-primary)] font-heading">
            {t('admin.dashboard.recent_messages') || 'Recent Messages'}
          </h2>
          <Link 
            to="/admin/messages" 
            className="text-[10px] font-black text-[var(--accent)] hover:underline uppercase tracking-widest inline-flex items-center gap-1 font-heading"
          >
            <span>{currentLang === 'en' ? 'Go to Inbox' : 'اذهب إلى الوارد'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border border-[var(--border)] rounded-2xl animate-pulse">
                <Skeleton variant="circle" width="32px" height="32px" />
                <div className="flex-grow space-y-2">
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="80%" />
                </div>
              </div>
            ))}
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="text-center py-10">
            <Mail className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-xs text-[var(--text-secondary)] font-bold">
              {currentLang === 'en' ? 'No incoming messages found' : 'لا يوجد رسائل واردة'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {recentMessages.map((msg) => {
              const statusVariants = {
                new: 'primary',
                read: 'neutral',
                archived: 'neutral'
              };

              return (
                <div key={msg.id} className="py-4.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4 font-sans text-xs">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[var(--text-primary)]">{msg.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">({msg.email})</span>
                      <Badge variant={statusVariants[msg.status || 'new']}>
                        {msg.status || 'new'}
                      </Badge>
                    </div>
                    <p className="text-[var(--text-secondary)] line-clamp-1 truncate pr-4">
                      {msg.message}
                    </p>
                    <div className="text-[10px] text-[var(--text-muted)] font-medium">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
