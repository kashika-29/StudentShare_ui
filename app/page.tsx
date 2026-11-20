'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ItemCard from '@/components/ItemCard';

export default function HomePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const recentItems = items.slice(0, 12);

  const categories = [
    { name: 'Electronics', icon: '�', href: '/browse?category=Electronics', color: 'bg-blue-50 border-blue-200' },
    { name: 'Books', icon: '�', href: '/browse?category=Books', color: 'bg-green-50 border-green-200' },
    { name: 'Clothing', icon: '👕', href: '/browse?category=Clothing', color: 'bg-pink-50 border-pink-200' },
    { name: 'Hostel Essentials', icon: '�', href: '/browse?category=Hostel Essentials', color: 'bg-yellow-50 border-yellow-200' },
    { name: 'Sports', icon: '⚽', href: '/browse?category=Sports', color: 'bg-orange-50 border-orange-200' },
    { name: 'Academic', icon: '🎓', href: '/browse?category=Academic', color: 'bg-purple-50 border-purple-200' },
    { name: 'Project Materials', icon: '�', href: '/browse?category=Project Materials', color: 'bg-gray-50 border-gray-200' },
    { name: 'Other', icon: '�', href: '/browse?category=Other', color: 'bg-indigo-50 border-indigo-200' },
  ];

  const browseByPurpose = [
    {
      name: 'Rent Something',
      description: 'Find affordable products for temporary use',
      icon: '🔄',
      href: '/browse?type=RENT',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      name: 'Buy Something',
      description: 'Discover pre-loved products at student-friendly prices',
      icon: '🛒',
      href: '/browse?type=SELL',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
    },
    {
      name: 'Lend Your Items',
      description: 'Let students earn by lending unused belongings',
      icon: '🤝',
      href: '/offer?type=BORROW',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
    },
    {
      name: 'Give Away',
      description: 'Pass useful things to another student',
      icon: '🎁',
      href: '/browse?type=EXCHANGE',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Compact Hero Section */}
      <section className="bg-gradient-to-r from-[#086353] to-[#065042] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
              Find it. Rent it. Share it.
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Everything students need, available around campus.
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-heading font-semibold text-[#202020] mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`${category.color} border rounded-lg p-4 text-center hover:shadow-md transition-shadow`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs font-medium text-gray-700">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Purpose */}
      <section className="py-10 bg-[#FFF9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-[#202020] mb-6">
            What would you like to do?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {browseByPurpose.map((purpose) => (
              <Link
                key={purpose.name}
                href={purpose.href}
                className={`${purpose.bgColor} ${purpose.borderColor} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="text-4xl mb-3">{purpose.icon}</div>
                <h3 className="font-heading font-semibold text-lg text-[#202020] mb-2">
                  {purpose.name}
                </h3>
                <p className="text-sm text-gray-600">{purpose.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Listed Items */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-[#202020]">
              Recently Listed
            </h2>
            <Link
              href="/browse"
              className="text-[#F47113] font-heading font-semibold hover:text-[#086353] transition-colors text-sm"
            >
              View all listings →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl animate-spin">⏳</div>
              <p className="mt-4 text-gray-600 font-heading">Loading items...</p>
            </div>
          ) : recentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 font-heading">No items available yet. Be the first to list something!</p>
            </div>
          )}
        </div>
      </section>

      {/* Why StudentShare */}
      <section className="py-10 bg-[#FFF9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-center text-[#202020] mb-8">
            Why StudentShare?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-heading font-semibold text-lg text-[#202020] mb-2">Affordable for Students</h3>
              <p className="text-sm text-gray-600">Save money by renting or buying pre-loved items</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-heading font-semibold text-lg text-[#202020] mb-2">Campus-Focused</h3>
              <p className="text-sm text-gray-600">Buy and rent within your campus community</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">♻️</div>
              <h3 className="font-heading font-semibold text-lg text-[#202020] mb-2">Reduce Waste</h3>
              <p className="text-sm text-gray-600">Give unused items a second life</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-heading font-semibold text-lg text-[#202020] mb-2">Support Peers</h3>
              <p className="text-sm text-gray-600">Help fellow students save money and resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#086353] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Have something to share?
          </h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            List your items on StudentShare and help other students while earning money or decluttering your space.
          </p>
          <Link
            href="/offer"
            className="inline-block bg-[#F47113] text-white px-8 py-3 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors"
          >
            Start Listing
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
