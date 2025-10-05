import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import spaceBackground from '@/assets/space-background.jpg';
import Header from '@/components/ui/weather/Header';
import Controls from '@/components/ui/weather/Controls';
import LocationMap from '@/components/ui/weather/LocationMap';
import DominantCondition from '@/components/ui/weather/DominantCondition';
import DataExport from '@/components/ui/weather/DataExport';
import WeatherGrid from '@/components/ui/weather/WeatherGrid';
import DataCharts from '@/components/ui/weather/DataCharts';
import ForecastCards from '@/components/ui/weather/ForecastCards';
import Chatbot from '@/components/ui/weather/Chatbot';
import Footer from '@/components/ui/weather/Footer';
import WeatherAlerts from '@/components/ui/weather/WeatherAlerts';
import WeatherRadar from '@/components/ui/weather/WeatherRadar';
import AdvancedAnalytics from '@/components/ui/weather/AdvancedAnalytics';
import WeatherStatistics from '@/components/ui/weather/WeatherStatistics';
import WeatherComparison from '@/components/ui/weather/WeatherComparison';
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

const popularLocations = [
  { name: 'New York, USA', coords: { lat: 40.7128, lon: -74.006 } },
  { name: 'London, UK', coords: { lat: 51.5074, lon: -0.1278 } },
  { name: 'Tokyo, Japan', coords: { lat: 35.6762, lon: 139.6503 } },
  { name: 'Sydney, Australia', coords: { lat: -33.8688, lon: 151.2093 } },
];

const WeatherDashboard = () => {
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [viewMode, setViewMode] = useState<'current' | 'forecast'>('current');
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'dark'>('dark');
  const [advancedMetrics, setAdvancedMetrics] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [historicalData, setHistoricalData] = useState<WeatherData[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<string[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (coords && selectedDate) {
      fetchWeather(coords.lat, coords.lon, selectedDate);
      if (viewMode === 'forecast') {
        fetchForecast(coords.lat, coords.lon);
      }
    }
  }, [coords, selectedDate, viewMode]);

  const handleSearch = async (searchLocation?: string) => {
    const searchTerm = searchLocation || location;
    if (!searchTerm) {
      toast.info('Please enter a location to search.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
        setLocation(display_name);
        toast.success(`Location found: ${display_name}`);
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching location');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProbability = (
    value: number,
    thresholds: { min: number; max: number },
    baseProb: number = 10,
    maxProb: number = 95,
    higherValuesGiveHigherProb: boolean = true
  ): number => {
    if (value === null || isNaN(value)) return baseProb;
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
      case 'Humidity':
        return <CloudRain className="w-5 h-5 text-blue-300" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-gray-400" />;
      case 'Uncomfortable':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'Rainy':
        return <CloudLightning className="w-5 h-5 text-purple-400" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  const fetchWeather = async (lat: number, lon: number, date: Date) => {
    setIsLoading(true);
    setWeatherData([]);
    const formattedDate = format(date, 'yyyy-MM-dd');

    const apiEndpoint = 'https://api.open-meteo.com/v1/forecast';
    const historicalEndpoint = 'https://archive-api.open-meteo.com/v1/archive';
    const isHistorical = date < new Date(new Date().setDate(new Date().getDate() - 5));
    const endpoint = isHistorical ? historicalEndpoint : apiEndpoint;

    try {
      const response = await fetch(
        `${endpoint}?latitude=${lat}&longitude=${lon}&start_date=${formattedDate}&end_date=${formattedDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`
      );
      const data = await response.json();

      if (data.error) {
        toast.error(data.reason);
        return;
      }

      const maxTemp = data.daily.temperature_2m_max[0];
      const minTemp = data.daily.temperature_2m_min[0];
      const rain = data.daily.precipitation_sum[0];
      const wind = data.daily.windspeed_10m_max[0];

      const hotProb = calculateProbability(maxTemp, { min: 25, max: 40 }, 10, 95, true);
      const coldProb = calculateProbability(minTemp, { min: -5, max: 10 }, 10, 95, false);
      const wetProb = calculateProbability(rain, { min: 1, max: 25 }, 10, 95, true);
      const windyProb = calculateProbability(wind, { min: 20, max: 60 }, 10, 95, true);
      const stormProb = calculateProbability(rain * wind, { min: 50, max: 500 }, 5, 80, true);
      const uncomfortableProb = Math.min(
        99,
        Math.round((hotProb + wetProb) * 0.6 + (windyProb > 70 ? 10 : 0))
      );

      const processed: WeatherData[] = [
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
          condition: 'Cloudy',
          probability: stormProb,
          severity: getSeverity(stormProb),
          icon: getWeatherIcon('Cloudy'),
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
      setWeatherData(processed);
      toast.success(`Weather data loaded for ${format(date, 'PPP')}`);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecast = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto&forecast_days=7`
      );
      const data = await response.json();

      if (data.error) {
        toast.error(data.reason);
        return;
      }

      const forecastDays: ForecastDay[] = data.daily.time.map((date: string, index: number) => ({
        date: new Date(date),
        maxTemp: data.daily.temperature_2m_max[index],
        minTemp: data.daily.temperature_2m_min[index],
        precipitation: data.daily.precipitation_sum[index],
        windSpeed: data.daily.windspeed_10m_max[index],
        condition:
          data.daily.temperature_2m_max[index] > 25
            ? 'Hot'
            : data.daily.temperature_2m_min[index] < 5
            ? 'Cold'
            : data.daily.precipitation_sum[index] > 5
            ? 'Rainy'
            : 'Clear',
      }));

      setForecastData(forecastDays);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching forecast data');
    }
  };

  const downloadData = (fileFormat: 'csv' | 'json') => {
    if (weatherData.length === 0) {
      toast.error('No data to download');
      return;
    }
    const data = weatherData.map((item) => ({
      location: location || 'Unknown Location',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
      condition: item.condition,
      probability: item.probability,
      severity: item.severity,
      actualValue: item.actualValue,
      unit: item.unit,
    }));
    if (fileFormat === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'weather-likelihood-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csv = [
        'Location,Date,Condition,Probability,Severity,ActualValue,Unit',
        ...data.map(
          (row) =>
            `"${row.location.replace(/"/g, '""')}",${row.date},${row.condition},${
              row.probability
            }%,${row.severity},${row.actualValue || ''},${row.unit || ''}`
        ),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'weather-likelihood-data.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
    toast.success(`Downloaded weather data as ${fileFormat.toUpperCase()}`);
  };

  const chartData = weatherData.map((item) => ({
    name: item.condition.replace('Very ', ''),
    probability: item.probability,
    fill: getProbabilityColor(item.probability),
    actualValue: item.actualValue,
  }));

  const forecastChartData = forecastData.map((day) => ({
    date: format(day.date, 'MMM dd'),
    maxTemp: day.maxTemp,
    minTemp: day.minTemp,
    precipitation: day.precipitation,
    windSpeed: day.windSpeed,
  }));

  function getProbabilityColor(probability: number): string {
    if (probability >= 70) return 'hsl(0, 100%, 65%)';
    if (probability >= 50) return 'hsl(30, 100%, 65%)';
    if (probability >= 30) return 'hsl(200, 100%, 65%)';
    return 'hsl(160, 100%, 65%)';
  }

  return (
    <div
      className="min-h-screen bg-background relative overflow-hidden"
      style={{
        backgroundImage: `url(${spaceBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <Header />
        <Controls
          location={location}
          setLocation={setLocation}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleSearch={handleSearch}
          popularLocations={popularLocations}
          searchInputRef={searchInputRef}
          isLoading={isLoading}
          viewMode={viewMode}
          setViewMode={setViewMode}
          advancedMetrics={advancedMetrics}
          setAdvancedMetrics={setAdvancedMetrics}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
        />
        {/* Weather Alerts Banner */}
        {weatherData.length > 0 && (
          <div className="mb-6">
            <WeatherAlerts weatherData={weatherData} location={location} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <LocationMap coords={coords} location={location} mapStyle={mapStyle} />
            <DominantCondition weatherData={weatherData} />
            <WeatherRadar location={location} coords={coords} />
            <DataExport
              weatherData={weatherData}
              location={location}
              selectedDate={selectedDate}
              downloadData={downloadData}
            />
          </div>
          <div className="xl:col-span-3 space-y-6">
            <WeatherGrid
              weatherData={weatherData}
              selectedMetric={selectedMetric}
              selectedDate={selectedDate}
            />
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
              <DataCharts
                chartData={chartData}
                forecastChartData={forecastChartData}
                viewMode={viewMode}
              />
              <AdvancedAnalytics
                weatherData={weatherData}
                location={location}
                selectedDate={selectedDate}
              />
            </div>
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
              <WeatherStatistics
                weatherData={weatherData}
                location={location}
                selectedDate={selectedDate}
              />
              {coords && (
                <WeatherComparison
                  currentLocation={location}
                  currentWeatherData={weatherData}
                  onLocationSearch={async (searchLocation) => {
                    // Simulate location search and weather fetch
                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                        searchLocation
                      )}&format=json&limit=1`
                    );
                    const data = await response.json();
                    if (data.length === 0) throw new Error('Location not found');
                    
                    const { lat, lon, display_name } = data[0];
                    const coords = { lat: parseFloat(lat), lon: parseFloat(lon) };
                    
                    // Fetch weather for comparison location
                    const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
                    const weatherResponse = await fetch(
                      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${formattedDate}&end_date=${formattedDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`
                    );
                    const weatherData = await weatherResponse.json();
                    
                    // Process weather data (simplified version)
                    const maxTemp = weatherData.daily.temperature_2m_max[0];
                    const minTemp = weatherData.daily.temperature_2m_min[0];
                    const rain = weatherData.daily.precipitation_sum[0];
                    const wind = weatherData.daily.windspeed_10m_max[0];
                    
                    const processedWeatherData = [
                      {
                        condition: 'Sunny',
                        probability: calculateProbability(maxTemp, { min: 25, max: 40 }, 10, 95, true),
                        severity: getSeverity(calculateProbability(maxTemp, { min: 25, max: 40 }, 10, 95, true)) as 'low' | 'medium' | 'high',
                        actualValue: maxTemp,
                        unit: '°C'
                      },
                      {
                        condition: 'Cold',
                        probability: calculateProbability(minTemp, { min: -5, max: 10 }, 10, 95, false),
                        severity: getSeverity(calculateProbability(minTemp, { min: -5, max: 10 }, 10, 95, false)) as 'low' | 'medium' | 'high',
                        actualValue: minTemp,
                        unit: '°C'
                      },
                      {
                        condition: 'Rainy',
                        probability: calculateProbability(rain, { min: 1, max: 25 }, 10, 95, true),
                        severity: getSeverity(calculateProbability(rain, { min: 1, max: 25 }, 10, 95, true)) as 'low' | 'medium' | 'high',
                        actualValue: rain,
                        unit: 'mm'
                      },
                      {
                        condition: 'Wind',
                        probability: calculateProbability(wind, { min: 20, max: 60 }, 10, 95, true),
                        severity: getSeverity(calculateProbability(wind, { min: 20, max: 60 }, 10, 95, true)) as 'low' | 'medium' | 'high',
                        actualValue: wind,
                        unit: 'km/h'
                      }
                    ];
                    
                    return {
                      name: display_name,
                      coords,
                      weatherData: processedWeatherData
                    };
                  }}
                />
              )}
            </div>
            {viewMode === 'forecast' && forecastData.length > 0 && (
              <ForecastCards forecastData={forecastData} />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default WeatherDashboard;