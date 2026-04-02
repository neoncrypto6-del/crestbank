import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Upload, FileText, CheckCircle, Clock } from 'lucide-react';
const DOC_TYPES = [
{
  id: 'id_front',
  label: 'ID Card (Front)'
},
{
  id: 'id_back',
  label: 'ID Card (Back)'
},
{
  id: 'ssn',
  label: 'SSN Document'
},
{
  id: 'w2',
  label: 'W2 Document'
},
{
  id: 'address',
  label: 'Proof of Address'
}];

export function VerificationPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Record<string, any>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);
  const fetchDocuments = async () => {
    if (!user) return;
    const { data } = await supabase.
    from('documents').
    select('*').
    eq('user_id', user.id);
    if (data) {
      const docMap: Record<string, any> = {};
      data.forEach((doc) => {
        docMap[doc.type] = doc;
      });
      setDocuments(docMap);
    }
  };
  const handleUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  type: string) =>
  {
    if (!e.target.files || !e.target.files[0] || !user) return;
    const file = e.target.files[0];
    setUploading(type);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.
      from('uploads').
      upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl }
      } = supabase.storage.from('uploads').getPublicUrl(fileName);
      // Upsert document record
      const { error: dbError } = await supabase.from('documents').upsert(
        {
          user_id: user.id,
          type: type,
          url: publicUrl,
          status: 'pending'
        },
        {
          onConflict: 'user_id, type'
        }
      ); // Assuming unique constraint exists, otherwise might insert duplicate
      if (dbError) throw dbError;
      await fetchDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document');
    } finally {
      setUploading(null);
    }
  };
  if (!user) return null;
  const isVerified = user.verification_status?.toLowerCase() === 'verified';
  return (
    <DashboardLayout title="Document Verification" showBack>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div
            className={`p-6 flex items-center ${isVerified ? 'bg-green-50' : 'bg-yellow-50'}`}>
            
            {isVerified ?
            <CheckCircle className="w-8 h-8 text-green-500 mr-4" /> :

            <Clock className="w-8 h-8 text-yellow-500 mr-4" />
            }
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Status: {user.verification_status || 'Pending Review'}
              </h2>
              <p
                className={`text-sm ${isVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                
                {isVerified ?
                'Your account is fully verified. No further action needed.' :
                'Please upload the required documents below to verify your account.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-[#0060AF]" /> Required
            Documents
          </h3>

          <div className="space-y-6">
            {DOC_TYPES.map((doc) => {
              const existingDoc = documents[doc.id];
              const isUploading = uploading === doc.id;
              return (
                <div
                  key={doc.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  
                  <div className="flex items-center mb-4 md:mb-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${existingDoc ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      
                      {existingDoc ?
                      <CheckCircle className="w-5 h-5" /> :

                      <FileText className="w-5 h-5" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.label}</p>
                      <p className="text-xs text-gray-500">
                        {existingDoc ?
                        `Uploaded • Status: ${existingDoc.status}` :
                        'Not uploaded'}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      disabled={isUploading}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center w-full md:w-auto ${existingDoc ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-50 text-[#0060AF] hover:bg-blue-100'}`}>
                      
                      {isUploading ?
                      'Uploading...' :
                      existingDoc ?
                      'Update File' :
                      'Upload File'}
                      {!isUploading && <Upload className="w-4 h-4 ml-2" />}
                    </button>
                    <input
                      type="file"
                      onChange={(e) => handleUpload(e, doc.id)}
                      accept="image/*,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    
                  </div>
                </div>);

            })}
          </div>
        </div>
      </div>
    </DashboardLayout>);

}