'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await response.json();

      if (!data.user) {
        router.push('/login');
        return;
      }

      setUser(data.user);
      setLoading(false);
    } catch (error) {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-[#FFF9EF]">
          <div className="text-center">
            <div className="text-4xl animate-spin">⏳</div>
            <p className="mt-4 text-gray-600 font-heading">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-[#FFF9EF] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold text-[#202020] mb-8">
            My Profile
          </h1>

          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-[#F3C11B] rounded-full flex items-center justify-center text-[#F47113] font-bold text-4xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-[#202020]">
                  {user?.name}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    user?.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Hostel/Location</p>
                <p className="font-semibold text-[#202020]">{user?.hostel || 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-semibold text-[#202020]">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-heading font-semibold text-[#202020] mb-4">
                Account Actions
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-[#F47113] text-white py-3 px-4 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-heading font-semibold hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
