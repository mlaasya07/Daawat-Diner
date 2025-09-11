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

// Enhanced menu generation based on cuisine and restaurant characteristics
const generateCuisineSpecificMenu = (cuisines: string[], restaurantName: string, priceLevel: number): MenuItem[] => {
  const menu: MenuItem[] = [];
  const basePrice = priceLevel * 80; // Base price multiplier
  
  cuisines.forEach(cuisine => {
    const cuisineType = cuisine.toLowerCase();
    
    if (cuisineType.includes('indian') || cuisineType === 'punjabi' || cuisineType === 'north indian') {
      menu.push(
        { id: `${restaurantName}-${cuisine}-s1`, name: 'Paneer Tikka', category: 'Starter', price: basePrice + 220, isVeg: true, ageSuitability: 'All', description: 'Grilled cottage cheese marinated in spices' },
        { id: `${restaurantName}-${cuisine}-s2`, name: 'Chicken Tikka', category: 'Starter', price: basePrice + 280, isVeg: false, ageSuitability: 'All', description: 'Tender grilled chicken pieces' },
        { id: `${restaurantName}-${cuisine}-m1`, name: 'Butter Chicken', category: 'Main Course', price: basePrice + 380, isVeg: false, ageSuitability: 'All', description: 'Creamy tomato-based chicken curry' },
        { id: `${restaurantName}-${cuisine}-m2`, name: 'Dal Makhani', category: 'Main Course', price: basePrice + 280, isVeg: true, ageSuitability: 'All', description: 'Rich black lentils in cream' },
        { id: `${restaurantName}-${cuisine}-m3`, name: 'Biryani', category: 'Main Course', price: basePrice + 320, isVeg: false, ageSuitability: 'All', description: 'Aromatic basmati rice with spiced meat' },
        { id: `${restaurantName}-${cuisine}-d1`, name: 'Kingfisher Beer', category: 'Drinks', price: 180, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Premium Indian lager' },
        { id: `${restaurantName}-${cuisine}-d2`, name: 'Mango Lassi', category: 'Drinks', price: 120, isVeg: true, ageSuitability: 'Kid', description: 'Sweet mango yogurt drink' },
        { id: `${restaurantName}-${cuisine}-ds1`, name: 'Gulab Jamun', category: 'Dessert', price: 150, isVeg: true, ageSuitability: 'All', description: 'Sweet milk dumplings in syrup' }
      );
    }
    
    if (cuisineType.includes('south indian')) {
      menu.push(
        { id: `${restaurantName}-${cuisine}-s1`, name: 'Medu Vada', category: 'Starter', price: basePrice + 100, isVeg: true, ageSuitability: 'All', description: 'Crispy lentil donuts with chutney' },
        { id: `${restaurantName}-${cuisine}-s2`, name: 'Fish Fry', category: 'Starter', price: basePrice + 320, isVeg: false, ageSuitability: 'All', description: 'Spiced and fried fish pieces' },
        { id: `${restaurantName}-${cuisine}-m1`, name: 'Masala Dosa', category: 'Main Course', price: basePrice + 180, isVeg: true, ageSuitability: 'All', description: 'Crispy crepe with spiced potato filling' },
        { id: `${restaurantName}-${cuisine}-m2`, name: 'Sambar Rice', category: 'Main Course', price: basePrice + 160, isVeg: true, ageSuitability: 'All', description: 'Rice with lentil curry' },
        { id: `${restaurantName}-${cuisine}-m3`, name: 'Fish Curry', category: 'Main Course', price: basePrice + 350, isVeg: false, ageSuitability: 'All', description: 'Traditional coconut fish curry' },
        { id: `${restaurantName}-${cuisine}-d1`, name: 'Filter Coffee', category: 'Drinks', price: 60, isVeg: true, ageSuitability: 'All', description: 'Traditional South Indian coffee' },
        { id: `${restaurantName}-${cuisine}-d2`, name: 'Tender Coconut', category: 'Drinks', price: 50, isVeg: true, ageSuitability: 'Kid', description: 'Fresh coconut water' },
        { id: `${restaurantName}-${cuisine}-ds1`, name: 'Payasam', category: 'Dessert', price: 120, isVeg: true, ageSuitability: 'All', description: 'Sweet rice pudding with nuts' }
      );
    }
    
    if (cuisineType.includes('chinese')) {
      menu.push(
        { id: `${restaurantName}-${cuisine}-s1`, name: 'Spring Rolls', category: 'Starter', price: basePrice + 200, isVeg: true, ageSuitability: 'All', description: 'Crispy vegetable rolls' },
        { id: `${restaurantName}-${cuisine}-s2`, name: 'Chicken Manchurian', category: 'Starter', price: basePrice + 280, isVeg: false, ageSuitability: 'All', description: 'Indo-Chinese chicken in tangy sauce' },
        { id: `${restaurantName}-${cuisine}-m1`, name: 'Hakka Noodles', category: 'Main Course', price: basePrice + 250, isVeg: true, ageSuitability: 'All', description: 'Stir-fried noodles with vegetables' },
        { id: `${restaurantName}-${cuisine}-m2`, name: 'Sweet & Sour Chicken', category: 'Main Course', price: basePrice + 320, isVeg: false, ageSuitability: 'All', description: 'Chicken in sweet and tangy sauce' },
        { id: `${restaurantName}-${cuisine}-m3`, name: 'Fried Rice', category: 'Main Course', price: basePrice + 220, isVeg: false, ageSuitability: 'All', description: 'Wok-tossed rice with egg and vegetables' },
        { id: `${restaurantName}-${cuisine}-d1`, name: 'Green Tea', category: 'Drinks', price: 80, isVeg: true, ageSuitability: 'All', description: 'Traditional Chinese green tea' },
        { id: `${restaurantName}-${cuisine}-d2`, name: 'Fresh Lime Soda', category: 'Drinks', price: 100, isVeg: true, ageSuitability: 'Kid', description: 'Refreshing lime drink' },
        { id: `${restaurantName}-${cuisine}-ds1`, name: 'Date Pancake', category: 'Dessert', price: 180, isVeg: true, ageSuitability: 'All', description: 'Sweet Chinese-style pancake' }
      );
    }
    
    if (cuisineType.includes('italian')) {
      menu.push(
        { id: `${restaurantName}-${cuisine}-s1`, name: 'Bruschetta', category: 'Starter', price: basePrice + 280, isVeg: true, ageSuitability: 'All', description: 'Toasted bread with fresh tomatoes' },
        { id: `${restaurantName}-${cuisine}-s2`, name: 'Caesar Salad', category: 'Starter', price: basePrice + 320, isVeg: false, ageSuitability: 'All', description: 'Classic salad with parmesan' },
        { id: `${restaurantName}-${cuisine}-m1`, name: 'Margherita Pizza', category: 'Main Course', price: basePrice + 420, isVeg: true, ageSuitability: 'All', description: 'Classic tomato and mozzarella pizza' },
        { id: `${restaurantName}-${cuisine}-m2`, name: 'Chicken Alfredo', category: 'Main Course', price: basePrice + 480, isVeg: false, ageSuitability: 'All', description: 'Creamy pasta with grilled chicken' },
        { id: `${restaurantName}-${cuisine}-m3`, name: 'Lasagna', category: 'Main Course', price: basePrice + 450, isVeg: false, ageSuitability: 'All', description: 'Layered pasta with meat sauce' },
        { id: `${restaurantName}-${cuisine}-d1`, name: 'Italian Wine', category: 'Drinks', price: 400, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'House red wine' },
        { id: `${restaurantName}-${cuisine}-d2`, name: 'Italian Soda', category: 'Drinks', price: 120, isVeg: true, ageSuitability: 'Kid', description: 'Flavored sparkling water' },
        { id: `${restaurantName}-${cuisine}-ds1`, name: 'Tiramisu', category: 'Dessert', price: 220, isVeg: true, ageSuitability: 'All', description: 'Classic coffee-flavored dessert' }
      );
    }
    
    if (cuisineType.includes('bengali')) {
      menu.push(
        { id: `${restaurantName}-${cuisine}-s1`, name: 'Fish Fry', category: 'Starter', price: basePrice + 300, isVeg: false, ageSuitability: 'All', description: 'Bengali style fried fish' },
        { id: `${restaurantName}-${cuisine}-s2`, name: 'Beguni', category: 'Starter', price: basePrice + 120, isVeg: true, ageSuitability: 'All', description: 'Fried eggplant fritters' },
        { id: `${restaurantName}-${cuisine}-m1`, name: 'Machher Jhol', category: 'Main Course', price: basePrice + 380, isVeg: false, ageSuitability: 'All', description: 'Traditional Bengali fish curry' },
        { id: `${restaurantName}-${cuisine}-m2`, name: 'Aloo Posto', category: 'Main Course', price: basePrice + 220, isVeg: true, ageSuitability: 'All', description: 'Potato curry with poppy seeds' },
        { id: `${restaurantName}-${cuisine}-d1`, name: 'Cha', category: 'Drinks', price: 40, isVeg: true, ageSuitability: 'All', description: 'Bengali style tea' },
        { id: `${restaurantName}-${cuisine}-ds1`, name: 'Rasgulla', category: 'Dessert', price: 100, isVeg: true, ageSuitability: 'All', description: 'Spongy cottage cheese balls in syrup' }
      );
    }
    
    if (cuisineType.includes('thai')) {
      menu.push(
        { id: `${restaurantName}-${cuisine}-s1`, name: 'Tom Yum Soup', category: 'Starter', price: basePrice + 250, isVeg: false, ageSuitability: 'All', description: 'Spicy and sour Thai soup' },
        { id: `${restaurantName}-${cuisine}-m1`, name: 'Pad Thai', category: 'Main Course', price: basePrice + 320, isVeg: false, ageSuitability: 'All', description: 'Stir-fried rice noodles' },
        { id: `${restaurantName}-${cuisine}-m2`, name: 'Green Curry', category: 'Main Course', price: basePrice + 380, isVeg: false, ageSuitability: 'All', description: 'Coconut curry with herbs' },
        { id: `${restaurantName}-${cuisine}-d1`, name: 'Thai Iced Tea', category: 'Drinks', price: 150, isVeg: true, ageSuitability: 'All', description: 'Sweet Thai tea with milk' },
        { id: `${restaurantName}-${cuisine}-ds1`, name: 'Mango Sticky Rice', category: 'Dessert', price: 200, isVeg: true, ageSuitability: 'All', description: 'Sweet rice with fresh mango' }
      );
    }
  });
  
  // Remove duplicates and limit to reasonable menu size
  const uniqueMenu = menu.filter((item, index, self) => 
    index === self.findIndex(t => t.name === item.name && t.category === item.category)
  );
  
  return uniqueMenu.slice(0, 12); // Limit to 12 items per restaurant
};

const getCacheKey = (formData: FormData, offset: number = 0): string => {
  return `${formData.city}-${formData.area}-${formData.cuisines.join(',')}-${offset}`;
};

const isValidLocation = (address: string, targetCity: string, targetArea: string): boolean => {
  const addressLower = address.toLowerCase();
  const cityLower = targetCity.toLowerCase();
  const areaLower = targetArea.toLowerCase();
  
  return addressLower.includes(cityLower) || addressLower.includes(areaLower);
};

export const findRestaurants = async (formData: FormData): Promise<Restaurant[]> => {
  currentFormData = formData;
  excludedRestaurantIds.clear(); // Reset excluded IDs for new search
  
  try {
    // Geocode the specific area within the city
    const locationQuery = `${formData.area}, ${formData.city}, India`;
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationQuery)}&apiKey=${GEOAPIFY_API_KEY}&filter=countrycode:in`;
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
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationQuery)}&apiKey=${GEOAPIFY_API_KEY}&filter=countrycode:in`;
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
  
  return {
    id: restaurantId,
    name: name,
    address: props.formatted || props.address_line1 || `${formData.area}, ${formData.city}`,
    distance: Math.round((props.distance || 1000) / 1000 * 10) / 10, // Convert to km
    rating: props.rating || (3.8 + Math.random() * 1.2), // Random rating if not available
    priceLevel: priceLevel,
    cuisine: cuisines, // Use the specific cuisine passed in
    phone: props.contact?.phone,
    website: props.contact?.website,
    menu: generateCuisineSpecificMenu(cuisines, name, priceLevel),
    coords: { lat: props.lat, lng: props.lon },
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
    rating: 4.0 + (Math.random() * 1.0),
    priceLevel: Math.ceil(Math.random() * 3),
    cuisine: [restaurant.cuisineType],
    menu: generateCuisineSpecificMenu([restaurant.cuisineType], restaurant.name, Math.ceil(Math.random() * 3)),
    coords: { lat: 0, lng: 0 },
    isStarred: false
  }));
  
  currentSearchResults = demoRestaurants;
  return demoRestaurants;
};