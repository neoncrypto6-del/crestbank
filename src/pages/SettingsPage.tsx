import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import {
  User,
  ShieldCheck,
  Users,
  Key,
  Hash,
  LogOut,
  ChevronRight } from
'lucide-react';
export function SettingsPage() {
  const { logout } = useAuth();
  const menuItems = [
  {
    name: 'Profile Information',
    icon: User,
    link: '#/settings/profile',
    desc: 'View your personal details'
  },
  {
    name: 'Document Verification',
    icon: ShieldCheck,
    link: '#/settings/verification',
    desc: 'Upload ID and proof of address'
  },
  {
    name: 'Next of Kin',
    icon: Users,
    link: '#/settings/next-of-kin',
    desc: 'Manage beneficiary details'
  },
  {
    name: 'Change Password',
    icon: Key,
    link: '#/settings/change-password',
    desc: 'Update your login password'
  },
  {
    name: 'Transaction PIN',
    icon: Hash,
    link: '#/settings/create-pin',
    desc: 'Set or change your 4-digit PIN'
  }];

  return (
    <DashboardLayout title="Settings" showBack>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-light text-gray-900 mb-8">
          Account Settings
        </h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.link}
                className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-[#0060AF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </a>);

          })}
        </div>

        <button
          onClick={logout}
          className="mt-8 w-full bg-white border border-red-200 text-red-600 font-semibold py-4 rounded-xl shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center">
          
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </button>
      </div>
    </DashboardLayout>);

}