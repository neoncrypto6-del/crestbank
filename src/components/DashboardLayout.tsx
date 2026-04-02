import React, { useEffect, useState } from 'react';
import { Bell, Settings, LogOut, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Notification } from '../lib/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export function DashboardLayout({
  children,
  title,
  showBack = false
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const channel = supabase
      .channel('dashboard-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    }
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full bg-[#117A3E] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {showBack && (
              <button
                onClick={() => window.history.back()}
                className="mr-4 hover:bg-white/10 p-2 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <a href="#/dashboard" className="flex items-center">
              <img
                src="/chasebank.png"
                alt="Crest"
                className="h-6 object-contain brightness-0 invert" />
            </a>
            {title && (
              <span className="ml-4 pl-4 border-l border-white/30 font-medium hidden sm:block">
                {title}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsNotifOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <a
              href="#/settings"
              className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </a>
            <button
              onClick={logout}
              className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
              title="Sign Out">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsNotifOpen(false)} 
          />
          
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="bg-[#117A3E] text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">News & Notifications</h3>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="hover:bg-white/10 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {unreadCount > 0 && (
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#117A3E] font-medium hover:underline">
                  Mark all as read ({unreadCount})
                </button>
              </div>
            )}

            <div className="flex-grow overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notif.read 
                          ? 'bg-green-50/70 border-l-4 border-l-[#117A3E]' 
                          : 'border-l-4 border-l-transparent'
                      }`}
                      onClick={() => {
                        if (!notif.read) markAsRead(notif.id);
                      }}>
                      <div className="flex justify-between items-start mb-1">
                        <p
                          className={`text-sm ${
                            !notif.read 
                              ? 'font-semibold text-gray-900' 
                              : 'text-gray-700'
                          }`}>
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-[#117A3E] rounded-full flex-shrink-0 mt-1.5 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
