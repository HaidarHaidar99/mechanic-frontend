import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  ShoppingBag, Mail, Users, AlertCircle, MessageSquare, 
  Calendar, ArrowUpRight, Plus, Eye 
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
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        
        {/* Stats Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-28 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl p-6" />
          ))}
        </div>

        {/* Lists grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl p-6" />
          <div className="h-96 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl p-6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const { stats, recentProducts, recentMessages } = data;
  const isSuper = admin && admin.role === 'super_admin';

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            {currentLang === 'en' ? 'Dashboard Overview' : 'نظرة عامة على لوحة التحكم'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {currentLang === 'en' 
              ? 'Real-time quick metrics and recent store submissions.' 
              : 'القياسات السريعة الفورية والرسائل الأخيرة الواردة للمتجر.'}
          </p>
        </div>
        <Link 
          to="/admin/products" 
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-755 rounded-xl transition-all shadow"
        >
          <Plus className="w-4 h-4" />
          <span>{currentLang === 'en' ? 'Add Product' : 'إضافة منتج'}</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Products */}
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {currentLang === 'en' ? 'Total Products' : 'إجمالي المنتجات'}
            </span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {stats.totalProducts}
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Messages */}
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {currentLang === 'en' ? 'Total Messages' : 'إجمالي الرسائل'}
            </span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {stats.totalMessages}
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        {/* Unread/New Messages */}
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {currentLang === 'en' ? 'New Messages' : 'الرسائل الجديدة'}
            </span>
            <div className="text-2xl font-extrabold text-red-600 dark:text-red-500">
              {stats.unreadMessages}
            </div>
          </div>
          <div className="p-3 bg-red-550/10 text-red-500 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Total Admins (Omit if normal admin) */}
        {isSuper ? (
          <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {currentLang === 'en' ? 'Total Admins' : 'إجمالي المشرفين'}
              </span>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {stats.totalAdmins}
              </div>
            </div>
            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-colors opacity-60">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {currentLang === 'en' ? 'Admins Panel' : 'لوحة المشرفين'}
              </span>
              <div className="text-sm font-semibold text-gray-500 mt-1">
                {currentLang === 'en' ? 'Restricted Access' : 'محدود الوصول'}
              </div>
            </div>
            <div className="p-3 bg-gray-500/10 text-gray-500 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
        )}

      </div>

      {/* Lists Section (Recent Products & Recent Messages) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Products */}
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-4 border-b border-gray-150 dark:border-gray-850 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/10">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {currentLang === 'en' ? 'Recent Products' : 'أحدث المنتجات'}
            </h2>
            <Link to="/admin/products" className="text-xs text-red-650 hover:underline flex items-center gap-0.5">
              <span>{currentLang === 'en' ? 'Manage Inventory' : 'إدارة المخزون'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4 flex-grow">
            {recentProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                {currentLang === 'en' ? 'No products registered yet.' : 'لا توجد منتجات مسجلة بعد.'}
              </div>
            ) : (
              <div className="divide-y divide-gray-150 dark:divide-gray-850">
                {recentProducts.map(p => {
                  const name = p.name[currentLang] || p.name['en'] || '';
                  return (
                    <div key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <img src={p.imageBase64} alt={name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-900 flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">{p.category[currentLang] || p.category['en']}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-950 dark:text-white">${p.price.toFixed(2)}</div>
                        <div className={`text-[10px] font-bold ${p.isActive ? 'text-green-500' : 'text-red-500'}`}>
                          {p.isActive ? (currentLang === 'en' ? 'ACTIVE' : 'نشط') : (currentLang === 'en' ? 'INACTIVE' : 'غير نشط')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-4 border-b border-gray-150 dark:border-gray-850 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/10">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {currentLang === 'en' ? 'Recent Messages' : 'أحدث الرسائل الواردة'}
            </h2>
            <Link to="/admin/messages" className="text-xs text-red-650 hover:underline flex items-center gap-0.5">
              <span>{currentLang === 'en' ? 'Open Messages Box' : 'فتح صندوق الرسائل'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4 flex-grow">
            {recentMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                {currentLang === 'en' ? 'No messages received yet.' : 'لا توجد رسائل واردة بعد.'}
              </div>
            ) : (
              <div className="divide-y divide-gray-150 dark:divide-gray-850">
                {recentMessages.map(m => (
                  <div key={m.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{m.name}</div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          m.status === 'new' 
                            ? 'bg-red-500/15 text-red-600 dark:text-red-400' 
                            : m.status === 'read'
                            ? 'bg-blue-500/15 text-blue-650 dark:text-blue-400'
                            : 'bg-gray-500/15 text-gray-500'
                        }`}>
                          {m.status.toUpperCase()}
                        </span>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{m.message}</p>
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
