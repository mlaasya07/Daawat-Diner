import React, { useState } from 'react';
import { ArrowLeft, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { Restaurant, FormData } from '../types';
import RestaurantCard from './RestaurantCard';
import { refreshRestaurants, getStarredCount } from '../services/restaurantService';

interface Props {
  restaurants: Restaurant[];
  formData: FormData;
  onNewSearch: () => void;
  onRefreshResults: (restaurants: Restaurant[]) => void;
  onToggleStar: (restaurantId: string) => void;
}

export default function RestaurantResults({ restaurants, formData, onNewSearch, onRefreshResults, onToggleStar }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const totalBudget = formData.budget ? formData.budget * formData.numPeople : undefined;
  const hasMinors = formData.ages.some(age => age < 18);
  const starredCount = getStarredCount();
  const allStarred = starredCount >= 5;

  const handleRefresh = async () => {
    if (allStarred) return;
    
    setRefreshing(true);
    try {
      const refreshedRestaurants = await refreshRestaurants();
      onRefreshResults(refreshedRestaurants);
    } catch (error) {
      console.error('Error refreshing restaurants:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-[#231F20] border-2 border-[#157A6E] rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#F3DFA2] mb-2">
              Top 5 restaurants in {formData.location}
            </h2>
            <div className="flex items-center space-x-6 text-[#157A6E] text-sm">
              <span>👥 {formData.numPeople} people</span>
              <span>🍽️ {formData.cuisines.join(', ')}</span>
              <span>🥗 {formData.diet}</span>
              {formData.budget && (
                <span>💰 ₹{formData.budget}/person (₹{totalBudget} total)</span>
              )}
              {starredCount > 0 && (
                <span>⭐ {starredCount} starred</span>
              )}
            </div>
            {hasMinors && (
              <div className="mt-2 text-yellow-400 text-sm">
                ⚠️ Group includes minors - alcoholic beverages will be filtered out
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={allStarred || refreshing}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                allStarred
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : refreshing
                  ? 'bg-[#BB4430] text-[#F3DFA2] cursor-wait'
                  : 'bg-[#BB4430] hover:bg-[#A03A28] text-[#F3DFA2]'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            
            <button
              onClick={onNewSearch}
              className="bg-[#157A6E] hover:bg-[#1A6B60] text-[#F3DFA2] px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>New Search</span>
            </button>
          </div>
        </div>
        
        {allStarred && (
          <div className="mt-4 p-3 bg-yellow-900 border border-yellow-600 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-200 text-sm">
              All searches are starred. Try removing one or more to refresh.
            </span>
          </div>
        )}
      </div>

      {/* Results */}
      {restaurants.length === 0 ? (
        <div className="bg-[#231F20] border-2 border-[#157A6E] rounded-lg p-12 text-center">
          <MapPin className="w-16 h-16 text-[#157A6E] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F3DFA2] mb-2">
            No restaurants found
          </h3>
          <p className="text-[#157A6E] mb-6">
            No nearby restaurants match your criteria. Try adjusting your preferences or location.
          </p>
          <button
            onClick={onNewSearch}
            className="bg-[#BB4430] hover:bg-[#A03A28] text-[#F3DFA2] px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              formData={formData}
              onToggleStar={onToggleStar}
            />
          ))}
        </div>
      )}
    </div>
  );
}