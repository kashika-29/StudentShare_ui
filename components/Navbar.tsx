'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold font-heading text-[#F47113]">
              🎓 StudentShare
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books, electronics, furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113] focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/browse"
                  className="text-gray-700 hover:text-[#F47113] transition-colors text-sm font-medium"
                >
                  Browse
                </Link>
                <Link
                  href="/offer"
                  className="text-gray-700 hover:text-[#F47113] transition-colors text-sm font-medium"
                >
                  Sell/Rent
                </Link>

                {/* Icons */}
                <button className="text-gray-700 hover:text-[#F47113] transition-colors p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
                <button className="text-gray-700 hover:text-[#F47113] transition-colors p-2 relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 bg-[#DC2626] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    2
                  </span>
                </button>

                {/* Sell/Rent Button */}
                <Link
                  href="/offer"
                  className="bg-[#F47113] text-white px-4 py-2 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors text-sm"
                >
                  + Sell/Rent
                </Link>

                {/* User Profile */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:text-[#F47113] transition-colors">
                    <div className="w-8 h-8 bg-[#F3C11B] rounded-full flex items-center justify-center text-[#F47113] font-bold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors">
                      Profile
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-[#F47113] transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#F47113] text-white px-4 py-2 rounded-lg font-heading font-semibold hover:bg-[#086353] transition-colors text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47113]"
              />
            </form>

            {user ? (
              <>
                <Link href="/browse" className="block py-2 text-gray-700 hover:text-[#F47113]">
                  Browse Items
                </Link>
                <Link href="/offer" className="block py-2 text-gray-700 hover:text-[#F47113]">
                  Sell/Rent Item
                </Link>
                <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-[#F47113]">
                  Dashboard
                </Link>
                <Link href="/profile" className="block py-2 text-gray-700 hover:text-[#F47113]">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-gray-700 hover:text-[#F47113] w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-gray-700 hover:text-[#F47113]">
                  Login
                </Link>
                <Link href="/register" className="block py-2 text-gray-700 hover:text-[#F47113]">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
