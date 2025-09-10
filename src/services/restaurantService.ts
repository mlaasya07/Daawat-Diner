import axios from 'axios';
import { FormData, Restaurant, MenuItem } from '../types';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || '708ec078b7ad4a1594fc32a91ee5ae52';
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v2/places';

// Cache for API results
const cache = new Map<string, { data: any[], timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

let currentSearchResults: Restaurant[] = [];
let excludedRestaurantIds: Set<string> = new Set();
let currentFormData: FormData | null = null;

// Enhanced menu generation based on cuisine and restaurant type
const generateMenu = (cuisine: string[], restaurantName: string, priceLevel: number): MenuItem[] => {
  const menu: MenuItem[] = [];
  const basePrice = priceLevel * 100; // Base price multiplier
  
  // Generate cuisine-specific menu items
  cuisine.forEach(cuisineType => {
    switch (cuisineType.toLowerCase()) {
      case 'indian':
      case 'north indian':
        menu.push(
          { id: `${restaurantName}-s1`, name: 'Paneer Tikka', category: 'Starter', price: basePrice + 200, isVeg: true, ageSuitability: 'All', description: 'Grilled cottage cheese with spices' },
          { id: `${restaurantName}-s2`, name: 'Chicken Tikka', category: 'Starter', price: basePrice + 280, isVeg: false, ageSuitability: 'All', description: 'Marinated grilled chicken' },
          { id: `${restaurantName}-m1`, name: 'Butter Chicken', category: 'Main Course', price: basePrice + 350, isVeg: false, ageSuitability: 'All', description: 'Creamy tomato-based chicken curry' },
          { id: `${restaurantName}-m2`, name: 'Dal Makhani', category: 'Main Course', price: basePrice + 250, isVeg: true, ageSuitability: 'All', description: 'Creamy black lentils' },
          { id: `${restaurantName}-d1`, name: 'Kingfisher Beer', category: 'Drinks', price: 180, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Premium Indian lager' },
          { id: `${restaurantName}-d2`, name: 'Mango Lassi', category: 'Drinks', price: 120, isVeg: true, ageSuitability: 'Kid', description: 'Sweet mango yogurt drink' },
          { id: `${restaurantName}-ds1`, name: 'Gulab Jamun', category: 'Dessert', price: 150, isVeg: true, ageSuitability: 'All', description: 'Sweet milk dumplings' }
        );
        break;
      
      case 'south indian':
        menu.push(
          { id: `${restaurantName}-s1`, name: 'Medu Vada', category: 'Starter', price: basePrice + 80, isVeg: true, ageSuitability: 'All', description: 'Crispy lentil donuts' },
          { id: `${restaurantName}-s2`, name: 'Fish Fry', category: 'Starter', price: basePrice + 300, isVeg: false, ageSuitability: 'All', description: 'Spiced fried fish' },
          { id: `${restaurantName}-m1`, name: 'Masala Dosa', category: 'Main Course', price: basePrice + 180, isVeg: true, ageSuitability: 'All', description: 'Crispy crepe with potato filling' },
          { id: `${restaurantName}-m2`, name: 'Fish Curry Rice', category: 'Main Course', price: basePrice + 320, isVeg: false, ageSuitability: 'All', description: 'Traditional fish curry with rice' },
          { id: `${restaurantName}-d1`, name: 'Filter Coffee', category: 'Drinks', price: 60, isVeg: true, ageSuitability: 'All', description: 'Traditional South Indian coffee' },
          { id: `${restaurantName}-d2`, name: 'Tender Coconut', category: 'Drinks', price: 50, isVeg: true, ageSuitability: 'Kid', description: 'Fresh coconut water' },
          { id: `${restaurantName}-ds1`, name: 'Payasam', category: 'Dessert', price: 120, isVeg: true, ageSuitability: 'All', description: 'Sweet rice pudding' }
        );
        break;
      
      case 'chinese':
        menu.push(
          { id: `${restaurantName}-s1`, name: 'Spring Rolls', category: 'Starter', price: basePrice + 200, isVeg: true, ageSuitability: 'All', description: 'Crispy vegetable rolls' },
          { id: `${restaurantName}-s2`, name: 'Chicken Manchurian', category: 'Starter', price: basePrice + 280, isVeg: false, ageSuitability: 'All', description: 'Indo-Chinese chicken balls' },
          { id: `${restaurantName}-m1`, name: 'Hakka Noodles', category: 'Main Course', price: basePrice + 250, isVeg: true, ageSuitability: 'All', description: 'Stir-fried noodles' },
          { id: `${restaurantName}-m2`, name: 'Chicken Fried Rice', category: 'Main Course', price: basePrice + 300, isVeg: false, ageSuitability: 'All', description: 'Wok-tossed rice with chicken' },
          { id: `${restaurantName}-d1`, name: 'Green Tea', category: 'Drinks', price: 80, isVeg: true, ageSuitability: 'All', description: 'Traditional Chinese tea' },
          { id: `${restaurantName}-d2`, name: 'Virgin Mojito', category: 'Drinks', price: 150, isVeg: true, ageSuitability: 'Kid', description: 'Refreshing mint drink' },
          { id: `${restaurantName}-ds1`, name: 'Date Pancake', category: 'Dessert', price: 180, isVeg: true, ageSuitability: 'All', description: 'Sweet Chinese pancake' }
        );
        break;
      
      case 'italian':
        menu.push(
          { id: `${restaurantName}-s1`, name: 'Bruschetta', category: 'Starter', price: basePrice + 280, isVeg: true, ageSuitability: 'All', description: 'Toasted bread with tomato' },
          { id: `${restaurantName}-s2`, name: 'Caesar Salad', category: 'Starter', price: basePrice + 320, isVeg: false, ageSuitability: 'All', description: 'Classic Caesar with chicken' },
          { id: `${restaurantName}-m1`, name: 'Margherita Pizza', category: 'Main Course', price: basePrice + 420, isVeg: true, ageSuitability: 'All', description: 'Classic tomato and mozzarella' },
          { id: `${restaurantName}-m2`, name: 'Chicken Alfredo', category: 'Main Course', price: basePrice + 480, isVeg: false, ageSuitability: 'All', description: 'Creamy pasta with chicken' },
          { id: `${restaurantName}-d1`, name: 'Italian Wine', category: 'Drinks', price: 400, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'House red wine' },
          { id: `${restaurantName}-d2`, name: 'Italian Soda', category: 'Drinks', price: 120, isVeg: true, ageSuitability: 'Kid', description: 'Flavored sparkling water' },
          { id: `${restaurantName}-ds1`, name: 'Tiramisu', category: 'Dessert', price: 220, isVeg: true, ageSuitability: 'All', description: 'Classic coffee dessert' }
        );
        break;
      
      default:
        // Generic menu items
        menu.push(
          { id: `${restaurantName}-s1`, name: 'Mixed Platter', category: 'Starter', price: basePrice + 250, isVeg: true, ageSuitability: 'All', description: 'Assorted appetizers' },
          { id: `${restaurantName}-m1`, name: 'Chef Special', category: 'Main Course', price: basePrice + 350, isVeg: false, ageSuitability: 'All', description: 'House specialty dish' },
          { id: `${restaurantName}-d1`, name: 'Fresh Juice', category: 'Drinks', price: 100, isVeg: true, ageSuitability: 'Kid', description: 'Seasonal fruit juice' },
          { id: `${restaurantName}-ds1`, name: 'Ice Cream', category: 'Dessert', price: 120, isVeg: true, ageSuitability: 'Kid', description: 'Vanilla ice cream' }
        );
    }
  });
  
  return menu.slice(0, 8); // Limit to 8 items per restaurant
};

const getCacheKey = (formData: FormData, offset: number = 0): string => {
  return `${formData.location}-${formData.cuisines.join(',')}-${offset}`;
};

const isValidIndianLocation = (address: string): boolean => {
  const indianKeywords = ['india', 'bharat', 'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad'];
  return indianKeywords.some(keyword => address.toLowerCase().includes(keyword));
};

export const findRestaurants = async (formData: FormData): Promise<Restaurant[]> => {
  currentFormData = formData;
  excludedRestaurantIds.clear(); // Reset excluded IDs for new search
  
  try {
    // First, geocode the location
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(formData.location)}&apiKey=${GEOAPIFY_API_KEY}&filter=countrycode:in`;
    const geocodeResponse = await axios.get(geocodeUrl);
    
    if (!geocodeResponse.data.features || geocodeResponse.data.features.length === 0) {
      throw new Error('Location not found');
    }
    
    const location = geocodeResponse.data.features[0];
    const { lat, lon } = location.properties;
    
    // Search for restaurants using Places API with specific cuisine queries
    const restaurants: Restaurant[] = [];
    
    for (const cuisine of formData.cuisines) {
      const searchQuery = `${cuisine} restaurant`;
      const placesUrl = `${GEOAPIFY_BASE_URL}?categories=catering.restaurant&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&text=${encodeURIComponent(searchQuery)}&apiKey=${GEOAPIFY_API_KEY}&limit=15`;
      
      try {
        const response = await axios.get(placesUrl);
        
        if (response.data.features) {
          const cuisineRestaurants = response.data.features
            .filter((place: any) => isValidIndianLocation(place.properties.formatted || ''))
            .slice(0, 3) // Get 3 restaurants per cuisine
            .map((place: any) => transformToRestaurant(place, [cuisine])); // Pass single cuisine
          
          restaurants.push(...cuisineRestaurants);
        }
      } catch (error) {
        console.error(`Error fetching ${cuisine} restaurants:`, error);
      }
    }
    
    // Remove duplicates and limit to 5 restaurants
    const uniqueRestaurants = restaurants
      .filter((restaurant, index, self) => 
        index === self.findIndex(r => r.name === restaurant.name)
      )
      .slice(0, 5);
    
    currentSearchResults = uniqueRestaurants;
    return uniqueRestaurants;
    
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
    const location = currentFormData.location;
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${GEOAPIFY_API_KEY}&filter=countrycode:in`;
    const geocodeResponse = await axios.get(geocodeUrl);
    
    if (!geocodeResponse.data.features || geocodeResponse.data.features.length === 0) {
      throw new Error('Location not found');
    }
    
    const locationData = geocodeResponse.data.features[0];
    const { lat, lon } = locationData.properties;
    
    const newRestaurants: Restaurant[] = [];
    const neededCount = 5 - starredRestaurants.length;
    
    // Search for new restaurants for each cuisine
    for (const cuisine of currentFormData.cuisines) {
      if (newRestaurants.length >= neededCount) break;
      
      const searchQuery = `${cuisine} restaurant`;
      const placesUrl = `${GEOAPIFY_BASE_URL}?categories=catering.restaurant&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&text=${encodeURIComponent(searchQuery)}&apiKey=${GEOAPIFY_API_KEY}&limit=20`;
      
      try {
        const response = await axios.get(placesUrl);
        
        if (response.data.features) {
          const cuisineRestaurants = response.data.features
            .filter((place: any) => {
              const restaurantId = place.properties.place_id || `${place.properties.name}-${place.properties.lat}-${place.properties.lon}`;
              return isValidIndianLocation(place.properties.formatted || '') && 
                     !excludedRestaurantIds.has(restaurantId);
            })
            .slice(0, Math.ceil(neededCount / currentFormData.cuisines.length))
            .map((place: any) => transformToRestaurant(place, [cuisine]));
          
          newRestaurants.push(...cuisineRestaurants);
        }
      } catch (error) {
        console.error(`Error fetching new ${cuisine} restaurants:`, error);
      }
    }
    
    // Combine starred restaurants with new ones
    const refreshedResults = [
      ...starredRestaurants,
      ...newRestaurants.slice(0, neededCount)
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

const transformToRestaurant = (place: any, cuisines: string[]): Restaurant => {
  const props = place.properties;
  const restaurantId = props.place_id || `${props.name}-${props.lat}-${props.lon}`;
  
  return {
    id: restaurantId,
    name: props.name || 'Restaurant',
    address: props.formatted || props.address_line1 || 'Address not available',
    distance: Math.round((props.distance || 1000) / 1000 * 10) / 10, // Convert to km
    rating: props.rating || (3.5 + Math.random() * 1.5), // Random rating if not available
    priceLevel: Math.ceil(Math.random() * 3), // Random price level 1-3
    cuisine: cuisines, // Use the specific cuisine passed in
    phone: props.contact?.phone,
    website: props.contact?.website,
    menu: generateMenu(cuisines, props.name || 'Restaurant', Math.ceil(Math.random() * 3)),
    coords: { lat: props.lat, lng: props.lon },
    isStarred: false
  };
};

const getFallbackRestaurants = (formData: FormData): Restaurant[] => {
  // Create fallback restaurants that match the selected cuisines
  const fallbackData = [
    { name: 'Spice Garden', cuisineType: 'Indian' },
    { name: 'Royal Kitchen', cuisineType: 'Indian' },
    { name: 'Dragon Palace', cuisineType: 'Chinese' },
    { name: 'Pasta Corner', cuisineType: 'Italian' },
    { name: 'South Delights', cuisineType: 'South Indian' },
    { name: 'Punjabi Dhaba', cuisineType: 'Punjabi' },
    { name: 'Bengal Flavors', cuisineType: 'Bengali' },
    { name: 'Thai Garden', cuisineType: 'Thai' }
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
    name: restaurant.name,
    address: `Near ${formData.location}`,
    distance: 1.2 + (index * 0.5),
    rating: 4.0 + (Math.random() * 1.0),
    priceLevel: Math.ceil(Math.random() * 3),
    cuisine: [restaurant.cuisineType],
    menu: generateMenu([restaurant.cuisineType], restaurant.name, Math.ceil(Math.random() * 3)),
    coords: { lat: 0, lng: 0 },
    isStarred: false
  }));
  
  currentSearchResults = demoRestaurants;
  return demoRestaurants;
};