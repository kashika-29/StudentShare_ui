'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { getCategoryDefaultImage } from '@/lib/categoryImages';

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestForm, setRequestForm] = useState({
    startDate: '',
    endDate: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items/${params.id}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Item not found');
        }
        throw new Error(data.error || 'Failed to fetch item');
      }

      if (!data.item) {
        throw new Error('Item not found');
      }

      setItem(data.item);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/borrow-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: params.id,
          startDate: requestForm.startDate,
          endDate: requestForm.endDate,
          message: requestForm.message,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setRequestSuccess(true);
      setRequestForm({ startDate: '', endDate: '', message: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fallbackImage = item ? getCategoryDefaultImage(item.category.name) : '';
  const imageUrl = item?.images?.[0]?.imageUrl || '';

  const getTransactionBadge = () => {
    const badges = {
      BORROW: { text: 'Borrow', color: 'bg-blue-500' },
      RENT: { text: 'Rent', color: 'bg-green-500' },
      SELL: { text: 'Sell', color: 'bg-purple-500' },
      EXCHANGE: { text: 'Exchange', color: 'bg-orange-500' },
    };
    const badge = badges[item?.transactionType as keyof typeof badges] || badges.BORROW;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getPriceDisplay = () => {
    if (item?.transactionType === 'SELL' && item.price) {
      return `$${item.price}`;
    }
    if (item?.transactionType === 'RENT' && item.price) {
      return `$${item.price}/day`;
    }
    if (item?.deposit) {
      return `Deposit: $${item.deposit}`;
    }
    return 'Free';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-[#FFF9EF]">
          <div className="text-center">
            <div className="text-4xl animate-spin">⏳</div>
            <p className="mt-4 text-gray-600 font-heading">Loading item details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-[#FFF9EF]">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-heading font-bold text-[#202020] mb-2">
              Error Loading Item
            </h2>
            <p className="text-gray-600 mb-4">{error || 'Item not found'}</p>
            <button
              onClick={() => router.push('/browse')}
              className="bg-[#F47113] text-white py-2 px-6 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors"
            >
              Back to Browse
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isBorrowable = item.transactionType === 'BORROW' || item.transactionType === 'RENT';
  const isAvailable = item.status === 'AVAILABLE';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-[#FFF9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <button
              onClick={() => router.push('/browse')}
              className="text-[#F47113] hover:text-[#086353] transition-colors"
            >
              ← Back to Browse
            </button>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <SafeImage
                  src={imageUrl}
                  alt={item.title}
                  fallback={fallbackImage}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4">
                  {getTransactionBadge()}
                </div>
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg px-4 py-2 bg-black bg-opacity-70 rounded">
                      Unavailable
                    </span>
                  </div>
                )}
              </div>

              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.slice(1).map((image: any, index: number) => (
                    <div key={index} className="relative h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <SafeImage
                        src={image.imageUrl}
                        alt={`${item.title} ${index + 2}`}
                        fallback={fallbackImage}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-[#202020] mb-2">
                  {item.title}
                </h1>
                <p className="text-gray-600">{item.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-[#F47113]">{getPriceDisplay()}</span>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{item.condition}</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-heading font-semibold text-[#202020] mb-4">Item Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium text-[#202020]">{item.category.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-[#202020]">{item.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available From</p>
                    <p className="font-medium text-[#202020]">
                      {new Date(item.availableFrom).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available Until</p>
                    <p className="font-medium text-[#202020]">
                      {new Date(item.availableUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-heading font-semibold text-[#202020] mb-4">Seller Information</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#F3C11B] rounded-full flex items-center justify-center text-[#F47113] font-bold text-xl">
                    {item.owner.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#202020]">{item.owner.name}</p>
                    <p className="text-sm text-gray-600">{item.owner.hostel}</p>
                  </div>
                </div>
              </div>

              {/* Borrow Request Form */}
              {isBorrowable && isAvailable && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-heading font-semibold text-[#202020] mb-4">
                    Request to {item.transactionType === 'BORROW' ? 'Borrow' : 'Rent'}
                  </h3>

                  {requestSuccess ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                      <p className="font-semibold">Request submitted successfully!</p>
                      <p className="text-sm">The owner will review your request.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                          {error}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            required
                            value={requestForm.startDate}
                            onChange={(e) =>
                              setRequestForm({ ...requestForm, startDate: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113] text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            required
                            value={requestForm.endDate}
                            onChange={(e) =>
                              setRequestForm({ ...requestForm, endDate: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113] text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          value={requestForm.message}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, message: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113] text-sm"
                          rows={3}
                          placeholder="Add a message to the owner..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#F47113] text-white py-3 px-4 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Contact for Sale/Exchange */}
              {!isBorrowable && isAvailable && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-heading font-semibold text-[#202020] mb-4">
                    Contact Owner
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    To {item.transactionType === 'SELL' ? 'purchase' : 'exchange'} this item, please
                    contact the owner directly.
                  </p>
                  <button
                    className="w-full bg-[#F47113] text-white py-3 px-4 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors"
                  >
                    Contact Owner
                  </button>
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
