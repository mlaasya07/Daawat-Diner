import React, { useState, useRef } from 'react';
import { Search, MapPin, Users, Calendar, Utensils, DollarSign } from 'lucide-react';
import { FormData } from '../types';
import { getCitiesArray, getAreasForCity } from '../data/locations';
import NumberKeypad from './NumberKeypad';

interface Props {
  onSearch: (data: FormData) => void;
  loading: boolean;
}

const cuisineOptions = [
  'Indian', 'Chinese', 'Italian', 'South Indian', 'Continental',
  'Punjabi', 'Bengali', 'Rajasthani', 'Gujarati', 'Thai', 'Mexican'
];

export default function RestaurantForm({ onSearch, loading }: Props) {
  const [formData, setFormData] = useState<FormData>({
    numPeople: 1,
    ages: [25],
    cuisines: [],
    diet: 'Both',
    budget: undefined,
    city: '',
    area: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [keypadState, setKeypadState] = useState<{
    show: boolean;
    field: string;
    index?: number;
    position: { x: number; y: number };
    value: string;
  }>({
    show: false,
    field: '',
    position: { x: 0, y: 0 },
    value: ''
  });

  const cities = getCitiesArray();
  const areas = formData.city ? getAreasForCity(formData.city) : [];

  // Check if device is mobile
  const isMobile = window.innerWidth <= 768;
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.numPeople < 1) {
      newErrors.numPeople = 'Number of people must be at least 1';
    }

    if (formData.ages.length !== formData.numPeople) {
      newErrors.ages = 'Please provide ages for all people';
    }

    if (formData.ages.some(age => age < 1 || age > 120)) {
      newErrors.ages = 'Ages must be between 1 and 120';
    }

    if (formData.cuisines.length === 0) {
      newErrors.cuisines = 'Please select at least one cuisine';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }

    if (formData.budget && formData.budget <= 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch(formData);
    }
  };

  const handleNumPeopleChange = (value: number) => {
    const newAges = [...formData.ages];
    if (value > formData.numPeople) {
      for (let i = formData.numPeople; i < value; i++) {
        newAges.push(25);
      }
    } else if (value < formData.numPeople) {
      newAges.splice(value);
    }
    
    setFormData({
      ...formData,
      numPeople: value,
      ages: newAges
    });
  };

  const handleAgeChange = (index: number, age: number) => {
    const newAges = [...formData.ages];
    newAges[index] = age;
    setFormData({
      ...formData,
      ages: newAges
    });
  };

  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = formData.cuisines.includes(cuisine)
      ? formData.cuisines.filter(c => c !== cuisine)
      : [...formData.cuisines, cuisine];
    
    setFormData({
      ...formData,
      cuisines: newCuisines
    });
  };

  const handleCityChange = (city: string) => {
    setFormData({
      ...formData,
      city,
      area: '' // Reset area when city changes
    });
  };

  const showKeypad = (event: React.MouseEvent, field: string, index?: number) => {
    // Don't show keypad on mobile devices
    if (isMobile) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    let currentValue = '';
    
    if (field === 'numPeople') {
      currentValue = formData.numPeople.toString();
    } else if (field === 'age' && index !== undefined) {
      currentValue = formData.ages[index].toString();
    } else if (field === 'budget') {
      currentValue = formData.budget?.toString() || '';
    }

    setKeypadState({
      show: true,
      field,
      index,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      },
      value: currentValue
    });
  };

  const handleKeypadChange = (value: string) => {
    setKeypadState(prev => ({ ...prev, value }));
  };

  const handleKeypadClose = () => {
    const numValue = parseInt(keypadState.value) || 0;
    
    if (keypadState.field === 'numPeople') {
      handleNumPeopleChange(Math.max(1, numValue));
    } else if (keypadState.field === 'age' && keypadState.index !== undefined) {
      handleAgeChange(keypadState.index, Math.max(1, Math.min(120, numValue)));
    } else if (keypadState.field === 'budget') {
      setFormData({
        ...formData,
        budget: numValue > 0 ? numValue : undefined
      });
    }

    setKeypadState({
      show: false,
      field: '',
      position: { x: 0, y: 0 },
      value: ''
    });
  };

  // Handle direct input changes for mobile
  const handleDirectInputChange = (field: string, value: string, index?: number) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    const numValue = parseInt(numericValue) || 0;
    
    if (field === 'numPeople') {
      handleNumPeopleChange(Math.max(1, numValue));
    } else if (field === 'age' && index !== undefined) {
      handleAgeChange(index, Math.max(1, Math.min(120, numValue)));
    } else if (field === 'budget') {
      setFormData({
        ...formData,
        budget: numValue > 0 ? numValue : undefined
      });
    }
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#231F20] border-2 border-[#157A6E] rounded-lg p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#F3DFA2] mb-2 no-select">
            Find Your Perfect Dining Experience
          </h2>
          <p className="text-[#157A6E] no-select">
            Tell us about your group and preferences, and we'll suggest the best restaurants
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Number of People */}
          <div>
            <label className="flex items-center space-x-2 text-[#F3DFA2] font-semibold mb-3 no-select">
              <Users className="w-5 h-5 text-[#BB4430]" />
              <span>Number of People *</span>
            </label>
            {isMobile ? (
              <input
                type="number"
                min="1"
                max="20"
                value={formData.numPeople}
                onChange={(e) => handleDirectInputChange('numPeople', e.target.value)}
                className="w-full p-3 bg-[#2A2627] border border-[#157A6E] rounded-lg text-[#F3DFA2] focus:border-[#BB4430] focus:ring-2 focus:ring-[#BB4430] focus:ring-opacity-50 transition-colors"
                placeholder="Enter number of people"
              />
            ) : (
              <button
                type="button"
                onClick={(e) => showKeypad(e, 'numPeople')}
                className="w-full p-3 bg-[#2A2627] border border-[#157A6E] rounded-lg text-[#F3DFA2] focus:border-[#BB4430] focus:ring-2 focus:ring-[#BB4430] focus:ring-opacity-50 transition-colors text-left hover:border-[#BB4430]"
              >
                {formData.numPeople}
              </button>
            )}
            {errors.numPeople && (
              <p className="text-red-400 text-sm mt-1 no-select">{errors.numPeople}</p>
            )}
          </div>

          {/* Ages */}
          <div>
            <label className="flex items-center space-x-2 text-[#F3DFA2] font-semibold mb-3 no-select">
              <Calendar className="w-5 h-5 text-[#BB4430]" />
              <span>Ages (for drink recommendations) *</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {formData.ages.map((age, index) => (
                <div key={index}>
                  <label className="text-sm text-[#157A6E] mb-1 block no-select">
                    Person {index + 1}
                  </label>
                  {isMobile ? (
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => handleDirectInputChange('age', e.target.value, index)}
                      className="w-full p-2 bg-[#2A2627] border border-[#157A6E] rounded-lg text-[#F3DFA2] focus:border-[#BB4430] focus:ring-2 focus:ring-[#BB4430] focus:ring-opacity-50 transition-colors text-center"
                      placeholder="Age"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => showKeypad(e, 'age', index)}
                      className="w-full p-2 bg-[#2A2627] border border-[#157A6E] rounded-lg text-[#F3DFA2] focus:border-[#BB4430] focus:ring-2 focus:ring-[#BB4430] focus:ring-opacity-50 transition-colors hover:border-[#BB4430]"
                    >
                      {age}
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.ages && (
              <p className="text-red-400 text-sm mt-1 no-select">{errors.ages}</p>
            )}
          </div>

          {/* Cuisine Preferences */}
          <div>
            <label className="flex items-center space-x-2 text-[#F3DFA2] font-semibold mb-3 no-select">
              <Utensils className="w-5 h-5 text-[#BB4430]" />
              <span>Cuisine Preferences *</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {cuisineOptions.map((cuisine) => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => handleCuisineToggle(cuisine)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                    formData.cuisines.includes(cuisine)
                      ? 'bg-[#BB4430] border-[#BB4430] text-[#F3DFA2]'
                      : 'bg-[#2A2627] border-[#157A6E] text-[#157A6E] hover:border-[#BB4430] hover:text-[#BB4430]'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
            {errors.cuisines && (
              <p className="text-red-400 text-sm mt-1 no-select">{errors.cuisines}</p>
            )}
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="flex items-center space-x-2 text-[#F3DFA2] font-semibold mb-3 no-select">
              <span>Dietary Preference *</span>
            </label>
            <div className="flex space-x-4">
              {['Veg', 'Non-Veg', 'Both'].map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setFormData({ ...formData, diet: diet as any })}
                  className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                    formData.diet === diet
                      ? 'bg-[#BB4430] border-[#BB4430] text-[#F3DFA2]'
                      : 'bg-[#2A2627] border-[#157A6E] text-[#157A6E] hover:border-[#BB4430] hover:text-[#BB4430]'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center space-x-2 text-[#F3DFA2] font-semibold mb-3 no-select">
              <DollarSign className="w-5 h-5 text-[#BB4430]" />
              <span>Budget per Person (₹) (Optional)</span>
            </label>
            {isMobile ? (
              <input
                type="number"
                min="0"
                value={formData.budget || ''}
                onChange={(e) => handleDirectInputChange('budget', e.target.value)}
                className="w-full p-3 bg-[#2A2627] border border-[#157A6E] rounded-lg text-[#F3DFA2] focus:border-[#BB4430] focus:ring-2 focus:ring-[#BB4430] focus:ring-opacity-50 transition-colors"
                placeholder="Enter budget per person"
              />
            ) : (
              <button
                type="button"
                onClick={(e) => showKeypad(e, 'budget')}
                className="w-full p-3 bg-[#2A2627] border border-[#157A6E] rounded-lg text-[#F3DFA2] focus:border-[#BB4430] focus:ring-2 focus:ring-[#BB4430] focus:ring-opacity-50 transition-colors text-left hover:border-[#BB4430]"
              >
                {formData.budget || 'Enter budget...'}
              </button>
            )}
            {errors.budget && (
              <p className="text-red-400 text-sm mt-1 no-select">{errors.budget}</p>
            )}
          </div>

          {/* City Selection */}
          <div>
            <label className="flex items-center space-x-2 text-[#F3DFA2] font-semibold mb-3 no-select">
              <MapPin className="w-5 h-5 text-[#BB4430]" />
              <span>City *</span>
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full p-3 bg-[#2A2627] border border-[#157A6E] rounded-lg text-[#F3DFA2] focus:border-[#BB4430] focus:ring-2 focus:ring-[#BB4430] focus:ring-opacity-50 transition-colors"
            >
              <option value="" className="text-[#157A6E]">Select your city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-400 text-sm mt-1 no-select">{errors.city}</p>
            )}
          </div>

          {/* Area Selection */}
          <div>
            <label className="flex items-center space-x-2 text-[#F3DFA2] font-semibold mb-3 no-select">
              <MapPin className="w-5 h-5 text-[#BB4430]" />
              <span>Area *</span>
            </label>
            <select
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              disabled={!formData.city}
              className="w-full p-3 bg-[#2A2627] border border-[#157A6E] rounded-lg text-[#F3DFA2] focus:border-[#BB4430] focus:ring-2 focus:ring-[#BB4430] focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" className="text-[#157A6E]">
                {formData.city ? 'Select your area' : 'Select city first'}
              </option>
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            {errors.area && (
              <p className="text-red-400 text-sm mt-1 no-select">{errors.area}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BB4430] hover:bg-[#A03A28] text-[#F3DFA2] font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#F3DFA2]"></div>
                <span>Finding restaurants...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Find Restaurants</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Number Keypad */}
      {keypadState.show && !isMobile && (
        <NumberKeypad
          value={keypadState.value}
          onChange={handleKeypadChange}
          onClose={handleKeypadClose}
          position={keypadState.position}
          maxLength={keypadState.field === 'budget' ? 5 : 3}
        />
      )}
    </div>
  );
}