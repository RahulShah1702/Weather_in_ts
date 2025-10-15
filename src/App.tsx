import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, MapPin, Search, Clock, Star, Trash2, Calendar, CloudSnow, CloudDrizzle } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  feelsLike: number;
  latitude: number;
  longitude: number;
}

interface ForecastDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  weatherCode: number;
}

interface SavedLocation {
  name: string;
  latitude: number;
  longitude: number;
}

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [showSaved, setShowSaved] = useState<boolean>(false);
  const [gettingLocation, setGettingLocation] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const saved = [
      { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
      { name: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
      { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946 }
    ];
    setSavedLocations(saved);
  }, []);

  const fetchWeather = async (lat: number, lon: number, locationName?: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Failed to fetch weather data');
      
      const data = await response.json();
      const current = data.current;
      
      const condition = getWeatherCondition(current.weather_code);
      
      setWeather({
        location: locationName || 'Current Location',
        temperature: Math.round(current.temperature_2m),
        condition,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        visibility: 10,
        pressure: Math.round(current.surface_pressure),
        feelsLike: Math.round(current.apparent_temperature),
        latitude: lat,
        longitude: lon
      });

      // Process 7-day forecast
      const forecastData: ForecastDay[] = data.daily.time.slice(1, 8).map((date: string, idx: number) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        maxTemp: Math.round(data.daily.temperature_2m_max[idx + 1]),
        minTemp: Math.round(data.daily.temperature_2m_min[idx + 1]),
        condition: getWeatherCondition(data.daily.weather_code[idx + 1]),
        weatherCode: data.daily.weather_code[idx + 1]
      }));
      
      setForecast(forecastData);
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setError('Unable to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude, 'Your Location');
        setGettingLocation(false);
      },
      (error) => {
        setError('Unable to get your location. Please enable location services.');
        setGettingLocation(false);
        fetchWeather(19.0760, 72.8777, 'Mumbai');
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSearch = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      
      if (!response.ok) throw new Error('Failed to search location');
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        setError('City not found. Please try another name.');
        setLoading(false);
        return;
      }
      
      const result = data.results[0];
      await fetchWeather(result.latitude, result.longitude, result.name);
    } catch (err) {
      setError('Unable to search for city. Please try again.');
      setLoading(false);
    }
  };

  const addToSaved = () => {
    if (!weather) return;
    
    const exists = savedLocations.some(loc => 
      loc.latitude === weather.latitude && loc.longitude === weather.longitude
    );
    
    if (exists) {
      setError('Location already saved!');
      setTimeout(() => setError(''), 2000);
      return;
    }
    
    const newLocation: SavedLocation = {
      name: weather.location,
      latitude: weather.latitude,
      longitude: weather.longitude
    };
    
    setSavedLocations([...savedLocations, newLocation]);
  };

  const removeFromSaved = (index: number) => {
    setSavedLocations(savedLocations.filter((_, i) => i !== index));
  };

  const loadSavedLocation = (location: SavedLocation) => {
    fetchWeather(location.latitude, location.longitude, location.name);
    setShowSaved(false);
  };

  const getWeatherIcon = (condition: string, size: string = 'w-24 h-24') => {
    const lower = condition.toLowerCase();
    if (lower.includes('snow')) return <CloudSnow className={`${size} animate-pulse`} />;
    if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className={`${size} animate-pulse`} />;
    if (lower.includes('thunder')) return <CloudRain className={`${size} animate-pulse`} />;
    if (lower.includes('cloud') || lower.includes('fog')) return <Cloud className={size} />;
    return <Sun className={size} style={{ animation: 'spin 20s linear infinite' }} />;
  };

  const getForecastIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8" />;
    if (code <= 3) return <Cloud className="w-8 h-8" />;
    if (code <= 48) return <Cloud className="w-8 h-8 opacity-70" />;
    if (code <= 67) return <CloudRain className="w-8 h-8" />;
    if (code <= 77) return <CloudSnow className="w-8 h-8" />;
    if (code <= 99) return <CloudRain className="w-8 h-8" />;
    return <Cloud className="w-8 h-8" />;
  };

  const getBackgroundGradient = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('thunder')) return 'from-gray-600 via-gray-700 to-gray-800';
    if (lower.includes('cloud')) return 'from-blue-400 via-blue-500 to-blue-600';
    if (lower.includes('snow')) return 'from-blue-300 via-blue-400 to-blue-500';
    return 'from-orange-400 via-amber-500 to-yellow-500';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${weather ? getBackgroundGradient(weather.condition) : 'from-blue-400 via-blue-500 to-blue-600'} p-4 flex items-center justify-center transition-all duration-1000`}>
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-white">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Weather Dashboard</h1>
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition backdrop-blur-sm"
              title="Saved Locations"
            >
              <Star className={`w-6 h-6 ${showSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          {showSaved && (
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Saved Locations
              </h3>
              <div className="space-y-2">
                {savedLocations.length === 0 ? (
                  <p className="text-sm opacity-75">No saved locations yet</p>
                ) : (
                  savedLocations.map((loc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                      <button
                        onClick={() => loadSavedLocation(loc)}
                        className="flex-1 text-left"
                      >
                        {loc.name}
                      </button>
                      <button
                        onClick={() => removeFromSaved(idx)}
                        className="p-1 hover:bg-red-500/30 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex gap-3 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-70" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for a city..."
                  className="w-full pl-12 pr-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-white/30 hover:bg-white/40 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                {loading ? '...' : 'Search'}
              </button>
            </div>
            
            <button
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="w-full py-2 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl transition disabled:opacity-50 backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4" />
              {gettingLocation ? 'Getting location...' : 'Use My Location'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/30 backdrop-blur-sm rounded-xl text-center animate-pulse">
              {error}
            </div>
          )}

          {weather && !loading && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold">{weather.location}</h2>
                  <button
                    onClick={addToSaved}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                    title="Save Location"
                  >
                    <Star className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm opacity-75 mb-4">
                  <Clock className="w-4 h-4" />
                  Updated at {lastUpdated}
                </div>
                <div className="flex justify-center mb-4">
                  {getWeatherIcon(weather.condition)}
                </div>
                <div className="text-7xl font-bold mb-2 hover:scale-110 transition-transform cursor-default">
                  {weather.temperature}°C
                </div>
                <div className="text-2xl opacity-90 mb-2">{weather.condition}</div>
                <div className="text-lg opacity-75">Feels like {weather.feelsLike}°C</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer">
                  <Droplets className="w-8 h-8 opacity-80" />
                  <div>
                    <div className="text-sm opacity-75">Humidity</div>
                    <div className="text-2xl font-semibold">{weather.humidity}%</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer">
                  <Wind className="w-8 h-8 opacity-80" />
                  <div>
                    <div className="text-sm opacity-75">Wind Speed</div>
                    <div className="text-2xl font-semibold">{weather.windSpeed} km/h</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer">
                  <Eye className="w-8 h-8 opacity-80" />
                  <div>
                    <div className="text-sm opacity-75">Visibility</div>
                    <div className="text-2xl font-semibold">{weather.visibility} km</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer">
                  <Gauge className="w-8 h-8 opacity-80" />
                  <div>
                    <div className="text-sm opacity-75">Pressure</div>
                    <div className="text-2xl font-semibold">{weather.pressure} hPa</div>
                  </div>
                </div>
              </div>

              {/* 7-Day Forecast */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  7-Day Forecast
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {forecast.map((day, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer"
                    >
                      <div className="text-center">
                        <div className="font-bold text-lg">{day.dayName}</div>
                        <div className="text-sm opacity-75 mb-3">{day.date}</div>
                        <div className="flex justify-center mb-3">
                          {getForecastIcon(day.weatherCode)}
                        </div>
                        <div className="text-sm opacity-90 mb-2">{day.condition}</div>
                        <div className="flex justify-center gap-3 text-lg">
                          <span className="font-semibold">{day.maxTemp}°</span>
                          <span className="opacity-60">{day.minTemp}°</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => fetchWeather(weather.latitude, weather.longitude, weather.location)}
                className="w-full py-3 mt-4 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition backdrop-blur-sm"
              >
                Refresh Weather
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
