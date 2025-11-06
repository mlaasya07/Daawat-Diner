import React from 'react';
import { Star, Phone, Globe, Navigation } from 'lucide-react';
import { Restaurant, FormData } from '../types';

interface Props {
  restaurant: Restaurant;
  formData: FormData;
  onToggleStar: (restaurantId: string) => void;
}

export default function RestaurantCard({ restaurant, formData, onToggleStar }: Props) {
  const priceSymbols = '₹'.repeat(restaurant.priceLevel);

  return (
    <div className="bg-[#231F20] border-2 border-[#157A6E] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* Restaurant Header */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F3DFA2] mb-2 break-words no-select">{restaurant.name}</h3>
            <p className="text-[#157A6E] mb-2 text-sm sm:text-base break-words no-select">{restaurant.address}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm no-select">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-[#F3DFA2]">{restaurant.rating}</span>
              </div>
              <span className="text-[#157A6E]">{restaurant.distance}km away</span>
              <span className="text-[#157A6E]">{priceSymbols}</span>
              <span className="text-[#157A6E] hidden sm:inline">{restaurant.cuisine.join(', ')}</span>
              <span className="text-[#157A6E] sm:hidden">{restaurant.cuisine[0]}</span>
            </div>
          </div>
          
          <div className="flex flex-row lg:flex-col gap-2 lg:space-y-2 lg:space-x-0 space-x-2 lg:flex-shrink-0">
            <button
              onClick={() => onToggleStar(restaurant.id)}
              className={`p-2 rounded-lg transition-colors ${
                restaurant.isStarred
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-[#2A2627] border border-[#157A6E] hover:border-yellow-500 text-[#157A6E] hover:text-yellow-500'
              }`}
              title={restaurant.isStarred ? 'Remove from starred' : 'Star this restaurant'}
            >
              <Star className={`w-4 h-4 ${restaurant.isStarred ? 'fill-current' : ''}`} />
            </button>
            
            <div className="flex gap-2">
              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="bg-[#BB4430] hover:bg-[#A03A28] text-[#F3DFA2] p-2 rounded-lg transition-colors"
                  title="Call Restaurant"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              {restaurant.website && (
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#BB4430] hover:bg-[#A03A28] text-[#F3DFA2] p-2 rounded-lg transition-colors"
                  title="Visit Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              <a
                href={restaurant.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#BB4430] hover:bg-[#A03A28] text-[#F3DFA2] p-2 rounded-lg transition-colors"
                title="Get Directions"
              >
                <Navigation className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}