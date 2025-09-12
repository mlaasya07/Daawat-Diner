import axios from 'axios';
import { FormData, Restaurant } from '../types';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || '708ec078b7ad4a1594fc32a91ee5ae52';
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v2/places';

// Cache for API results
const cache = new Map<string, { data: any[], timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

let currentSearchResults: Restaurant[] = [];
let excludedRestaurantIds: Set<string> = new Set();
let currentFormData: FormData | null = null;

const getCacheKey = (formData: FormData, offset: number = 0): string => {
  return `${formData.city}-${formData.area}-${formData.cuisines.join(',')}-${offset}`;
};

const isValidLocation = (address: string, targetCity: string, targetArea: string): boolean => {
  const addressLower = address.toLowerCase();
  const cityLower = targetCity.toLowerCase();
  const areaLower = targetArea.toLowerCase();
  
  return addressLower.includes(cityLower) || addressLower.includes(areaLower);
};

const formatRating = (rating: number): number => {
  return Math.round(rating * 10) / 10;
};

const getGoogleMapsUrl = (name: string, address: string, lat?: number, lng?: number): string => {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  const query = encodeURIComponent(`${name} ${address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

export const findRestaurants = async (formData: FormData): Promise<Restaurant[]> => {
  currentFormData = formData;
  excludedRestaurantIds.clear(); // Reset excluded IDs for new search
  
  try {
    // Geocode the specific area within the city
    const locationQuery = `${formData.area}, ${formData.city}, India`;
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationQuery)}&apiKey=${GEOAPIFY_API_KEY}&filter=countrycode:in&limit=1`;
    const geocodeResponse = await axios.get(geocodeUrl);
    
    if (!geocodeResponse.data.features || geocodeResponse.data.features.length === 0) {
      throw new Error('Location not found');
    }
    
    const location = geocodeResponse.data.features[0];
    const { lat, lon } = location.properties;
    
    // Search for restaurants using Places API with specific cuisine queries
    const restaurants: Restaurant[] = [];
    const searchRadius = 3000; // 3km radius for more precise area-based results
    
    for (const cuisine of formData.cuisines) {
      const searchQuery = `${cuisine} restaurant`;
      const placesUrl = `${GEOAPIFY_BASE_URL}?categories=catering.restaurant&filter=circle:${lon},${lat},${searchRadius}&bias=proximity:${lon},${lat}&text=${encodeURIComponent(searchQuery)}&apiKey=${GEOAPIFY_API_KEY}&limit=10`;
      
      try {
        const response = await axios.get(placesUrl);
        
        if (response.data.features) {
          const cuisineRestaurants = response.data.features
            .filter((place: any) => {
              const address = place.properties.formatted || place.properties.address_line1 || '';
              return isValidLocation(address, formData.city, formData.area);
            })
            .slice(0, 2) // Get 2 restaurants per cuisine to ensure variety
            .map((place: any) => transformToRestaurant(place, [cuisine], formData));
          
          restaurants.push(...cuisineRestaurants);
        }
      } catch (error) {
        console.error(`Error fetching ${cuisine} restaurants:`, error);
      }
    }
    
    // Remove duplicates and limit to exactly 5 restaurants
    const uniqueRestaurants = restaurants
      .filter((restaurant, index, self) => 
        index === self.findIndex(r => r.name === restaurant.name || 
          (Math.abs(r.coords.lat - restaurant.coords.lat) < 0.001 && 
           Math.abs(r.coords.lng - restaurant.coords.lng) < 0.001))
      )
      .slice(0, 5);
    
    // If we don't have enough restaurants, fill with fallback data
    if (uniqueRestaurants.length < 5) {
      const fallbackRestaurants = getFallbackRestaurants(formData);
      const additionalNeeded = 5 - uniqueRestaurants.length;
      const fallbackFiltered = fallbackRestaurants
        .filter(r => !uniqueRestaurants.some(existing => existing.name === r.name))
        .slice(0, additionalNeeded);
      
      uniqueRestaurants.push(...fallbackFiltered);
    }
    
    currentSearchResults = uniqueRestaurants.slice(0, 5);
    return currentSearchResults;
    
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    // Return fallback demo data
    return getFallbackRestaurants(formData);
  }
};

export const refreshRestaurants = async (): Promise<Restaurant[]> => {
  if (!currentFormData) {
    return [];
  }
  
  // Get starred restaurants
  const starredRestaurants = currentSearchResults.filter(r => r.isStarred);
  
  // If all 5 are starred, return current results (no refresh possible)
  if (starredRestaurants.length >= 5) {
    return currentSearchResults;
  }
  
  try {
    // Add current non-starred restaurant IDs to excluded list
    currentSearchResults.forEach(r => {
      if (!r.isStarred) {
        excludedRestaurantIds.add(r.id);
      }
    });
    
    // Fetch new restaurants
    const locationQuery = `${currentFormData.area}, ${currentFormData.city}, India`;
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationQuery)}&apiKey=${GEOAPIFY_API_KEY}&filter=countrycode:in&limit=1`;
    const geocodeResponse = await axios.get(geocodeUrl);
    
    if (!geocodeResponse.data.features || geocodeResponse.data.features.length === 0) {
      throw new Error('Location not found');
    }
    
    const locationData = geocodeResponse.data.features[0];
    const { lat, lon } = locationData.properties;
    
    const newRestaurants: Restaurant[] = [];
    const neededCount = 5 - starredRestaurants.length;
    const searchRadius = 3000;
    
    // Search for new restaurants for each cuisine with higher limit
    for (const cuisine of currentFormData.cuisines) {
      if (newRestaurants.length >= neededCount) break;
      
      const searchQuery = `${cuisine} restaurant`;
      const placesUrl = `${GEOAPIFY_BASE_URL}?categories=catering.restaurant&filter=circle:${lon},${lat},${searchRadius}&bias=proximity:${lon},${lat}&text=${encodeURIComponent(searchQuery)}&apiKey=${GEOAPIFY_API_KEY}&limit=20`;
      
      try {
        const response = await axios.get(placesUrl);
        
        if (response.data.features) {
          const cuisineRestaurants = response.data.features
            .filter((place: any) => {
              const restaurantId = place.properties.place_id || `${place.properties.name}-${place.properties.lat}-${place.properties.lon}`;
              const address = place.properties.formatted || place.properties.address_line1 || '';
              return isValidLocation(address, currentFormData.city, currentFormData.area) && 
                     !excludedRestaurantIds.has(restaurantId);
            })
            .slice(0, Math.ceil(neededCount / currentFormData.cuisines.length))
            .map((place: any) => transformToRestaurant(place, [cuisine], currentFormData));
          
          newRestaurants.push(...cuisineRestaurants);
        }
      } catch (error) {
        console.error(`Error fetching new ${cuisine} restaurants:`, error);
      }
    }
    
    // Remove duplicates from new restaurants
    const uniqueNewRestaurants = newRestaurants
      .filter((restaurant, index, self) => 
        index === self.findIndex(r => r.name === restaurant.name)
      )
      .slice(0, neededCount);
    
    // Combine starred restaurants with new ones
    const refreshedResults = [
      ...starredRestaurants,
      ...uniqueNewRestaurants
    ];
    
    // If we don't have enough new restaurants, fill with fallback
    if (refreshedResults.length < 5) {
      const fallbackRestaurants = getFallbackRestaurants(currentFormData);
      const additionalNeeded = 5 - refreshedResults.length;
      const fallbackFiltered = fallbackRestaurants
        .filter(r => !refreshedResults.some(existing => existing.name === r.name))
        .slice(0, additionalNeeded);
      
      refreshedResults.push(...fallbackFiltered);
    }
    
    currentSearchResults = refreshedResults.slice(0, 5);
    return currentSearchResults;
    
  } catch (error) {
    console.error('Error refreshing restaurants:', error);
    return currentSearchResults; // Return current results on error
  }
};

export const toggleStarRestaurant = (restaurantId: string): Restaurant[] => {
  currentSearchResults = currentSearchResults.map(restaurant => 
    restaurant.id === restaurantId 
      ? { ...restaurant, isStarred: !restaurant.isStarred }
      : restaurant
  );
  return currentSearchResults;
};

export const getStarredCount = (): number => {
  return currentSearchResults.filter(r => r.isStarred).length;
};

const transformToRestaurant = (place: any, cuisines: string[], formData: FormData): Restaurant => {
  const props = place.properties;
  const restaurantId = props.place_id || `${props.name}-${props.lat}-${props.lon}`;
  
  // Generate price level based on area and restaurant type
  let priceLevel = Math.ceil(Math.random() * 3);
  const name = props.name || 'Restaurant';
  
  // Adjust price level based on restaurant name/type
  if (name.toLowerCase().includes('palace') || name.toLowerCase().includes('royal')) {
    priceLevel = 3;
  } else if (name.toLowerCase().includes('dhaba') || name.toLowerCase().includes('corner')) {
    priceLevel = 1;
  }
  
  // Format rating to one decimal place
  const rating = props.rating ? formatRating(props.rating) : formatRating(3.8 + Math.random() * 1.2);
  
  return {
    id: restaurantId,
    name: name,
    address: props.formatted || props.address_line1 || `${formData.area}, ${formData.city}`,
    distance: Math.round((props.distance || 1000) / 1000 * 10) / 10, // Convert to km
    rating: rating,
    priceLevel: priceLevel,
    cuisine: cuisines, // Use the specific cuisine passed in
    phone: props.contact?.phone,
    website: props.contact?.website,
    coords: { lat: props.lat, lng: props.lon },
    mapUrl: getGoogleMapsUrl(name, props.formatted || props.address_line1 || `${formData.area}, ${formData.city}`, props.lat, props.lon),
    isStarred: false
  };
};

const getFallbackRestaurants = (formData: FormData): Restaurant[] => {
  // Create fallback restaurants that match the selected cuisines and location
  const fallbackData = [
    { name: 'Spice Garden', cuisineType: 'Indian' },
    { name: 'Royal Kitchen', cuisineType: 'Indian' },
    { name: 'Dragon Palace', cuisineType: 'Chinese' },
    { name: 'Pasta Corner', cuisineType: 'Italian' },
    { name: 'South Delights', cuisineType: 'South Indian' },
    { name: 'Punjabi Dhaba', cuisineType: 'Punjabi' },
    { name: 'Bengal Flavors', cuisineType: 'Bengali' },
    { name: 'Thai Garden', cuisineType: 'Thai' },
    { name: 'Rajasthani Palace', cuisineType: 'Rajasthani' },
    { name: 'Gujarat Thali', cuisineType: 'Gujarati' }
  ];
  
  const matchingRestaurants = fallbackData
    .filter(restaurant => 
      formData.cuisines.some(cuisine => 
        restaurant.cuisineType.toLowerCase().includes(cuisine.toLowerCase()) ||
        cuisine.toLowerCase().includes(restaurant.cuisineType.toLowerCase())
      )
    )
    .slice(0, 5);
  
  // If no matches, use first 5
  const restaurantsToUse = matchingRestaurants.length > 0 ? matchingRestaurants : fallbackData.slice(0, 5);
  
  const demoRestaurants = restaurantsToUse.map((restaurant, index) => ({
    id: `demo-${index + 1}`,
    name: `${restaurant.name} - ${formData.area}`,
    address: `${formData.area}, ${formData.city}`,
    distance: 0.8 + (index * 0.3),
    rating: formatRating(4.0 + (Math.random() * 1.0)),
    priceLevel: Math.ceil(Math.random() * 3),
    cuisine: [restaurant.cuisineType],
    coords: { lat: 0, lng: 0 },
    mapUrl: getGoogleMapsUrl(`${restaurant.name} - ${formData.area}`, `${formData.area}, ${formData.city}`),
    isStarred: false
  }));
  
  currentSearchResults = demoRestaurants;
  return demoRestaurants;
};