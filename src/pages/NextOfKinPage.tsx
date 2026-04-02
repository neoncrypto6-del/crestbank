import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Users, CheckCircle, Clock, Trash2, Upload } from 'lucide-react';

const RELATIONSHIPS = ['Parent', 'Spouse', 'Sibling', 'Child', 'Other'];

const DOCUMENT_TYPES = [
{ key: 'id_front', label: 'ID Card Front', accept: 'image/*,.pdf' },
{ key: 'id_back', label: 'ID Card Back', accept: 'image/*,.pdf' },
{ key: 'ssn_card', label: 'SSN Card', accept: 'image/*,.pdf' },
{ key: 'w2', label: 'W-2 Form', accept: '.pdf,image/*' },
{ key: 'proof_address', label: 'Proof of Address', accept: '.pdf,image/*' }] as
const;

type DocumentKey = (typeof DOCUMENT_TYPES)[number]['key'];
type FileState = Partial<Record<DocumentKey, File | null>>;

export function NextOfKinPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [nokId, setNokId] = useState<string | null>(null);
  const [status, setStatus] = useState('Not Submitted');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    address: '',
    ssn: '',
    relationship: RELATIONSHIPS[0]
  });

  const [files, setFiles] = useState<FileState>({});
  const [uploadProgress, setUploadProgress] = useState<Record<DocumentKey, string>>({});

  useEffect(() => {
    if (user) {
      fetchNextOfKin();
    }
  }, [user]);

  const fetchNextOfKin = async () => {
    try {
      const { data, error } = await supabase.
      from('next_of_kin').
      select('*').
      eq('user_id', user?.id).
      single();

      if (data) {
        setNokId(data.id);
        setStatus(data.verification_status || 'Pending');

        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          email: data.email || '',
          date_of_birth: data.date_of_birth || '',
          address: data.address || '',
          ssn: data.ssn || '',
          relationship: data.relationship || RELATIONSHIPS[0]
        });
      }
    } catch (err) {

      // No record found → fine
    } finally {setFetching(false);
    }
  };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (key: DocumentKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError(`${file.name} is too large (max 10MB allowed)`);
      return;
    }

    setFiles((prev) => ({ ...prev, [key]: file }));
    setUploadProgress((prev) => ({ ...prev, [key]: '' }));
  };

  const removeFile = (key: DocumentKey) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
    setUploadProgress((prev) => ({ ...prev, [key]: '' }));
  };

  const uploadDocument = async (nok_id: string, key: DocumentKey, file: File) => {
    const fileExt = file.name.split('.').pop() || 'pdf';
    const fileName = `${key}.${fileExt}`;
    const filePath = `${user!.id}/${nok_id}/${fileName}`;

    setUploadProgress((prev) => ({ ...prev, [key]: 'Uploading...' }));

    const { error: uploadError } = await supabase.storage.
    from('uploads') // ← Changed to your actual bucket name
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.
    from('uploads') // ← Changed here too
    .getPublicUrl(filePath);

    setUploadProgress((prev) => ({ ...prev, [key]: 'Uploaded' }));

    return { [key]: urlData.publicUrl };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!user) throw new Error('Not authenticated');

      // Convert empty date string to null
      const cleanedFormData = {
        ...formData,
        date_of_birth: formData.date_of_birth.trim() === '' ? null : formData.date_of_birth
      };

      const payload = {
        user_id: user.id,
        ...cleanedFormData,
        verification_status: 'Pending Review'
      };

      let result;
      let currentNokId = nokId;

      if (nokId) {
        result = await supabase.
        from('next_of_kin').
        update(payload).
        eq('id', nokId).
        select().
        single();
      } else {
        result = await supabase.
        from('next_of_kin').
        insert([payload]).
        select().
        single();

        if (result.data) {
          currentNokId = result.data.id;
          setNokId(currentNokId);
        }
      }

      if (result.error) throw result.error;

      // Upload any selected documents (completely optional)
      if (currentNokId && Object.values(files).some(Boolean)) {
        const uploads = await Promise.all(
          DOCUMENT_TYPES.map(async ({ key }) => {
            const file = files[key];
            if (!file) return null;
            try {
              return await uploadDocument(currentNokId!, key, file);
            } catch (uploadErr) {
              console.error(`Upload failed for ${key}:`, uploadErr);
              return null;
            }
          })
        );

        const successfulUploads = uploads.filter(Boolean);
        if (successfulUploads.length > 0) {
          const documents = Object.assign({}, ...successfulUploads);

          const { error: docError } = await supabase.
          from('next_of_kin').
          update({ documents }).
          eq('id', currentNokId);

          if (docError) throw docError;
        }
      }

      setSuccess(true);
      setStatus('Pending Review');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save details');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout title="Next of Kin" showBack>
        <div className="p-12 text-center">Loading...</div>
      </DashboardLayout>);

  }

  return (
    <DashboardLayout title="Next of Kin" showBack>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div
            className={`p-6 flex items-center ${
            status === 'Verified' ?
            'bg-green-50' :
            status === 'Not Submitted' ?
            'bg-gray-50' :
            'bg-yellow-50'}`
            }>
            
            {status === 'Verified' ?
            <CheckCircle className="w-8 h-8 text-green-500 mr-4" /> :
            status === 'Not Submitted' ?
            <Users className="w-8 h-8 text-gray-400 mr-4" /> :

            <Clock className="w-8 h-8 text-yellow-500 mr-4" />
            }
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Status: {status}</h2>
              <p
                className={`text-sm ${
                status === 'Verified' ?
                'text-green-700' :
                status === 'Not Submitted' ?
                'text-gray-500' :
                'text-yellow-700'}`
                }>
                
                {status === 'Verified' ?
                'Beneficiary details verified.' :
                status === 'Not Submitted' ?
                'Please provide your beneficiary details below.' :
                'Details submitted and pending review.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Beneficiary Information
          </h3>

          {error &&
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          }
          {success &&
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
              Details saved successfully!
            </div>
          }

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none" />
                
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none">
                  
                  {RELATIONSHIPS.map((opt) =>
                  <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none" />
                
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none" />
                
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  required
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none"
                  max={new Date().toISOString().split('T')[0]} />
                
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ssn"
                  required
                  value={formData.ssn}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none"
                  placeholder="XXX-XX-XXXX" />
                
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none" />
                
              </div>
            </div>

            {/* Documents Section – optional */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-base font-medium text-gray-900 mb-4">
                Verification Documents
              </h4>

              <div className="space-y-4">
                {DOCUMENT_TYPES.map(({ key, label, accept }) =>
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>

                    {files[key] ?
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center">
                          <Upload className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-sm text-gray-800 truncate max-w-xs">
                            {files[key]!.name}
                          </span>
                        </div>
                        <button
                      type="button"
                      onClick={() => removeFile(key)}
                      className="text-red-600 hover:text-red-800">
                      
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div> :

                  <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange(key)}
                    className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100" />






                  }

                    {uploadProgress[key] &&
                  <p className="mt-1 text-xs text-blue-600">{uploadProgress[key]}</p>
                  }
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 mt-8">
              
              {loading ? 'Saving...' : 'Save & Submit for Review'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>);

}