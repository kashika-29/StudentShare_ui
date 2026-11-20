import Link from 'next/link';
import SafeImage from './SafeImage';
import { getCategoryDefaultImage } from '@/lib/categoryImages';

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    transactionType: string;
    condition: string;
    price: number | null;
    deposit: number | null;
    location: string;
    availableFrom: string;
    availableUntil: string;
    status: string;
    category: {
      name: string;
    };
    owner: {
      id: string;
      name: string;
      hostel: string;
    };
    images: {
      imageUrl: string;
    }[];
  };
}

export default function ItemCard({ item }: ItemCardProps) {
  const imageUrl = item.images[0]?.imageUrl || '';
  const fallbackImage = getCategoryDefaultImage(item.category.name);

  const getTransactionBadge = () => {
    const badges = {
      BORROW: { text: 'Borrow', color: 'bg-blue-500' },
      RENT: { text: 'Rent', color: 'bg-green-500' },
      SELL: { text: 'Sell', color: 'bg-purple-500' },
      EXCHANGE: { text: 'Exchange', color: 'bg-orange-500' },
    };
    const badge = badges[item.transactionType as keyof typeof badges] || badges.BORROW;
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getPriceDisplay = () => {
    if (item.transactionType === 'SELL' && item.price) {
      return `$${item.price}`;
    }
    if (item.transactionType === 'RENT' && item.price) {
      return `$${item.price}/day`;
    }
    if (item.deposit) {
      return `Deposit: $${item.deposit}`;
    }
    return 'Free';
  };

  const isAvailable = item.status === 'AVAILABLE';

  return (
    <Link href={`/items/${item.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          <SafeImage
            src={imageUrl}
            alt={item.title}
            fallback={fallbackImage}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2">
            {getTransactionBadge()}
          </div>
          {!isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold text-sm px-3 py-1 bg-black bg-opacity-70 rounded">
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-heading font-semibold text-base text-[#202020] mb-1 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2 flex-1">{item.description}</p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-[#F47113]">{getPriceDisplay()}</span>
            <span className="text-xs text-gray-500">{item.condition}</span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="truncate">{item.owner.name}</span>
            <span className="text-[#086353] font-medium">
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
