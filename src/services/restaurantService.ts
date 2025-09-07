import { FormData, Restaurant, MenuItem } from '../types';

// Expanded mock restaurant data with more Indian restaurants and authentic menus
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Spice Garden',
    address: 'MG Road, Bangalore, Karnataka',
    distance: 2.1,
    rating: 4.5,
    priceLevel: 2,
    cuisine: ['Indian', 'South Indian'],
    phone: '+91-80-2557-8899',
    website: 'https://spicegarden.com',
    coords: { lat: 12.9716, lng: 77.5946 },
    menu: [
      // Starters
      { id: 's1', name: 'Paneer Tikka', category: 'Starter', price: 250, isVeg: true, ageSuitability: 'All', description: 'Grilled cottage cheese with spices' },
      { id: 's2', name: 'Chicken 65', category: 'Starter', price: 320, isVeg: false, ageSuitability: 'All', description: 'Spicy fried chicken chunks' },
      { id: 's3', name: 'Samosa Chat', category: 'Starter', price: 180, isVeg: true, ageSuitability: 'All', description: 'Crispy samosas with chutneys' },
      { id: 's4', name: 'Fish Amritsari', category: 'Starter', price: 380, isVeg: false, ageSuitability: 'All', description: 'Batter-fried fish with herbs' },
      
      // Main Course
      { id: 'm1', name: 'Butter Chicken', category: 'Main Course', price: 450, isVeg: false, ageSuitability: 'All', description: 'Creamy tomato-based chicken curry' },
      { id: 'm2', name: 'Palak Paneer', category: 'Main Course', price: 350, isVeg: true, ageSuitability: 'All', description: 'Cottage cheese in spinach gravy' },
      { id: 'm3', name: 'Hyderabadi Biryani', category: 'Main Course', price: 420, isVeg: false, ageSuitability: 'All', description: 'Aromatic rice with mutton' },
      { id: 'm4', name: 'Dal Makhani', category: 'Main Course', price: 280, isVeg: true, ageSuitability: 'All', description: 'Creamy black lentils' },
      { id: 'm5', name: 'Masala Dosa', category: 'Main Course', price: 220, isVeg: true, ageSuitability: 'All', description: 'Crispy crepe with potato filling' },
      
      // Drinks
      { id: 'd1', name: 'Kingfisher Beer', category: 'Drinks', price: 180, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Premium Indian lager' },
      { id: 'd2', name: 'Fresh Lime Soda', category: 'Drinks', price: 80, isVeg: true, ageSuitability: 'All', description: 'Refreshing lime with soda' },
      { id: 'd3', name: 'Mango Lassi', category: 'Drinks', price: 120, isVeg: true, ageSuitability: 'Kid', description: 'Sweet mango yogurt drink' },
      { id: 'd4', name: 'Old Monk Rum', category: 'Drinks', price: 220, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Indian dark rum' },
      { id: 'd5', name: 'Masala Chai', category: 'Drinks', price: 50, isVeg: true, ageSuitability: 'All', description: 'Spiced Indian tea' },
      
      // Desserts
      { id: 'ds1', name: 'Gulab Jamun', category: 'Dessert', price: 150, isVeg: true, ageSuitability: 'All', description: 'Sweet milk dumplings in syrup' },
      { id: 'ds2', name: 'Kulfi Falooda', category: 'Dessert', price: 180, isVeg: true, ageSuitability: 'Kid', description: 'Traditional Indian ice cream with vermicelli' },
    ]
  },
  {
    id: '2',
    name: 'Dragon Palace',
    address: 'Cyber Hub, Gurgaon, Haryana',
    distance: 1.8,
    rating: 4.2,
    priceLevel: 2,
    cuisine: ['Chinese', 'Continental'],
    phone: '+91-124-456-7890',
    coords: { lat: 28.4595, lng: 77.0266 },
    menu: [
      // Starters
      { id: 'c1', name: 'Veg Spring Rolls', category: 'Starter', price: 200, isVeg: true, ageSuitability: 'All', description: 'Crispy vegetable rolls' },
      { id: 'c2', name: 'Chicken Manchurian', category: 'Starter', price: 280, isVeg: false, ageSuitability: 'All', description: 'Indo-Chinese chicken balls' },
      { id: 'c3', name: 'Honey Chilli Potato', category: 'Starter', price: 220, isVeg: true, ageSuitability: 'All', description: 'Sweet and spicy potato fingers' },
      
      // Main Course
      { id: 'c4', name: 'Hakka Noodles', category: 'Main Course', price: 250, isVeg: true, ageSuitability: 'All', description: 'Stir-fried noodles with vegetables' },
      { id: 'c5', name: 'Chicken Fried Rice', category: 'Main Course', price: 320, isVeg: false, ageSuitability: 'All', description: 'Wok-tossed rice with chicken' },
      { id: 'c6', name: 'Szechuan Chicken', category: 'Main Course', price: 380, isVeg: false, ageSuitability: 'All', description: 'Spicy Szechuan-style chicken' },
      
      // Drinks
      { id: 'c7', name: 'Tsingtao Beer', category: 'Drinks', price: 200, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Chinese premium beer' },
      { id: 'c8', name: 'Virgin Mojito', category: 'Drinks', price: 150, isVeg: true, ageSuitability: 'Kid', description: 'Refreshing mint and lime drink' },
      { id: 'c9', name: 'Green Tea', category: 'Drinks', price: 80, isVeg: true, ageSuitability: 'All', description: 'Traditional Chinese green tea' },
      
      // Desserts
      { id: 'c10', name: 'Date Pancake', category: 'Dessert', price: 180, isVeg: true, ageSuitability: 'All', description: 'Sweet Chinese-style pancake' },
    ]
  },
  {
    id: '3',
    name: 'Maharaja Thali',
    address: 'Connaught Place, New Delhi',
    distance: 3.5,
    rating: 4.7,
    priceLevel: 3,
    cuisine: ['Indian', 'Punjabi', 'Rajasthani'],
    phone: '+91-11-2334-5566',
    website: 'https://maharajathali.com',
    coords: { lat: 28.6304, lng: 77.2177 },
    menu: [
      // Starters
      { id: 'r1', name: 'Rajasthani Mirchi Vada', category: 'Starter', price: 180, isVeg: true, ageSuitability: 'All', description: 'Stuffed chili fritters' },
      { id: 'r2', name: 'Mutton Seekh Kebab', category: 'Starter', price: 420, isVeg: false, ageSuitability: 'All', description: 'Grilled minced mutton on skewers' },
      { id: 'r3', name: 'Aloo Tikki', category: 'Starter', price: 120, isVeg: true, ageSuitability: 'All', description: 'Crispy potato patties' },
      
      // Main Course
      { id: 'r4', name: 'Royal Thali', category: 'Main Course', price: 650, isVeg: true, ageSuitability: 'All', description: 'Complete Rajasthani vegetarian meal' },
      { id: 'r5', name: 'Laal Maas', category: 'Main Course', price: 550, isVeg: false, ageSuitability: 'All', description: 'Spicy Rajasthani mutton curry' },
      { id: 'r6', name: 'Gatte Ki Sabzi', category: 'Main Course', price: 320, isVeg: true, ageSuitability: 'All', description: 'Gram flour dumplings in gravy' },
      
      // Drinks
      { id: 'r7', name: 'Royal Stag Whiskey', category: 'Drinks', price: 300, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Premium Indian whiskey' },
      { id: 'r8', name: 'Chaas', category: 'Drinks', price: 70, isVeg: true, ageSuitability: 'All', description: 'Traditional buttermilk' },
      { id: 'r9', name: 'Sugarcane Juice', category: 'Drinks', price: 60, isVeg: true, ageSuitability: 'Kid', description: 'Fresh sugarcane juice' },
      
      // Desserts
      { id: 'r10', name: 'Ghevar', category: 'Dessert', price: 200, isVeg: true, ageSuitability: 'All', description: 'Traditional Rajasthani sweet' },
      { id: 'r11', name: 'Ras Malai', category: 'Dessert', price: 160, isVeg: true, ageSuitability: 'Kid', description: 'Soft cottage cheese in milk' },
    ]
  },
  {
    id: '4',
    name: 'Coastal Kitchen',
    address: 'Marina Beach Road, Chennai, Tamil Nadu',
    distance: 4.2,
    rating: 4.3,
    priceLevel: 2,
    cuisine: ['South Indian', 'Indian'],
    phone: '+91-44-2857-9900',
    coords: { lat: 13.0827, lng: 80.2707 },
    menu: [
      // Starters
      { id: 'sk1', name: 'Fish Fry', category: 'Starter', price: 300, isVeg: false, ageSuitability: 'All', description: 'Crispy fried fish with spices' },
      { id: 'sk2', name: 'Medu Vada', category: 'Starter', price: 80, isVeg: true, ageSuitability: 'All', description: 'Crispy lentil donuts' },
      { id: 'sk3', name: 'Prawn Koliwada', category: 'Starter', price: 380, isVeg: false, ageSuitability: 'All', description: 'Spicy batter-fried prawns' },
      
      // Main Course
      { id: 'sk4', name: 'Fish Curry Rice', category: 'Main Course', price: 350, isVeg: false, ageSuitability: 'All', description: 'Traditional South Indian fish curry with rice' },
      { id: 'sk5', name: 'Sambar Rice', category: 'Main Course', price: 200, isVeg: true, ageSuitability: 'All', description: 'Lentil curry with rice' },
      { id: 'sk6', name: 'Chicken Chettinad', category: 'Main Course', price: 420, isVeg: false, ageSuitability: 'All', description: 'Spicy Tamil-style chicken curry' },
      
      // Drinks
      { id: 'sk7', name: 'Filter Coffee', category: 'Drinks', price: 60, isVeg: true, ageSuitability: 'All', description: 'Traditional South Indian coffee' },
      { id: 'sk8', name: 'Tender Coconut', category: 'Drinks', price: 50, isVeg: true, ageSuitability: 'Kid', description: 'Fresh coconut water' },
      { id: 'sk9', name: 'Arrack', category: 'Drinks', price: 250, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Traditional palm wine' },
      
      // Desserts
      { id: 'sk10', name: 'Payasam', category: 'Dessert', price: 120, isVeg: true, ageSuitability: 'All', description: 'Sweet rice pudding' },
    ]
  },
  {
    id: '5',
    name: 'Giuseppe\'s Italian',
    address: 'Khan Market, New Delhi',
    distance: 2.7,
    rating: 4.4,
    priceLevel: 3,
    cuisine: ['Italian', 'Continental'],
    phone: '+91-11-4166-7788',
    website: 'https://giuseppesitalian.com',
    coords: { lat: 28.5983, lng: 77.2301 },
    menu: [
      // Starters
      { id: 'i1', name: 'Bruschetta', category: 'Starter', price: 280, isVeg: true, ageSuitability: 'All', description: 'Toasted bread with tomato and basil' },
      { id: 'i2', name: 'Chicken Caesar Salad', category: 'Starter', price: 380, isVeg: false, ageSuitability: 'All', description: 'Classic Caesar with grilled chicken' },
      { id: 'i3', name: 'Antipasto Platter', category: 'Starter', price: 450, isVeg: false, ageSuitability: 'All', description: 'Italian cold cuts and cheese' },
      
      // Main Course
      { id: 'i4', name: 'Margherita Pizza', category: 'Main Course', price: 420, isVeg: true, ageSuitability: 'All', description: 'Classic tomato and mozzarella pizza' },
      { id: 'i5', name: 'Chicken Alfredo Pasta', category: 'Main Course', price: 480, isVeg: false, ageSuitability: 'All', description: 'Creamy pasta with grilled chicken' },
      { id: 'i6', name: 'Lasagna', category: 'Main Course', price: 520, isVeg: false, ageSuitability: 'All', description: 'Layered pasta with meat sauce' },
      
      // Drinks
      { id: 'i7', name: 'Chianti Wine', category: 'Drinks', price: 400, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Italian red wine' },
      { id: 'i8', name: 'Italian Soda', category: 'Drinks', price: 120, isVeg: true, ageSuitability: 'Kid', description: 'Flavored sparkling water' },
      { id: 'i9', name: 'Espresso', category: 'Drinks', price: 80, isVeg: true, ageSuitability: 'All', description: 'Strong Italian coffee' },
      
      // Desserts
      { id: 'i10', name: 'Tiramisu', category: 'Dessert', price: 220, isVeg: true, ageSuitability: 'All', description: 'Classic Italian dessert with coffee' },
      { id: 'i11', name: 'Gelato', category: 'Dessert', price: 180, isVeg: true, ageSuitability: 'Kid', description: 'Italian ice cream' },
    ]
  },
  {
    id: '6',
    name: 'Bombay Brasserie',
    address: 'Bandra West, Mumbai, Maharashtra',
    distance: 1.5,
    rating: 4.6,
    priceLevel: 3,
    cuisine: ['Indian', 'Punjabi', 'Continental'],
    phone: '+91-22-2640-1234',
    website: 'https://bombaybrasserie.com',
    coords: { lat: 19.0596, lng: 72.8295 },
    menu: [
      { id: 'bb1', name: 'Tandoori Platter', category: 'Starter', price: 480, isVeg: false, ageSuitability: 'All', description: 'Mixed grilled meats and vegetables' },
      { id: 'bb2', name: 'Pani Puri', category: 'Starter', price: 120, isVeg: true, ageSuitability: 'All', description: 'Crispy shells with spiced water' },
      { id: 'bb3', name: 'Bombay Duck Fry', category: 'Starter', price: 350, isVeg: false, ageSuitability: 'All', description: 'Local Mumbai fish specialty' },
      { id: 'bb4', name: 'Vada Pav', category: 'Main Course', price: 80, isVeg: true, ageSuitability: 'All', description: 'Mumbai street food burger' },
      { id: 'bb5', name: 'Koliwada Prawns', category: 'Main Course', price: 450, isVeg: false, ageSuitability: 'All', description: 'Spicy batter-fried prawns' },
      { id: 'bb6', name: 'Pav Bhaji', category: 'Main Course', price: 180, isVeg: true, ageSuitability: 'All', description: 'Spiced vegetable curry with bread' },
      { id: 'bb7', name: 'Solkadhi', category: 'Drinks', price: 90, isVeg: true, ageSuitability: 'All', description: 'Kokum and coconut drink' },
      { id: 'bb8', name: 'Mumbai Cutting Chai', category: 'Drinks', price: 40, isVeg: true, ageSuitability: 'All', description: 'Half glass of spiced tea' },
      { id: 'bb9', name: 'Feni', category: 'Drinks', price: 280, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Goan cashew spirit' },
      { id: 'bb10', name: 'Modak', category: 'Dessert', price: 140, isVeg: true, ageSuitability: 'All', description: 'Sweet steamed dumplings' },
    ]
  },
  {
    id: '7',
    name: 'Kolkata Kitchen',
    address: 'Park Street, Kolkata, West Bengal',
    distance: 2.3,
    rating: 4.4,
    priceLevel: 2,
    cuisine: ['Bengali', 'Indian'],
    phone: '+91-33-2229-5678',
    coords: { lat: 22.5726, lng: 88.3639 },
    menu: [
      { id: 'kk1', name: 'Fish Cutlet', category: 'Starter', price: 180, isVeg: false, ageSuitability: 'All', description: 'Bengali-style fish croquettes' },
      { id: 'kk2', name: 'Beguni', category: 'Starter', price: 100, isVeg: true, ageSuitability: 'All', description: 'Batter-fried eggplant slices' },
      { id: 'kk3', name: 'Kosha Mangsho', category: 'Main Course', price: 420, isVeg: false, ageSuitability: 'All', description: 'Slow-cooked mutton curry' },
      { id: 'kk4', name: 'Machher Jhol', category: 'Main Course', price: 350, isVeg: false, ageSuitability: 'All', description: 'Traditional Bengali fish curry' },
      { id: 'kk5', name: 'Aloo Posto', category: 'Main Course', price: 220, isVeg: true, ageSuitability: 'All', description: 'Potatoes in poppy seed paste' },
      { id: 'kk6', name: 'Luchi', category: 'Main Course', price: 60, isVeg: true, ageSuitability: 'All', description: 'Deep-fried Bengali bread' },
      { id: 'kk7', name: 'Cha', category: 'Drinks', price: 30, isVeg: true, ageSuitability: 'All', description: 'Bengali-style tea' },
      { id: 'kk8', name: 'Daab Sharbat', category: 'Drinks', price: 80, isVeg: true, ageSuitability: 'Kid', description: 'Tender coconut drink' },
      { id: 'kk9', name: 'Mishti Doi', category: 'Dessert', price: 120, isVeg: true, ageSuitability: 'All', description: 'Sweet yogurt dessert' },
      { id: 'kk10', name: 'Rasgulla', category: 'Dessert', price: 100, isVeg: true, ageSuitability: 'Kid', description: 'Spongy cottage cheese balls in syrup' },
    ]
  },
  {
    id: '8',
    name: 'Punjabi Dhaba',
    address: 'GT Road, Amritsar, Punjab',
    distance: 5.2,
    rating: 4.3,
    priceLevel: 2,
    cuisine: ['Punjabi', 'Indian'],
    phone: '+91-183-2555-999',
    coords: { lat: 31.6340, lng: 74.8723 },
    menu: [
      { id: 'pd1', name: 'Amritsari Kulcha', category: 'Starter', price: 120, isVeg: true, ageSuitability: 'All', description: 'Stuffed bread from Amritsar' },
      { id: 'pd2', name: 'Tandoori Chicken', category: 'Starter', price: 380, isVeg: false, ageSuitability: 'All', description: 'Clay oven roasted chicken' },
      { id: 'pd3', name: 'Sarson Ka Saag', category: 'Main Course', price: 280, isVeg: true, ageSuitability: 'All', description: 'Mustard greens curry' },
      { id: 'pd4', name: 'Makki Di Roti', category: 'Main Course', price: 80, isVeg: true, ageSuitability: 'All', description: 'Corn flour flatbread' },
      { id: 'pd5', name: 'Rajma Chawal', category: 'Main Course', price: 220, isVeg: true, ageSuitability: 'All', description: 'Kidney beans with rice' },
      { id: 'pd6', name: 'Chole Bhature', category: 'Main Course', price: 180, isVeg: true, ageSuitability: 'All', description: 'Spiced chickpeas with fried bread' },
      { id: 'pd7', name: 'Lassi', category: 'Drinks', price: 100, isVeg: true, ageSuitability: 'Kid', description: 'Traditional yogurt drink' },
      { id: 'pd8', name: 'Punjabi Chai', category: 'Drinks', price: 40, isVeg: true, ageSuitability: 'All', description: 'Strong milk tea' },
      { id: 'pd9', name: 'Jalebi', category: 'Dessert', price: 120, isVeg: true, ageSuitability: 'All', description: 'Crispy sweet spirals' },
    ]
  },
  {
    id: '9',
    name: 'Hyderabadi House',
    address: 'Charminar, Hyderabad, Telangana',
    distance: 3.8,
    rating: 4.5,
    priceLevel: 2,
    cuisine: ['Indian', 'South Indian'],
    phone: '+91-40-2452-7890',
    coords: { lat: 17.3850, lng: 78.4867 },
    menu: [
      { id: 'hh1', name: 'Haleem', category: 'Starter', price: 200, isVeg: false, ageSuitability: 'All', description: 'Slow-cooked lentil and meat stew' },
      { id: 'hh2', name: 'Lukhmi', category: 'Starter', price: 80, isVeg: false, ageSuitability: 'All', description: 'Hyderabadi meat pastry' },
      { id: 'hh3', name: 'Hyderabadi Biryani', category: 'Main Course', price: 450, isVeg: false, ageSuitability: 'All', description: 'Aromatic rice with tender mutton' },
      { id: 'hh4', name: 'Bagara Baingan', category: 'Main Course', price: 280, isVeg: true, ageSuitability: 'All', description: 'Stuffed baby eggplants' },
      { id: 'hh5', name: 'Nihari', category: 'Main Course', price: 380, isVeg: false, ageSuitability: 'All', description: 'Slow-cooked beef stew' },
      { id: 'hh6', name: 'Irani Chai', category: 'Drinks', price: 50, isVeg: true, ageSuitability: 'All', description: 'Hyderabadi-style tea' },
      { id: 'hh7', name: 'Rooh Afza', category: 'Drinks', price: 60, isVeg: true, ageSuitability: 'Kid', description: 'Rose-flavored drink' },
      { id: 'hh8', name: 'Double Ka Meetha', category: 'Dessert', price: 150, isVeg: true, ageSuitability: 'All', description: 'Bread pudding with nuts' },
      { id: 'hh9', name: 'Qubani Ka Meetha', category: 'Dessert', price: 180, isVeg: true, ageSuitability: 'All', description: 'Apricot dessert' },
    ]
  },
  {
    id: '10',
    name: 'Gujarati Thali House',
    address: 'Law Garden, Ahmedabad, Gujarat',
    distance: 2.9,
    rating: 4.4,
    priceLevel: 2,
    cuisine: ['Gujarati', 'Indian'],
    phone: '+91-79-2630-4567',
    coords: { lat: 23.0225, lng: 72.5714 },
    menu: [
      { id: 'gt1', name: 'Dhokla', category: 'Starter', price: 100, isVeg: true, ageSuitability: 'All', description: 'Steamed gram flour cakes' },
      { id: 'gt2', name: 'Khandvi', category: 'Starter', price: 120, isVeg: true, ageSuitability: 'All', description: 'Rolled gram flour sheets' },
      { id: 'gt3', name: 'Gujarati Thali', category: 'Main Course', price: 350, isVeg: true, ageSuitability: 'All', description: 'Complete Gujarati meal' },
      { id: 'gt4', name: 'Undhiyu', category: 'Main Course', price: 280, isVeg: true, ageSuitability: 'All', description: 'Mixed vegetable curry' },
      { id: 'gt5', name: 'Handvo', category: 'Main Course', price: 180, isVeg: true, ageSuitability: 'All', description: 'Savory lentil cake' },
      { id: 'gt6', name: 'Chaas', category: 'Drinks', price: 60, isVeg: true, ageSuitability: 'All', description: 'Spiced buttermilk' },
      { id: 'gt7', name: 'Sugarcane Juice', category: 'Drinks', price: 50, isVeg: true, ageSuitability: 'Kid', description: 'Fresh sugarcane juice' },
      { id: 'gt8', name: 'Shrikhand', category: 'Dessert', price: 140, isVeg: true, ageSuitability: 'Kid', description: 'Sweet strained yogurt' },
      { id: 'gt9', name: 'Mohanthal', category: 'Dessert', price: 160, isVeg: true, ageSuitability: 'All', description: 'Gram flour fudge' },
    ]
  },
  {
    id: '11',
    name: 'Thai Garden',
    address: 'Hauz Khas Village, New Delhi',
    distance: 4.1,
    rating: 4.2,
    priceLevel: 3,
    cuisine: ['Thai', 'Continental'],
    phone: '+91-11-4166-8899',
    coords: { lat: 28.5494, lng: 77.1960 },
    menu: [
      { id: 'tg1', name: 'Tom Yum Soup', category: 'Starter', price: 280, isVeg: false, ageSuitability: 'All', description: 'Spicy Thai soup with prawns' },
      { id: 'tg2', name: 'Spring Rolls', category: 'Starter', price: 220, isVeg: true, ageSuitability: 'All', description: 'Fresh vegetable rolls' },
      { id: 'tg3', name: 'Pad Thai', category: 'Main Course', price: 380, isVeg: false, ageSuitability: 'All', description: 'Stir-fried rice noodles' },
      { id: 'tg4', name: 'Green Curry', category: 'Main Course', price: 420, isVeg: true, ageSuitability: 'All', description: 'Coconut-based curry' },
      { id: 'tg5', name: 'Thai Basil Rice', category: 'Main Course', price: 320, isVeg: true, ageSuitability: 'All', description: 'Fragrant basil fried rice' },
      { id: 'tg6', name: 'Thai Iced Tea', category: 'Drinks', price: 120, isVeg: true, ageSuitability: 'Kid', description: 'Sweet condensed milk tea' },
      { id: 'tg7', name: 'Coconut Water', category: 'Drinks', price: 80, isVeg: true, ageSuitability: 'All', description: 'Fresh coconut water' },
      { id: 'tg8', name: 'Mango Sticky Rice', category: 'Dessert', price: 200, isVeg: true, ageSuitability: 'Kid', description: 'Sweet rice with mango' },
    ]
  },
  {
    id: '12',
    name: 'Mexican Fiesta',
    address: 'Brigade Road, Bangalore, Karnataka',
    distance: 3.2,
    rating: 4.1,
    priceLevel: 2,
    cuisine: ['Mexican', 'Continental'],
    phone: '+91-80-4112-3456',
    coords: { lat: 12.9716, lng: 77.5946 },
    menu: [
      { id: 'mf1', name: 'Nachos Supreme', category: 'Starter', price: 280, isVeg: true, ageSuitability: 'All', description: 'Tortilla chips with cheese and salsa' },
      { id: 'mf2', name: 'Chicken Wings', category: 'Starter', price: 320, isVeg: false, ageSuitability: 'All', description: 'Spicy buffalo wings' },
      { id: 'mf3', name: 'Burrito Bowl', category: 'Main Course', price: 380, isVeg: true, ageSuitability: 'All', description: 'Rice bowl with beans and vegetables' },
      { id: 'mf4', name: 'Chicken Quesadilla', category: 'Main Course', price: 420, isVeg: false, ageSuitability: 'All', description: 'Grilled tortilla with chicken and cheese' },
      { id: 'mf5', name: 'Vegetarian Tacos', category: 'Main Course', price: 300, isVeg: true, ageSuitability: 'All', description: 'Soft tacos with grilled vegetables' },
      { id: 'mf6', name: 'Corona Beer', category: 'Drinks', price: 220, isVeg: true, ageSuitability: 'Adult', isAlcoholic: true, description: 'Mexican lager beer' },
      { id: 'mf7', name: 'Virgin Margarita', category: 'Drinks', price: 150, isVeg: true, ageSuitability: 'Kid', description: 'Lime and salt mocktail' },
      { id: 'mf8', name: 'Churros', category: 'Dessert', price: 180, isVeg: true, ageSuitability: 'Kid', description: 'Fried dough with cinnamon sugar' },
    ]
  }
];

let lastSearchResults: Restaurant[] = [];
let currentSearchParams: FormData | null = null;

export function findRestaurants(formData: FormData, refresh: boolean = false): Restaurant[] {
  // Store search parameters for refresh functionality
  if (!refresh) {
    currentSearchParams = formData;
  }
  
  // Filter restaurants based on location and cuisine
  let filteredRestaurants = mockRestaurants.filter(restaurant => {
    // Location filter (mock - in real app would use geolocation)
    const locationMatches = restaurant.address.toLowerCase().includes(
      formData.location.toLowerCase().split(',')[0].toLowerCase()
    );
    
    // Cuisine filter
    const cuisineMatches = formData.cuisines.some(cuisine =>
      restaurant.cuisine.some(restCuisine =>
        restCuisine.toLowerCase().includes(cuisine.toLowerCase())
      )
    );
    
    return locationMatches || cuisineMatches;
  });

  // If refreshing, exclude previously shown restaurants and shuffle the remaining
  if (refresh && lastSearchResults.length > 0) {
    const previousIds = lastSearchResults.map(r => r.id);
    filteredRestaurants = filteredRestaurants.filter(r => !previousIds.includes(r.id));
    
    // Shuffle the remaining restaurants for variety
    filteredRestaurants = shuffleArray(filteredRestaurants);
  }

  // Sort by rating and distance
  const sortedRestaurants = filteredRestaurants.sort((a, b) => {
    const ratingDiff = b.rating - a.rating;
    if (Math.abs(ratingDiff) > 0.2) return ratingDiff;
    return a.distance - b.distance;
  });

  // Return more restaurants (up to 8 instead of 5)
  const results = sortedRestaurants.slice(0, 8);
  
  // Store results for next refresh
  if (!refresh) {
    lastSearchResults = results;
  } else {
    lastSearchResults = [...lastSearchResults, ...results];
  }
  
  return results;
}

export function refreshRestaurants(): Restaurant[] {
  if (!currentSearchParams) {
    return [];
  }
  return findRestaurants(currentSearchParams, true);
}

export function hasMoreRestaurants(): boolean {
  if (!currentSearchParams) return false;
  
  const allMatching = mockRestaurants.filter(restaurant => {
    const locationMatches = restaurant.address.toLowerCase().includes(
      currentSearchParams!.location.toLowerCase().split(',')[0].toLowerCase()
    );
    
    const cuisineMatches = currentSearchParams!.cuisines.some(cuisine =>
      restaurant.cuisine.some(restCuisine =>
        restCuisine.toLowerCase().includes(cuisine.toLowerCase())
      )
    );
    
    return locationMatches || cuisineMatches;
  });
  
  return allMatching.length > lastSearchResults.length;
}

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}