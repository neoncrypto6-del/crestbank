import React, { useState, useRef } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Building } from 'lucide-react';

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl }
      } = supabase.storage.from('uploads').getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshUser();
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  const InfoRow = ({
    icon: Icon,
    label,
    value
  }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start py-4 border-b border-gray-100 last:border-0">
      <div className="mt-0.5">
        <Icon className="w-5 h-5 text-gray-400 mr-4" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="Profile Information" showBack>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header & Avatar */}
          <div className="bg-[#117A3E] p-8 flex flex-col items-center justify-center text-white relative">
            <div className="relative mb-4 group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-gray-200 flex items-center justify-center">
                {user.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt={user.full_name}
                    className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#117A3E] rounded-full border-2 border-white flex items-center justify-center hover:bg-[#0e6332] transition-colors shadow-md group-hover:scale-110">
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePicUpload}
                accept="image/*"
                className="hidden" />
            </div>
            <h2 className="text-2xl font-bold">{user.full_name}</h2>
            <p className="text-green-200">@{user.username}</p>
            {uploading && (
              <p className="text-xs text-green-200 mt-2">Uploading...</p>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div className="space-y-1">
                <InfoRow icon={Mail} label="Email Address" value={user.email} />
                <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={user.date_of_birth} />
                <InfoRow icon={MapPin} label="Address" value={user.address} />
              </div>

              <div className="space-y-1">
                <InfoRow
                  icon={Building}
                  label="Account Type"
                  value={user.account_type} />
                <InfoRow
                  icon={Hash}
                  label="Account Number"
                  value={user.account_number} />
                <InfoRow
                  icon={Hash}
                  label="Routing Number"
                  value={user.routing_number} />
                <InfoRow
                  icon={User}
                  label="SSN"
                  value={`***-**-${user.ssn.slice(-4)}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
