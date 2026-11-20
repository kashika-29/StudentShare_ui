'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ItemCard from '@/components/ItemCard';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data states
  const [myItems, setMyItems] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, activeTab]);

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

  const fetchDashboardData = async () => {
    try {
      // Fetch my items
      const itemsResponse = await fetch('/api/items?mine=true', { credentials: 'include' });
      const itemsData = await itemsResponse.json();
      setMyItems(itemsData.items || []);

      // Fetch incoming requests
      const incomingResponse = await fetch('/api/borrow-requests?scope=incoming', {
        credentials: 'include',
      });
      const incomingData = await incomingResponse.json();
      setIncomingRequests(incomingData.requests || []);

      // Fetch outgoing requests
      const outgoingResponse = await fetch('/api/borrow-requests?scope=outgoing', {
        credentials: 'include',
      });
      const outgoingData = await outgoingResponse.json();
      setOutgoingRequests(outgoingData.requests || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/borrow-requests/${requestId}/accept`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to accept request');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/borrow-requests/${requestId}/reject`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to reject request');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/borrow-requests/${requestId}/cancel`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to cancel request');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete item');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'listings', label: 'My Listings', icon: '📦' },
    { id: 'incoming', label: 'Incoming Requests', icon: '📥' },
    { id: 'outgoing', label: 'Outgoing Requests', icon: '📤' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-[#FFF9EF]">
          <div className="text-center">
            <div className="text-4xl animate-spin">⏳</div>
            <p className="mt-4 text-gray-600 font-heading">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-[#FFF9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-[#202020] mb-2">
              {activeTab === 'overview' ? `Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${user?.name?.split(' ')[0]}!` : 'My Activity'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'overview' ? "Here's what's happening with your marketplace activity." : 'Manage your marketplace activity'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
              <button onClick={() => setError('')} className="float-right font-bold ml-4">
                ×
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-24">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-heading font-medium transition-colors flex items-center space-x-3 ${
                        activeTab === tab.id
                          ? 'bg-[#F47113] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>

                <hr className="my-4" />

                <div className="space-y-2">
                  <Link
                    href="/offer"
                    className="block w-full text-center bg-[#F47113] text-white py-2 px-4 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors text-sm"
                  >
                    + Create Listing
                  </Link>
                  <Link
                    href="/browse"
                    className="block w-full text-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-heading font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 p-6 rounded-lg">
                      <div className="text-2xl mb-2">📦</div>
                      <div className="text-3xl font-bold text-[#F47113]">{myItems.length}</div>
                      <div className="text-sm text-gray-600">My Listings</div>
                    </div>
                    <div className="bg-white border border-gray-200 p-6 rounded-lg">
                      <div className="text-2xl mb-2">📥</div>
                      <div className="text-3xl font-bold text-[#F47113]">
                        {incomingRequests.filter((r) => r.status === 'PENDING').length}
                      </div>
                      <div className="text-sm text-gray-600">Pending Requests</div>
                    </div>
                    <div className="bg-white border border-gray-200 p-6 rounded-lg">
                      <div className="text-2xl mb-2">📤</div>
                      <div className="text-3xl font-bold text-[#F47113]">{outgoingRequests.length}</div>
                      <div className="text-sm text-gray-600">Outgoing Requests</div>
                    </div>
                    <div className="bg-white border border-gray-200 p-6 rounded-lg">
                      <div className="text-2xl mb-2">✅</div>
                      <div className="text-3xl font-bold text-[#F47113]">
                        {outgoingRequests.filter((r) => r.status === 'ACCEPTED').length}
                      </div>
                      <div className="text-sm text-gray-600">Active Transactions</div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 p-6 rounded-lg">
                      <h3 className="text-lg font-heading font-semibold text-[#202020] mb-4">
                        Recent Incoming Requests
                      </h3>
                      {incomingRequests.slice(0, 3).length > 0 ? (
                        <div className="space-y-4">
                          {incomingRequests.slice(0, 3).map((request) => (
                            <div key={request.id} className="border-b border-gray-100 pb-4 last:border-0">
                              <div className="font-semibold text-[#202020] text-sm">
                                {request.item?.title}
                              </div>
                              <div className="text-xs text-gray-600">
                                From: {request.requester?.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                {new Date(request.startDate).toLocaleDateString()} -{' '}
                                {new Date(request.endDate).toLocaleDateString()}
                              </div>
                              <div className="mt-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    request.status === 'PENDING'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : request.status === 'ACCEPTED'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {request.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No incoming requests yet</p>
                      )}
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-lg">
                      <h3 className="text-lg font-heading font-semibold text-[#202020] mb-4">
                        Recent Outgoing Requests
                      </h3>
                      {outgoingRequests.slice(0, 3).length > 0 ? (
                        <div className="space-y-4">
                          {outgoingRequests.slice(0, 3).map((request) => (
                            <div key={request.id} className="border-b border-gray-100 pb-4 last:border-0">
                              <div className="font-semibold text-[#202020] text-sm">
                                {request.item?.title}
                              </div>
                              <div className="text-xs text-gray-600">
                                Owner: {request.owner?.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                {new Date(request.startDate).toLocaleDateString()} -{' '}
                                {new Date(request.endDate).toLocaleDateString()}
                              </div>
                              <div className="mt-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    request.status === 'PENDING'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : request.status === 'ACCEPTED'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {request.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No outgoing requests yet</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* My Listings Tab */}
              {activeTab === 'listings' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-heading font-semibold text-[#202020]">
                      My Listings
                    </h2>
                    <Link
                      href="/offer"
                      className="bg-[#F47113] text-white py-2 px-4 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors text-sm"
                    >
                      + Add New Item
                    </Link>
                  </div>

                  {myItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {myItems.map((item) => (
                        <div key={item.id} className="relative">
                          <ItemCard item={item} />
                          <div className="mt-3 flex gap-2">
                            <Link
                              href={`/offer?edit=${item.id}`}
                              className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-heading font-semibold hover:bg-gray-50 transition-colors text-center text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-heading font-semibold hover:bg-red-600 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                      <div className="text-5xl mb-4">📦</div>
                      <h3 className="text-lg font-heading font-semibold text-[#202020] mb-2">
                        No Listings Yet
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">Start sharing your items with the campus community!</p>
                      <Link
                        href="/offer"
                        className="bg-[#F47113] text-white py-2 px-6 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors"
                      >
                        Create Your First Listing
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Incoming Requests Tab */}
              {activeTab === 'incoming' && (
                <div>
                  <h2 className="text-xl font-heading font-semibold text-[#202020] mb-6">
                    Incoming Requests
                  </h2>

                  {incomingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {incomingRequests.map((request) => (
                        <div key={request.id} className="bg-white border border-gray-200 p-6 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-heading font-semibold text-[#202020]">
                                {request.item?.title}
                              </h3>
                              <p className="text-sm text-gray-600">Requester: {request.requester?.name}</p>
                              <p className="text-xs text-gray-500">{request.requester?.hostel}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                request.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : request.status === 'ACCEPTED'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>

                          <div className="mb-4 text-sm">
                            <p className="text-gray-600">
                              <strong>Dates:</strong>{' '}
                              {new Date(request.startDate).toLocaleDateString()} -{' '}
                              {new Date(request.endDate).toLocaleDateString()}
                            </p>
                            {request.message && (
                              <p className="text-gray-600 mt-2">
                                <strong>Message:</strong> {request.message}
                              </p>
                            )}
                          </div>

                          {request.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-heading font-semibold hover:bg-green-600 transition-colors text-sm"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-heading font-semibold hover:bg-red-600 transition-colors text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                      <div className="text-5xl mb-4">📥</div>
                      <h3 className="text-lg font-heading font-semibold text-[#202020] mb-2">
                        No Incoming Requests
                      </h3>
                      <p className="text-sm text-gray-600">You don't have any pending requests yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Outgoing Requests Tab */}
              {activeTab === 'outgoing' && (
                <div>
                  <h2 className="text-xl font-heading font-semibold text-[#202020] mb-6">
                    Outgoing Requests
                  </h2>

                  {outgoingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {outgoingRequests.map((request) => (
                        <div key={request.id} className="bg-white border border-gray-200 p-6 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-heading font-semibold text-[#202020]">
                                {request.item?.title}
                              </h3>
                              <p className="text-sm text-gray-600">Owner: {request.owner?.name}</p>
                              <p className="text-xs text-gray-500">{request.owner?.hostel}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                request.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : request.status === 'ACCEPTED'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>

                          <div className="mb-4 text-sm">
                            <p className="text-gray-600">
                              <strong>Dates:</strong>{' '}
                              {new Date(request.startDate).toLocaleDateString()} -{' '}
                              {new Date(request.endDate).toLocaleDateString()}
                            </p>
                            {request.message && (
                              <p className="text-gray-600 mt-2">
                                <strong>Message:</strong> {request.message}
                              </p>
                            )}
                          </div>

                          {request.status === 'PENDING' && (
                            <button
                              onClick={() => handleCancelRequest(request.id)}
                              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-heading font-semibold hover:bg-red-600 transition-colors text-sm"
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                      <div className="text-5xl mb-4">📤</div>
                      <h3 className="text-lg font-heading font-semibold text-[#202020] mb-2">
                        No Outgoing Requests
                      </h3>
                      <p className="text-sm text-gray-600">You haven't made any requests yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-[#FFF9EF]">
          <div className="text-center">
            <div className="text-4xl animate-spin">⏳</div>
            <p className="mt-4 text-gray-600 font-heading">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
