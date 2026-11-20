'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function OfferItemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    transactionType: searchParams.get('type') || 'BORROW',
    condition: '',
    price: '',
    deposit: '',
    location: '',
    availableFrom: '',
    availableUntil: '',
    imageUrls: [''],
  });
  const [imageErrors, setImageErrors] = useState<string[]>(['']);

  const transactionTypes = [
    { value: 'BORROW', label: 'Lend (Borrow)' },
    { value: 'RENT', label: 'Rent' },
    { value: 'SELL', label: 'Sell' },
    { value: 'EXCHANGE', label: 'Exchange' },
  ];

  const conditions = [
    'Like New',
    'Good',
    'Fair',
    'Used',
    'Needs Repair',
  ];

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData({ ...formData, imageUrls: newImageUrls });

    // Validate URL
    const newImageErrors = [...imageErrors];
    if (value.trim() && !isValidImageUrl(value)) {
      newImageErrors[index] = 'Please enter a valid direct image URL (e.g., .jpg, .png, .gif)';
    } else {
      newImageErrors[index] = '';
    }
    setImageErrors(newImageErrors);
  };

  const isValidImageUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is allowed
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      // Check for direct image extensions
      const hasImageExtension =
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.gif') ||
        pathname.endsWith('.webp') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.bmp');
      // Allow Unsplash (configured domain)
      const isUnsplash = urlObj.hostname === 'images.unsplash.com';
      return hasImageExtension || isUnsplash;
    } catch {
      return false;
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ''] });
    setImageErrors([...imageErrors, '']);
  };

  const removeImageField = (index: number) => {
    const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    const newImageErrors = imageErrors.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: newImageUrls });
    setImageErrors(newImageErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Validate all image URLs
      const nonEmptyUrls = formData.imageUrls.filter((url) => url.trim() !== '');
      const invalidUrls = nonEmptyUrls.filter((url) => !isValidImageUrl(url));

      if (invalidUrls.length > 0) {
        throw new Error('Please fix invalid image URLs before submitting');
      }

      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        deposit: formData.deposit ? parseFloat(formData.deposit) : null,
        imageUrls: nonEmptyUrls.length > 0 ? nonEmptyUrls : undefined,
      };

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create item');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard?tab=listings');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-[#FFF9EF] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold text-[#202020] mb-8">
            Offer an Item
          </h1>

          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            {success ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-heading font-bold text-[#202020] mb-2">
                  Item Listed Successfully!
                </h2>
                <p className="text-gray-600">Redirecting to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-heading font-bold text-[#F47113]">
                    Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                      placeholder="e.g., Scientific Calculator"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                      rows={4}
                      placeholder="Describe your item in detail..."
                      maxLength={5000}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      required
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                    >
                      <option value="">Select condition</option>
                      {conditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-heading font-bold text-[#F47113]">
                    Transaction Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Type *
                    </label>
                    <select
                      required
                      value={formData.transactionType}
                      onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                    >
                      {transactionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (for Rent/Sell)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deposit (for Borrow/Rent)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.deposit}
                        onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                  <h3 className="text-xl font-heading font-bold text-[#F47113]">
                    Availability
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                      placeholder="e.g., Block A, Room 101"
                      maxLength={200}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available From *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.availableFrom}
                        onChange={(e) =>
                          setFormData({ ...formData, availableFrom: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Until *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.availableUntil}
                        onChange={(e) =>
                          setFormData({ ...formData, availableUntil: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="text-xl font-heading font-bold text-[#F47113]">
                    Images (Optional)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter direct image URLs ending in .jpg, .png, .gif, .webp, or .svg
                  </p>

                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            imageErrors[index]
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-[#F3C11B]'
                          }`}
                          placeholder="https://example.com/image.jpg"
                        />
                        {imageErrors[index] && (
                          <p className="mt-1 text-sm text-red-600">{imageErrors[index]}</p>
                        )}
                      </div>
                      {formData.imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  {formData.imageUrls.length < 10 && (
                    <button
                      type="button"
                      onClick={addImageField}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      + Add Another Image
                    </button>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#F47113] text-white py-3 px-4 rounded-lg font-heading font-bold hover:bg-[#086353] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating Listing...' : 'Create Listing'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-heading font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function OfferItemPage() {
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
      <OfferItemContent />
    </Suspense>
  );
}
