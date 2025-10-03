// This file is a complete, single-file React application that connects to the 
// Python Flask backend running on http://127.0.0.1:5000.
import Footer from './ui/weather/Footer';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { format } from 'date-fns';
import {
  Thermometer,
  Snowflake,
  CloudRain,
  Wind,
  AlertTriangle,
  CloudLightning,
  Cloud,
} from 'lucide-react';

// NOTE: All external components imported in the original code (Header, Controls, etc.) 
// are stubbed here for single-file runnability and clarity.
// The primary change is replacing the external API calls with a single call to the Flask backend.

// --- STUB COMPONENTS (for single-file runnability) ---

const Card = ({ children, title, className = '' }) => (
  <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-4 md:p-6 ${className}`}>
    {title && <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">{title}</h3>}
    {children}
  </div>
);

const Header = () => (
    <Card className="mb-6" title={null}>
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Will it Rain on my Parade ?
            </h1>
            <p className="text-sm text-white/60 hidden sm:block">
                 ({new Date().toLocaleTimeString()})
            </p>
        </div>
    </Card>
);

const Controls = ({
    location,
    setLocation,
    selectedDate,
    setSelectedDate,
    handleSearch,
    popularLocations,
    searchInputRef,
    isLoading,
    viewMode,
    setViewMode,
    mapStyle,
    setMapStyle,
}) => (
  <Card title="Location & Controls" className="mb-6">
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative flex-grow">
        <input
          ref={searchInputRef}
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (e.g., London, UK)"
          className="w-full bg-white/10 border border-white/20 text-white rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
        />
        <button 
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="absolute right-0 top-0 h-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-r-lg transition duration-150 disabled:bg-gray-500"
        >
            Search
        </button>
      </div>

      {/* Date Picker and View Mode */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
            type="date"
            value={format(selectedDate || new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-full sm:w-1/2 bg-white/10 border border-white/20 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
        />
        <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'current' | 'forecast')}
            className="w-full sm:w-1/2 bg-white/10 border border-white/20 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
        >
            <option value="current">Daily Likelihood</option>
            <option value="forecast">7-Day Forecast</option>
        </select>
      </div>

    </div>
  </Card>
);

const WeatherGrid = ({ weatherData, selectedMetric, selectedDate }) => (
    <Card title={`Current Likelihood Metrics for ${format(selectedDate, 'PPP')}`} className="min-h-96">
        {weatherData.length === 0 ? (
             <p className="text-white/60 text-center py-10">Search for a location to view data.</p>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {weatherData.map((item, index) => (
                <div 
                    key={index} 
                    className={`p-4 rounded-lg transition duration-300 ${
                        item.severity === 'high' ? 'bg-red-900/40 border-red-500/50' :
                        item.severity === 'medium' ? 'bg-yellow-900/40 border-yellow-500/50' :
                        'bg-blue-900/40 border-blue-500/50'
                    } border`}
                >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80">{item.condition}</span>
                    <span className="text-xl text-white">{item.icon}</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                    {item.probability}%
                </div>
                <p className="text-xs font-semibold text-white/50 mb-2">
                    Severity: <span className="uppercase">{item.severity}</span>
                </p>
                <p className="text-xs text-white/70">
                    {item.description}
                    {item.actualValue !== undefined && ` (${item.actualValue}${item.unit})`}
                </p>
            </div>
            ))}
        </div>
        )}
    </Card>
);

const ForecastCards = ({ forecastData }) => (
    <Card title="7-Day Forecast" className="min-h-96">
        <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 p-2">
            {forecastData.map((day, index) => (
                <div
                    key={index}
                    className="flex-shrink-0 w-48 bg-gray-900/40 border border-gray-700/50 rounded-xl p-4 text-center hover:bg-gray-800/50 transition duration-300 transform hover:scale-[1.02]"
                >
                    <p className="text-sm font-semibold text-purple-400 mb-2">
                        {index === 0 ? 'Today' : format(day.date, 'EEE, MMM d')}
                    </p>
                    <div className="text-4xl mb-2">
                        {day.condition === 'Hot' ? '☀️' : day.condition === 'Cold' ? '❄️' : day.condition === 'Rainy' ? '🌧️' : '🌤️'}
                    </div>
                    <p className="text-xl font-bold text-white">
                        {day.maxTemp}°C / {day.minTemp}°C
                    </p>
                    <div className='mt-2 space-y-1 text-sm text-white/70'>
                        <p className="flex items-center justify-center"><CloudRain className='w-4 h-4 mr-1 text-blue-400'/> {day.precipitation} mm</p>
                        <p className="flex items-center justify-center"><Wind className='w-4 h-4 mr-1 text-gray-400'/> {day.windSpeed} km/h</p>
                    </div>
                </div>
            ))}
            </div>
        </div>
    </Card>
);

// --- INTERFACES ---

interface WeatherData {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  icon: JSX.Element;
  description: string;
  actualValue?: number;
  unit?: string;
}

interface ForecastDay {
  date: Date;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
}

// --- MAIN APPLICATION LOGIC ---

const WeatherDashboard = () => {
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [viewMode, setViewMode] = useState<'current' | 'forecast'>('current');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Stubs for controls not used in this core logic
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'dark'>('dark');
  const [selectedMetric, setSelectedMetric] = useState('all');

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Set initial location to a default city if no coords are available
    if (!coords && !location) {
        setLocation('');
        // Simulate a search on load for a smooth start (will trigger a fetch)
        // Note: We avoid calling handleSearch directly in useEffect to prevent infinite loops,
        // but a successful search should always set initial coords.
    }
  }, []);

  useEffect(() => {
    // Only fetch data if we have coordinates and a date
    if (coords && selectedDate) {
      fetchDataFromBackend(coords.lat, coords.lon, selectedDate);
    }
  }, [coords, selectedDate, viewMode]);
  
  // --- CORE UTILITY FUNCTIONS (Kept from original file) ---
  
  const calculateProbability = (
    value: number,
    thresholds: { min: number; max: number },
    baseProb: number = 10,
    maxProb: number = 95,
    higherValuesGiveHigherProb: boolean = true
  ): number => {
    if (value === null || isNaN(value) || value === undefined) return baseProb;
    if (higherValuesGiveHigherProb) {
      if (value <= thresholds.min) return baseProb;
      if (value >= thresholds.max) return maxProb;
      const probability =
        baseProb +
        ((value - thresholds.min) / (thresholds.max - thresholds.min)) * (maxProb - baseProb);
      return Math.round(probability);
    } else {
      if (value <= thresholds.min) return maxProb;
      if (value >= thresholds.max) return baseProb;
      const probability =
        maxProb -
        ((value - thresholds.min) / (thresholds.max - thresholds.min)) * (maxProb - baseProb);
      return Math.round(probability);
    }
  };

  const getSeverity = (probability: number): 'low' | 'medium' | 'high' => {
    if (probability >= 70) return 'high';
    if (probability >= 40) return 'medium';
    return 'low';
  };

  const getWeatherIcon = (condition: string): JSX.Element => {
    switch (condition) {
      case 'Sunny':
        return <Thermometer className="w-5 h-5 text-red-400" />;
      case 'Cold':
        return <Snowflake className="w-5 h-5 text-blue-400" />;
      case 'Rainy': // Was Humidity in original file, renamed for clarity
        return <CloudRain className="w-5 h-5 text-blue-300" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-gray-400" />;
      case 'Uncomfortable':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'Storm': // Was Rainy/Lightning in original file, adjusted
        return <CloudLightning className="w-5 h-5 text-purple-400" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  // --- NEW: UNIFIED DATA FETCHING FUNCTION ---

  const fetchDataFromBackend = useCallback(async (lat: number, lon: number, date: Date) => {
    setIsLoading(true);
    setWeatherData([]);
    setForecastData([]);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // The 'R' (Read) operation in CRUD, calling your Flask server
    const API_URL = `http://127.0.0.1:5000/api/weather?lat=${lat}&lon=${lon}&date=${formattedDate}`;

    try {
        const response = await fetch(API_URL, { mode: 'cors' });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}. Is Flask running?`);
        }
        const data = await response.json();
        
        if (data.error) {
            toast.error(`Backend Error: ${data.details}`);
            return;
        }

        // 1. Process Daily Data (from the 'daily_data' key)
        const rawDaily = data.daily_data;
        const maxTemp = rawDaily.max_temp;
        const minTemp = rawDaily.min_temp;
        const rain = rawDaily.rain;
        const wind = rawDaily.wind;

        // Re-use the complex probability logic from the original frontend file
        const hotProb = calculateProbability(maxTemp, { min: 25, max: 40 }, 10, 95, true);
        const coldProb = calculateProbability(minTemp, { min: -5, max: 10 }, 10, 95, false);
        const wetProb = calculateProbability(rain, { min: 1, max: 25 }, 10, 95, true);
        const windyProb = calculateProbability(wind, { min: 20, max: 60 }, 10, 95, true);
        const stormProb = calculateProbability(rain * wind, { min: 50, max: 500 }, 5, 80, true);
        const uncomfortableProb = Math.min(
            99,
            Math.round((hotProb + wetProb) * 0.6 + (windyProb > 70 ? 10 : 0))
        );

        const processedWeather: WeatherData[] = [
            {
                condition: 'Sunny',
                probability: hotProb,
                severity: getSeverity(hotProb),
                icon: getWeatherIcon('Sunny'),
                description: `Max temperature: ${maxTemp}°C`,
                actualValue: maxTemp,
                unit: '°C',
            },
            {
                condition: 'Cold',
                probability: coldProb,
                severity: getSeverity(coldProb),
                icon: getWeatherIcon('Cold'),
                description: `Min temperature: ${minTemp}°C`,
                actualValue: minTemp,
                unit: '°C',
            },
            {
                condition: 'Rainy',
                probability: wetProb,
                severity: getSeverity(wetProb),
                icon: getWeatherIcon('Rainy'),
                description: `Precipitation: ${rain}mm`,
                actualValue: rain,
                unit: 'mm',
            },
            {
                condition: 'Wind',
                probability: windyProb,
                severity: getSeverity(windyProb),
                icon: getWeatherIcon('Wind'),
                description: `Wind speed: ${wind} km/h`,
                actualValue: wind,
                unit: 'km/h',
            },
            {
                condition: 'Storm',
                probability: stormProb,
                severity: getSeverity(stormProb),
                icon: getWeatherIcon('Storm'),
                description: `Combined rain and wind factor`,
                actualValue: (rain * wind) / 10,
            },
            {
                condition: 'Uncomfortable',
                probability: uncomfortableProb,
                severity: getSeverity(uncomfortableProb),
                icon: getWeatherIcon('Uncomfortable'),
                description: 'Combined discomfort index',
            },
        ];
        setWeatherData(processedWeather);

        // 2. Process Forecast Data (from the 'forecast' key)
        const forecastDays: ForecastDay[] = data.forecast.map((day: any) => ({
             // Ensure 'date' is converted back to a Date object for the forecast card component
            date: new Date(day.date), 
            maxTemp: day.maxTemp,
            minTemp: day.minTemp,
            precipitation: day.precipitation,
            windSpeed: day.windSpeed,
            condition: day.condition,
        }));
        setForecastData(forecastDays);
        
        // 3. Update location display
        setLocation(data.city);
        
        toast.success(`Data loaded from Flask for ${data.city} on ${format(date, 'PPP')}`);

    } catch (error) {
        console.error("Error fetching data from Flask backend:", error);
        toast.error('Failed to connect to Flask API. Ensure the Python app is running and accessible.');
    } finally {
        setIsLoading(false);
    }
  }, []);

  // --- LOCATION SEARCH (Still uses external API for geocoding) ---
  
  const handleSearch = async (searchLocation?: string) => {
    const searchTerm = searchLocation || location;
    if (!searchTerm) {
      toast.info('Please enter a location to search.');
      return;
    }
    setIsLoading(true);
    try {
      // Use Nominatim to get coordinates (This part remains necessary and external)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newCoords = { lat: parseFloat(lat), lon: parseFloat(lon) };
        setCoords(newCoords);
        setLocation(display_name);
        toast.success(`Location found: ${display_name}`);
        // The useEffect hook will now trigger fetchDataFromBackend with the new coords.
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching location coordinates');
    } finally {
      // We keep isLoading true until the weather data fetch completes in useEffect,
      // but we need to ensure it's reset if the geocoding fails.
      // If successful, the weather fetch will handle the final setIsLoading(false)
      if (!coords) setIsLoading(false);
    }
  };

  // --- MAIN RENDER ---
  
  return (
    <div
      className="min-h-screen bg-background relative overflow-hidden font-inter"
      style={{
        backgroundImage: 'linear-gradient(135deg, #2b395b 0%, #1a233b 100%)', // Simplified background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <Header />
        
        {/* Simplified Controls */}
        <Controls
          location={location}
          setLocation={setLocation}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleSearch={handleSearch}
          popularLocations={[]} // Stubbed
          searchInputRef={searchInputRef}
          isLoading={isLoading}
          viewMode={viewMode}
          setViewMode={setViewMode}
          mapStyle={mapStyle} // Stubbed
          setMapStyle={setMapStyle} // Stubbed
        />
        
        {/* Loading Indicator */}
        {isLoading && (
          <Card title="Loading..." className="text-center text-white/70 py-10">
            <svg className="animate-spin h-8 w-8 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Fetching data from Flask backend for {location}...
          </Card>
        )}

        {/* Display Content */}
        {!isLoading && coords && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">
                Weather Likelihood Analysis for {location}
            </h2>
            
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-4 space-y-6">
                    {/* Current Likelihood Grid */}
                    {viewMode === 'current' && (
                        <WeatherGrid
                            weatherData={weatherData}
                            selectedMetric={selectedMetric}
                            selectedDate={selectedDate}
                        />
                    )}

                    {/* 7-Day Forecast Cards */}
                    {viewMode === 'forecast' && forecastData.length > 0 && (
                        <ForecastCards forecastData={forecastData.map(d => ({ ...d, date: new Date(d.date) }))} />
                    )}
                </div>
            </div>
            
            {/* Console Log Message */}
            <Card title="Connect with us !" className="text-center text-white/70 py-6">
                <Footer />
            </Card>

          </div>
        )}
        
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default WeatherDashboard;
