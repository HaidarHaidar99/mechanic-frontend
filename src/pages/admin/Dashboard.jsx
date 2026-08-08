import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  ShoppingBag, Mail, Users, AlertCircle, MessageSquare, 
  Calendar, ArrowUpRight, Plus, Eye, ShieldCheck, Wrench
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { i18n } = useTranslation();
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const currentLang = i18n.language || 'en';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/stats');
        if (res.success) {
          setData(res.data);
        } else {
          throw new Error(res.message || 'Failed to fetch dashboard stats');
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
        setError(err.message || 'Could not load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Title skeleton */}
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
        
        {/* Stats Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-28 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6" />
          ))}
        </div>

        {/* Lists grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6" />
          <div className="h-96 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-955/20 text-red-400 rounded-2xl border border-red-900/50 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const { stats, recentProducts, recentMessages } = data;
  const isSuper = admin && admin.role === 'super_admin';

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block font-heading">
            {currentLang === 'en' ? 'Console Statistics' : 'إحصائيات النظام الفنية'}
          </span>
          <h1 className="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-heading mt-1">
            {currentLang === 'en' ? 'Dashboard Overview' : 'نظرة عامة على لوحة التحكم'}
          </h1>
        </div>
        <Link 
          to="/admin/products" 
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-650 hover:bg-red-755 rounded-xl transition-all shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{currentLang === 'en' ? 'Add Product' : 'إضافة منتج'}</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Products */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {currentLang === 'en' ? 'Total Products' : 'إجمالي المنتجات'}
            </span>
            <div className="text-2xl font-black text-zinc-950 dark:text-white font-heading">
              {stats.totalProducts}
            </div>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Total Messages */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {currentLang === 'en' ? 'Total Messages' : 'إجمالي الرسائل'}
            </span>
            <div className="text-2xl font-black text-zinc-950 dark:text-white font-heading">
              {stats.totalMessages}
            </div>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        {/* Unread/New Messages */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {currentLang === 'en' ? 'New Messages' : 'الرسائل الجديدة'}
            </span>
            <div className="text-2xl font-black text-red-600 dark:text-red-500 font-heading">
              {stats.unreadMessages}
            </div>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Total Admins */}
        {isSuper ? (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-colors">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                {currentLang === 'en' ? 'Total Admins' : 'إجمالي المشرفين'}
              </span>
              <div className="text-2xl font-black text-zinc-950 dark:text-white font-heading">
                {stats.totalAdmins}
              </div>
            </div>
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-colors opacity-40">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                {currentLang === 'en' ? 'Admins Panel' : 'لوحة المشرفين'}
              </span>
              <div className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
                {currentLang === 'en' ? 'Restricted' : 'محدود'}
              </div>
            </div>
            <div className="p-3 bg-zinc-500/10 text-zinc-500 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
        )}

      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Products */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/10">
            <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-widest font-heading">
              {currentLang === 'en' ? 'Recent Products' : 'أحدث المنتجات'}
            </h2>
            <Link to="/admin/products" className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-0.5">
              <span>{currentLang === 'en' ? 'Manage Inventory' : 'إدارة المخزون'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 flex-grow">
            {recentProducts.length === 0 ? (
              <div className="text-center py-12 text-zinc-450 text-xs font-semibold">
                {currentLang === 'en' ? 'No products registered yet.' : 'لا توجد منتجات مسجلة بعد.'}
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {recentProducts.map(p => {
                  const name = p.name[currentLang] || p.name['en'] || '';
                  return (
                    <div key={p.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                      <img src={p.imageBase64} alt={name} className="w-9 h-9 rounded-lg object-cover bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900/40 shrink-0" />
                      <div className="flex-grow min-w-0">
                        <div className="text-xs font-bold text-zinc-900 dark:text-white truncate font-heading">{name}</div>
                        <div className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{p.category[currentLang] || p.category['en']}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-extrabold text-zinc-950 dark:text-white font-heading">${p.price.toFixed(2)}</div>
                        <span className={`inline-block text-[8px] font-black tracking-widest uppercase mt-0.5 ${p.isActive ? 'text-green-500' : 'text-red-500'}`}>
                          {p.isActive ? (currentLang === 'en' ? 'ACTIVE' : 'نشط') : (currentLang === 'en' ? 'INACTIVE' : 'غير نشط')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/10">
            <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-widest font-heading">
              {currentLang === 'en' ? 'Recent Messages' : 'أحدث الرسائل الواردة'}
            </h2>
            <Link to="/admin/messages" className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-0.5">
              <span>{currentLang === 'en' ? 'Open Messages Box' : 'فتح صندوق الرسائل'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 flex-grow">
            {recentMessages.length === 0 ? (
              <div className="text-center py-12 text-zinc-455 text-xs font-semibold">
                {currentLang === 'en' ? 'No messages received yet.' : 'لا توجد رسائل واردة بعد.'}
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {recentMessages.map(m => (
                  <div key={m.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-bold text-zinc-900 dark:text-white font-heading">{m.name}</div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                          m.status === 'new' 
                            ? 'bg-red-500/10 text-red-550' 
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
                        }`}>
                          {m.status}
                        </span>
                        <div className="text-[9px] text-zinc-400 flex items-center gap-1 font-bold">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-450 line-clamp-1 leading-relaxed">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
