# دعوت Diner

**Discover the perfect dine-in experience across India**

دعوت Diner is a sophisticated restaurant discovery application that helps users find the perfect dining experience across major Indian cities. The app features a retro aesthetic with Arabic-inspired branding and provides intelligent restaurant recommendations based on user preferences.

## ✨ Features

- **🏙️ City-Area Based Search** - Search across 12+ major Indian cities with 15+ areas each
- **🍽️ Top 5 Restaurant Results** - Get exactly 5 curated restaurant recommendations per search
- **⭐ Smart Star System** - Star your favorite restaurants and refresh to get new options while keeping starred ones
- **🔢 Custom Number Keypad** - Hovering number keypad for desktop with brand colors (mobile uses native keyboard)
- **🗺️ Real-time Location Data** - Accurate restaurant locations with direct Google Maps integration
- **🍜 Cuisine-Specific Filtering** - Choose from 11 different cuisines for targeted recommendations
- **👶 Age-Based Recommendations** - Considers group ages for appropriate dining suggestions
- **💰 Budget Calculations** - Filter restaurants based on your budget per person
- **😏 Satirical Error Messages** - Humorous messages when search options are exhausted
- **📱 Fully Responsive** - Perfect experience on mobile, tablet, and desktop devices

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for beautiful, consistent icons
- **API**: Geoapify for accurate location data and restaurant search
- **Maps**: Google Maps integration for navigation

## 🌍 Supported Cities & Areas

### Major Cities (12+)
- **Mumbai**: Bandra, Andheri, Juhu, Powai, Colaba, Fort, Worli, Lower Parel, and more
- **Delhi**: Connaught Place, Khan Market, Karol Bagh, Saket, Hauz Khas, and more
- **Bangalore**: Koramangala, Indiranagar, Whitefield, Electronic City, BTM Layout, and more
- **Hyderabad**: Kukatpally, Banjara Hills, Jubilee Hills, Gachibowli, Hitech City, and more
- **Chennai**: T. Nagar, Anna Nagar, Adyar, Velachery, OMR, ECR, and more
- **Kolkata**: Park Street, Salt Lake, New Town, Ballygunge, Gariahat, and more
- **Pune**: Koregaon Park, Baner, Wakad, Hinjewadi, Kothrud, and more
- **Ahmedabad**: Satellite, Vastrapur, Bodakdev, SG Highway, and more
- **Jaipur**: C-Scheme, MI Road, Malviya Nagar, Vaishali Nagar, and more
- **Surat**: Adajan, Vesu, Althan, Piplod, Citylight, and more
- **Lucknow**: Hazratganj, Gomti Nagar, Indira Nagar, Aliganj, and more
- **Kanpur**: Civil Lines, Mall Road, Swaroop Nagar, Kidwai Nagar, and more

## 🍽️ Supported Cuisines

Indian, Chinese, Italian, South Indian, Continental, Punjabi, Bengali, Rajasthani, Gujarati, Thai, Mexican

## 🎨 Design System

### Color Palette
- **Primary Background**: #231F20 (Dark charcoal)
- **Accent Green**: #157A6E (Teal)
- **Accent Red**: #BB4430 (Rust red)
- **Text/Highlight**: #F3DFA2 (Cream)
- **Secondary**: #2A2627 (Dark gray)

### Typography
- Clean, readable fonts with proper hierarchy
- Responsive text sizes for all devices
- Arabic-inspired branding elements

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/daawat-diner.git
cd daawat-diner
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📱 Mobile Experience

- **Native Input**: Uses device keyboard for number inputs on mobile
- **Touch Optimized**: All buttons and interactions are touch-friendly
- **Responsive Layout**: Adapts perfectly to all screen sizes
- **Fast Performance**: Optimized for mobile networks

## 🔧 API Integration

- **Geoapify API**: For accurate restaurant data and location services
- **Google Maps**: For navigation and directions
- **Efficient Caching**: 10-minute cache for optimal performance
- **Fallback System**: Accurate sample data when API is unavailable

## 🎯 Key Algorithms

### Restaurant Search
- Precise geocoding for exact area targeting
- Multi-strategy cuisine filtering
- Duplicate prevention across sessions
- Smart fallback with real restaurant data

### Star & Refresh System
- Global tracking of shown restaurants
- Preserves starred restaurants during refresh
- Non-repetitive results across searches
- Satirical messages when options exhausted

## 🤝 Contributing

We welcome contributions to دعوت Diner! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure responsive design for all screen sizes

## 📄 Project Structure

```
src/
├── components/          # React components
│   ├── NumberKeypad.tsx    # Custom number input keypad
│   ├── RestaurantCard.tsx  # Individual restaurant display
│   ├── RestaurantForm.tsx  # Main search form
│   └── RestaurantResults.tsx # Results display
├── data/               # Static data
│   └── locations.ts       # City-area mapping
├── services/           # API and business logic
│   └── restaurantService.ts # Restaurant search logic
├── types/              # TypeScript definitions
│   └── index.ts          # Type definitions
├── App.tsx             # Main application
└── main.tsx           # Application entry point
```

## 🐛 Troubleshooting

### Common Issues
- **No restaurants found**: Try different cuisine combinations or areas
- **Location not found**: Verify city-area combination exists in supported list
- **Mobile keypad issues**: The app uses native keyboard on mobile devices

### Support
- Check browser console for error messages
- Ensure JavaScript is enabled
- Clear browser cache if experiencing issues

## 🔮 Future Enhancements

- User authentication and saved preferences
- Restaurant reviews and photos integration
- Real-time availability checking
- Advanced filtering options (price range, ratings, distance)
- Social sharing features
- Offline mode support
- Push notifications for deals and offers

## 📊 Performance

- **Fast Loading**: Optimized bundle size with code splitting
- **Efficient API Usage**: Smart caching and request optimization
- **Mobile Optimized**: Touch-friendly interface with fast interactions
- **SEO Ready**: Proper meta tags and semantic HTML

---

**Made by Laasya** ❤️

*Bringing India's diverse culinary landscape to your fingertips with دعوت Diner*