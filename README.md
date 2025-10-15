🌤️ Weather Dashboard
A modern, feature-rich weather application built with React and TypeScript that provides real-time weather information and 7-day forecasts with a beautiful, responsive interface.

<img width="626" height="882" alt="Screenshot 2025-10-16 013454" src="https://github.com/user-attachments/assets/ea2dfb12-7fc9-4b8a-b579-62e28ea1f4e9" />
<img width="1216" height="595" alt="image" src="https://github.com/user-attachments/assets/25281056-b15c-4b26-a16f-d31f1770d4b0" />

✨ Features
🎯 Core Functionality

Real-time Weather Data - Fetches live weather information from Open-Meteo API
7-Day Weather Forecast - View detailed weather predictions for the next week
Auto-Geolocation - Automatically detects and displays weather for your current location
City Search - Search for weather in any city worldwide with geocoding support
Saved Locations - Save and quickly access your favorite locations
Responsive Design - Works seamlessly on desktop, tablet, and mobile devices

🎨 Interactive UI/UX

Dynamic Backgrounds - Background colors change based on weather conditions (sunny, rainy, cloudy, snowy)
Animated Icons - Weather icons with smooth animations (spinning sun, pulsing rain/snow)
Hover Effects - Interactive cards with scale and color transitions
Real-time Updates - Last updated timestamp with manual refresh option
Smooth Transitions - Fluid animations between weather states
Temperature Scaling - Temperature display scales on hover for visual feedback

📊 Weather Information
Current Weather

Current temperature with "feels like" reading
Weather condition descriptions
Humidity percentage
Wind speed (km/h)
Atmospheric pressure (hPa)
Visibility range (km)

7-Day Forecast

Daily maximum and minimum temperatures
Weather conditions for each day
Day names and dates
Condition-specific weather icons
Responsive grid layout

🚀 Getting Started
Prerequisites

Node.js (v14 or higher)
npm or yarn package manager
Modern web browser with geolocation support

Installation

Clone the repository
```
bashgit clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

Install dependencies

```
bashnpm install
# or
yarn install

```

Start the development server

```
bashnpm start
# or
yarn start

```

Open http://localhost:3000 in your browser

🛠️ Built With

React 18.x - Frontend framework with hooks
TypeScript 5.x - Type-safe JavaScript
Tailwind CSS 3.x - Utility-first CSS framework
Lucide React - Beautiful, customizable icon library
Open-Meteo API - Free weather data provider (no API key required)
Geocoding API - Location search and coordinate conversion

📦 Project Structure

weather-dashboard/
├── src/
│   ├── components/
│   │   └── WeatherApp.tsx       # Main weather component
│   ├── types/
│   │   └── weather.ts           # TypeScript interfaces
│   │       ├── WeatherData
│   │       ├── ForecastDay
│   │       └── SavedLocation
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── public/
│   ├── index.html
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md

🎯 Usage
Search for a City

Type the city name in the search bar (e.g., "London", "Tokyo", "New York")
Press Enter or click the Search button
View detailed current weather and 7-day forecast

Use Current Location

Click the "Use My Location" button
Allow location access when prompted by your browser
Your current location weather will be displayed automatically

Save Favorite Locations

After viewing a location's weather, click the star icon next to the location name
Access saved locations by clicking the star button in the header
Quickly switch between saved locations with one click
Remove saved locations using the trash icon

View 7-Day Forecast

Scroll down to see the detailed 7-day forecast
Each card shows:

Day of the week
Date
Weather condition icon
Condition description
High and low temperatures


Hover over cards for interactive effects

Refresh Weather Data

Click the "Refresh Weather" button to get the latest data
The last updated time is displayed below the location name
Forecast updates automatically with current weather

🔑 API Reference
This project uses the following free APIs (no API key required):
Open-Meteo Weather API

Endpoint: https://api.open-meteo.com/v1/forecast
Parameters:

latitude, longitude - Location coordinates
current - Current weather variables (temperature, humidity, wind, etc.)
daily - Daily forecast variables (max/min temp, weather code)
timezone - Auto timezone detection


Documentation: Open-Meteo Docs

Geocoding API

Endpoint: https://geocoding-api.open-meteo.com/v1/search
Parameters:

name - City name to search
count - Number of results
language - Response language


Documentation: Geocoding Docs

Change Weather Icons
Edit the getWeatherIcon or getForecastIcon functions in WeatherApp.tsx:
```
const getWeatherIcon = (condition: string, size: string = 'w-24 h-24') => {
  // Add your custom icon logic here
  // Available icons: Sun, Cloud, CloudRain, CloudSnow, etc.
};
```

Modify Background Colors
Update the getBackgroundGradient function:
```
const getBackgroundGradient = (condition: string) => {
  // Customize gradient colors based on weather
  // Example: 'from-purple-400 via-pink-500 to-red-500'
};
```

Add More Weather Details

Extend the API call to include additional parameters from Open-Meteo API
Update the WeatherData interface
Add new display cards in the grid layout

Customize Forecast Display
```
// Change number of forecast days (max 16 days available from API)
const forecastData = data.daily.time.slice(1, 8) // Shows 7 days
// Change to .slice(1, 11) for 10 days
```

🔒 Privacy & Security

✅ No user data is collected or stored on external servers
✅ Location data is only used for weather lookup
✅ Saved locations are stored in browser memory (session-based)
✅ No authentication or personal information required
✅ All API calls are made directly to public endpoints
✅ No cookies or tracking

🚧 Future Enhancements

 7-day weather forecast ✅ IMPLEMENTED
 Hourly weather breakdown (24-hour forecast)
 Weather alerts and notifications
 Unit conversion (Celsius/Fahrenheit, km/h to mph)
 Multiple language support (i18n)
 Dark/Light theme toggle
 Weather maps integration
 Historical weather data charts
 Air quality index (AQI)
 UV index display
 Sunrise/sunset times
 Moon phases
 Precipitation probability
 Wind direction compass
 Weather widgets for embedding
