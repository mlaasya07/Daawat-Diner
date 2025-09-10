export interface FormData {
  numPeople: number;
  ages: number[];
  cuisines: string[];
  diet: 'Veg' | 'Non-Veg' | 'Both';
  budget?: number;
  location: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Starter' | 'Main Course' | 'Dessert' | 'Drinks';
  price: number;
  isVeg: boolean;
  isAlcoholic?: boolean;
  ageSuitability: 'Adult' | 'Kid' | 'All';
  description?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  priceLevel: number;
  cuisine: string[];
  phone?: string;
  website?: string;
  menu: MenuItem[];
  coords: { lat: number; lng: number };
  isStarred?: boolean;
}