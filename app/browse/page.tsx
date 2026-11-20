'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ItemCard from '@/components/ItemCard';

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    transactionType: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
  });

  const categories = [
    'Electronics',
    'Books',
    'Clothing',
    'Hostel Essentials',
    'Sports',
    'Academic',
    'Project Materials',
    'Other',
  ];

  const transactionTypes = ['BORROW', 'RENT', 'SELL', 'EXCHANGE'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/items', {
        credentials: 'include',
      });
      const data = await response.json();
      let filteredItems = data.items || [];

      // Client-side filtering
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredItems = filteredItems.filter(
          (item: any) =>
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower)
        );
      }

      if (filters.category) {
        filteredItems = filteredItems.filter(
          (item: any) => item.category.name === filters.category
        );
      }

      if (filters.transactionType) {
        filteredItems = filteredItems.filter(
          (item: any) => item.transactionType === filters.transactionType
        );
      }

      if (filters.status) {
        filteredItems = filteredItems.filter(
          (item: any) => item.status === filters.status
        );
      }

      setItems(filteredItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    fetchItems();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      transactionType: '',
      status: '',
    });
    router.push('/browse');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-[#FFF9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-heading font-bold text-[#202020] mb-6">
            Browse Items
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-heading font-semibold text-[#202020]">
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#F47113] hover:text-[#086353]"
                  >
                    Clear all
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113] text-sm"
                      placeholder="Search items..."
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113] text-sm"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Transaction Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Type
                    </label>
                    <select
                      value={filters.transactionType}
                      onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113] text-sm"
                    >
                      <option value="">All Types</option>
                      {transactionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113] text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="AVAILABLE">Available</option>
                      <option value="UNAVAILABLE">Unavailable</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={applyFilters}
                    className="w-full bg-[#F47113] text-white py-2 px-4 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors text-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-4xl animate-spin">⏳</div>
                  <p className="mt-4 text-gray-600 font-heading">Loading items...</p>
                </div>
              ) : items.length > 0 ? (
                <>
                  <p className="text-sm text-gray-600 mb-6">
                    Showing {items.length} item{items.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="text-lg font-heading font-semibold text-[#202020] mb-2">
                    No items found
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Try adjusting your filters or check back later
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-[#F47113] text-white py-2 px-6 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors text-sm"
                  >
                    Clear Filters
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

export default function BrowsePage() {
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
      <BrowseContent />
    </Suspense>
  );
}
