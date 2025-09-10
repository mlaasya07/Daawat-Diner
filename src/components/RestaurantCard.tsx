import React, { useState } from 'react';
import { Star, Phone, Globe, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { Restaurant, FormData, MenuItem } from '../types';

interface Props {
  restaurant: Restaurant;
  formData: FormData;
  onToggleStar: (restaurantId: string) => void;
}

export default function RestaurantCard({ restaurant, formData, onToggleStar }: Props) {
  const [expanded, setExpanded] = useState(false);
  
  // Filter menu items based on preferences
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      // Diet filter
      if (formData.diet === 'Veg' && !item.isVeg) return false;
      if (formData.diet === 'Non-Veg' && item.isVeg) return false;
      
      // Age filter for alcoholic drinks
      if (item.isAlcoholic && formData.ages.some(age => age < 18)) return false;
      
      // Budget filter
      if (formData.budget && item.price > formData.budget) return false;
      
      return true;
    });
  };

  const filteredMenu = filterMenuItems(restaurant.menu);
  const menuByCategory = filteredMenu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const calculateEstimatedCost = () => {
    if (filteredMenu.length === 0) return 0;
    
    // Simple estimation: average of starter + main + drink per person
    const starters = menuByCategory['Starter'] || [];
    const mains = menuByCategory['Main Course'] || [];
    const drinks = menuByCategory['Drinks'] || [];
    
    const avgStarter = starters.length > 0 ? starters.reduce((sum, item) => sum + item.price, 0) / starters.length : 0;
    const avgMain = mains.length > 0 ? mains.reduce((sum, item) => sum + item.price, 0) / mains.length : 0;
    const avgDrink = drinks.length > 0 ? drinks.reduce((sum, item) => sum + item.price, 0) / drinks.length : 0;
    
    return Math.round((avgStarter + avgMain + avgDrink) * formData.numPeople);
  };

  const estimatedCost = calculateEstimatedCost();
  const priceSymbols = '₹'.repeat(restaurant.priceLevel);

  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getDrinkIcon = (item: MenuItem) => {
    if (item.isAlcoholic) return '🍺';
    if (item.ageSuitability === 'Kid') return '🧃';
    return '🥤';
  };

  const getVegIcon = (isVeg: boolean) => {
    return isVeg ? '🟢' : '🔴';
  };

  return (
    <div className="bg-[#231F20] border-2 border-[#157A6E] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* Restaurant Header */}
      <div className="p-6 border-b border-[#157A6E]">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-[#F3DFA2] mb-2">{restaurant.name}</h3>
            <p className="text-[#157A6E] mb-2">{restaurant.address}</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-[#F3DFA2]">{restaurant.rating}</span>
              </div>
              <span className="text-[#157A6E]">{restaurant.distance}km away</span>
              <span className="text-[#157A6E]">{priceSymbols}</span>
              <span className="text-[#157A6E]">{restaurant.cuisine.join(', ')}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
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
            
            {estimatedCost > 0 && (
              <div className="bg-[#157A6E] text-[#F3DFA2] px-4 py-2 rounded-lg text-center">
                <div className="text-sm">Estimated Total</div>
                <div className="text-lg font-bold">₹{estimatedCost}</div>
              </div>
            )}
            
            <div className="flex space-x-2">
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
                href={getGoogleMapsUrl()}
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
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full bg-[#157A6E] hover:bg-[#1A6B60] text-[#F3DFA2] py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>{expanded ? 'Hide Menu' : 'View Menu'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Menu */}
      {expanded && (
        <div className="p-6">
          {filteredMenu.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#157A6E] text-lg">
                No menu items match your preferences at this restaurant.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(menuByCategory).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-xl font-bold text-[#F3DFA2] mb-3 border-b border-[#157A6E] pb-2">
                    {category} ({items.length} items)
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#2A2627] border border-[#157A6E] rounded-lg p-4 hover:border-[#BB4430] transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-[#F3DFA2] flex items-center space-x-2">
                            <span>{getVegIcon(item.isVeg)}</span>
                            {item.category === 'Drinks' && (
                              <span>{getDrinkIcon(item)}</span>
                            )}
                            <span>{item.name}</span>
                          </h5>
                          <span className="font-bold text-[#BB4430]">₹{item.price}</span>
                        </div>
                        {item.description && (
                          <p className="text-[#157A6E] text-sm mb-2">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#157A6E]">
                            {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                          </span>
                          {item.category === 'Drinks' && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              item.ageSuitability === 'Adult' 
                                ? 'bg-red-900 text-red-200' 
                                : item.ageSuitability === 'Kid'
                                ? 'bg-green-900 text-green-200'
                                : 'bg-blue-900 text-blue-200'
                            }`}>
                              {item.ageSuitability === 'Adult' ? '18+' : 
                               item.ageSuitability === 'Kid' ? 'Kid-Friendly' : 'All Ages'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}