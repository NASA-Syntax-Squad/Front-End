import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Plus, 
  X, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Search
} from 'lucide-react';

interface WeatherData {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  actualValue?: number;
  unit?: string;
}

interface LocationComparison {
  name: string;
  coords: { lat: number; lon: number };
  weatherData: WeatherData[];
  overallRisk: number;
}

interface WeatherComparisonProps {
  currentLocation: string;
  currentWeatherData: WeatherData[];
  onLocationSearch: (location: string) => Promise<{
    name: string;
    coords: { lat: number; lon: number };
    weatherData: WeatherData[];
  }>;
}

const WeatherComparison: React.FC<WeatherComparisonProps> = ({
  currentLocation,
  currentWeatherData,
  onLocationSearch
}) => {
  const [comparisonLocations, setComparisonLocations] = useState<LocationComparison[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const calculateOverallRisk = (weatherData: WeatherData[]) => {
    if (weatherData.length === 0) return 0;
    return weatherData.reduce((sum, data) => sum + data.probability, 0) / weatherData.length;
  };

  const addLocationForComparison = async () => {
    if (!searchInput.trim() || isSearching) return;
    
    if (comparisonLocations.length >= 4) {
      return; // Limit to 4 comparison locations
    }

    setIsSearching(true);
    try {
      const locationData = await onLocationSearch(searchInput);
      const overallRisk = calculateOverallRisk(locationData.weatherData);
      
      const newComparison: LocationComparison = {
        ...locationData,
        overallRisk
      };

      setComparisonLocations(prev => [...prev, newComparison]);
      setSearchInput('');
    } catch (error) {
      console.error('Error adding comparison location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const removeLocation = (index: number) => {
    setComparisonLocations(prev => prev.filter((_, i) => i !== index));
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 60) return 'text-red-400';
    if (risk >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBadgeClass = (risk: number) => {
    if (risk >= 60) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (risk >= 40) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-green-500/20 text-green-300 border-green-500/30';
  };

  const currentRisk = calculateOverallRisk(currentWeatherData);
  const allLocations = [
    { 
      name: currentLocation, 
      weatherData: currentWeatherData, 
      overallRisk: currentRisk,
      coords: { lat: 0, lon: 0 } // Placeholder
    },
    ...comparisonLocations
  ];

  const ComparisonChart = () => {
    const conditions = ['Sunny', 'Cold', 'Rainy', 'Wind'];
    
    return (
      <div className="space-y-4">
        {conditions.map(condition => {
          const conditionData = allLocations.map(location => {
            const data = location.weatherData.find(d => d.condition === condition);
            return {
              location: location.name,
              probability: data?.probability || 0,
              value: data?.actualValue,
              unit: data?.unit
            };
          }).filter(d => d.probability > 0);

          if (conditionData.length === 0) return null;

          return (
            <div key={condition} className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30">
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {condition} Conditions
              </h4>
              <div className="space-y-3">
                {conditionData.map((data, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white truncate max-w-[200px]">{data.location}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-200">{data.probability}%</span>
                        {data.value !== undefined && (
                          <span className="text-cyan-200/70 text-xs">
                            ({data.value}{data.unit})
                          </span>
                        )}
                      </div>
                    </div>
                    <Progress value={data.probability} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location Comparison
          <Badge variant="outline" className="ml-auto bg-blue-500/10 text-blue-300 border-blue-500/30">
            {allLocations.length} Location{allLocations.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/60 border border-cyan-500/20 mb-4">
            <TabsTrigger value="overview" className="text-cyan-200 data-[state=active]:bg-cyan-500/30 data-[state=active]:text-white text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="text-cyan-200 data-[state=active]:bg-cyan-500/30 data-[state=active]:text-white text-xs">
              Detailed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Add Location Input */}
            <div className="flex gap-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLocationForComparison()}
                placeholder="Add location to compare..."
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                disabled={isSearching || comparisonLocations.length >= 4}
              />
              <Button
                onClick={addLocationForComparison}
                size="sm"
                disabled={!searchInput.trim() || isSearching || comparisonLocations.length >= 4}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {isSearching ? <Search className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>

            {comparisonLocations.length >= 4 && (
              <div className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                Maximum 4 comparison locations allowed
              </div>
            )}

            {/* Locations Overview */}
            <div className="space-y-2">
              {allLocations.map((location, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                  index === 0 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30' 
                    : 'bg-gray-800/40 border-gray-600/30'
                }`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white truncate max-w-[200px]">
                        {location.name}
                      </span>
                      {index === 0 && (
                        <Badge variant="outline" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-semibold ${getRiskColor(location.overallRisk)}`}>
                        {location.overallRisk.toFixed(1)}% Risk
                      </span>
                      <div className="flex items-center gap-1 text-xs text-cyan-200/70">
                        {location.overallRisk > currentRisk ? (
                          <TrendingUp className="w-3 h-3 text-red-400" />
                        ) : location.overallRisk < currentRisk ? (
                          <TrendingDown className="w-3 h-3 text-green-400" />
                        ) : (
                          <Minus className="w-3 h-3 text-gray-400" />
                        )}
                        vs current
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getRiskBadgeClass(location.overallRisk)}>
                      {location.overallRisk >= 60 ? 'HIGH' : location.overallRisk >= 40 ? 'MED' : 'LOW'}
                    </Badge>
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLocation(index - 1)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Best/Worst Summary */}
            {allLocations.length > 1 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="text-xs text-green-300 mb-1">Lowest Risk</div>
                  <div className="font-semibold text-white text-sm">
                    {allLocations.reduce((min, current) => 
                      current.overallRisk < min.overallRisk ? current : min
                    ).name}
                  </div>
                  <div className="text-xs text-green-300">
                    {Math.min(...allLocations.map(l => l.overallRisk)).toFixed(1)}% risk
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="text-xs text-red-300 mb-1">Highest Risk</div>
                  <div className="font-semibold text-white text-sm">
                    {allLocations.reduce((max, current) => 
                      current.overallRisk > max.overallRisk ? current : max
                    ).name}
                  </div>
                  <div className="text-xs text-red-300">
                    {Math.max(...allLocations.map(l => l.overallRisk)).toFixed(1)}% risk
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="detailed" className="mt-4">
            {allLocations.length > 1 ? (
              <ComparisonChart />
            ) : (
              <div className="text-center py-8 text-cyan-200/70">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Add locations above to see detailed comparison</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherComparison;