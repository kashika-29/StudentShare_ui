import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold font-heading text-[#F47113] mb-4">
              🎓 StudentShare
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Find it. Rent it. Share it. The campus marketplace for students.
            </p>
            <p className="text-xs text-gray-500">
              Building a sustainable campus community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-[#202020] mb-4 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/offer" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Sell/Rent Item
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-[#202020] mb-4 uppercase tracking-wide">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse?category=Electronics" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Books" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Clothing" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Sports" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-[#202020] mb-4 uppercase tracking-wide">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-[#F47113] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; 2024 StudentShare. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-2 md:mt-0">
              Made with ❤️ for students, by students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
