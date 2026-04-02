import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Notification } from '../lib/types';

export function NotificationOverlay() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setNotifications(data);
        setIsOpen(true);
      }
    };

    fetchNotifications();

    // Realtime subscription
    const channel = supabase
      .channel('public:notifications')
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
          setIsOpen(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notifications.length <= 1) setIsOpen(false);
  };

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user?.id);

    setNotifications([]);
    setIsOpen(false);
  };

  if (!isOpen || notifications.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-green-50 border border-green-100 p-4 rounded-lg relative">
              <p className="text-gray-800 text-sm pr-6">{notif.message}</p>
              <button
                onClick={() => markAsRead(notif.id)}
                className="absolute top-2 right-2 text-green-500 hover:text-green-600">
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(notif.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={markAllAsRead}
            className="w-full text-center text-sm text-[#117A3E] font-medium hover:underline">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}
