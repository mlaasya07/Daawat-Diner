import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import RestaurantForm from './components/RestaurantForm';
import RestaurantResults from './components/RestaurantResults';
import { FormData, Restaurant } from './types';
import { findRestaurants } from './services/restaurantService';

function App() {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleSearch = async (data: FormData) => {
    setLoading(true);
    setFormData(data);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const restaurants = findRestaurants(data);
      setResults(restaurants);
    } catch (error) {
      console.error('Error finding restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshResults = (newRestaurants: Restaurant[]) => {
    setResults(prevResults => [...prevResults, ...newRestaurants]);
  };

  const handleNewSearch = () => {
    setResults([]);
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-[#231F20]">
      {/* Header */}
      <header className="bg-[#231F20] border-b-2 border-[#157A6E] py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-3">
            <Utensils className="w-8 h-8 text-[#BB4430]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#F3DFA2] tracking-wide">
              Chatori Diner
            </h1>
            <Utensils className="w-8 h-8 text-[#BB4430]" />
          </div>
          <p className="text-center text-[#157A6E] mt-2 text-lg">
            Discover the perfect dine-in experience across India
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {results.length === 0 ? (
          <RestaurantForm onSearch={handleSearch} loading={loading} />
        ) : (
          <RestaurantResults 
            restaurants={results} 
            formData={formData!}
            onNewSearch={handleNewSearch}
            onRefreshResults={handleRefreshResults}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#231F20] border-t-2 border-[#157A6E] py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#F3DFA2]">
            © 2025 Chatori Diner. Bringing India's flavors to your table.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;