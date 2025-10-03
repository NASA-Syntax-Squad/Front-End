import React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Map,
  Search,
  Calendar as CalendarIcon,
  Navigation,
  Settings,
  Satellite,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';

interface ControlsProps {
  location: string;
  setLocation: (location: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  handleSearch: (searchLocation?: string) => void;
  popularLocations: { name: string; coords: { lat: number; lon: number } }[];
  searchInputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  viewMode: 'current' | 'forecast';
  setViewMode: (mode: 'current' | 'forecast') => void;
  advancedMetrics: boolean;
  setAdvancedMetrics: (advanced: boolean) => void;
  selectedMetric: string;
  setSelectedMetric: (metric: string) => void;
  mapStyle: 'standard' | 'satellite' | 'dark';
  setMapStyle: (style: 'standard' | 'satellite' | 'dark') => void;
}

const Controls: React.FC<ControlsProps> = ({
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
  advancedMetrics,
  setAdvancedMetrics,
  selectedMetric,
  setSelectedMetric,
  mapStyle,
  setMapStyle,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handlePopularLocation = (loc: { name: string; coords: { lat: number; lon: number } }) => {
    setLocation(loc.name);
    handleSearch(loc.name);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30 shadow-2xl shadow-cyan-500/20 mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-black/30 border-cyan-500/30 text-white placeholder-cyan-200/50"
                />
              </div>
              <Button
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {isLoading ? '...' : <Navigation className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-cyan-300/70 text-sm">Quick access:</span>
              {popularLocations.map((loc) => (
                <Badge
                  key={loc.name}
                  variant="outline"
                  className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 cursor-pointer hover:bg-cyan-500/20"
                  onClick={() => handlePopularLocation(loc)}
                >
                  {loc.name.split(',')[0]}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-black/30 border-cyan-500/30 text-white">
                  <CalendarIcon className="mr-2 h-4 w-4 text-cyan-400" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-900 border-cyan-500/30">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => { setSelectedDate(date); setIsCalendarOpen(false); }}
                  disabled={(date) => date > new Date(new Date().setDate(new Date().getDate() + 16))}
                  initialFocus
                  className="bg-gray-900"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2">
            <Select
              value={viewMode}
              onValueChange={(value: "current" | "forecast") => setViewMode(value)}
            >
              <SelectTrigger className="bg-black/30 border-cyan-500/30 text-white">
                <SelectValue placeholder="View mode" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/30">
                <SelectItem value="current">Current Analysis</SelectItem>
                <SelectItem value="forecast">7-Day Forecast</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAdvancedMetrics(!advancedMetrics)}
              className="bg-black/30 border-cyan-500/30"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
            </Button>
          </div>
        </div>
        {advancedMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <Switch id="advanced-mode" />
              <Label htmlFor="advanced-mode" className="text-cyan-200">Advanced Metrics</Label>
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="bg-black/30 border-cyan-500/30 text-white">
                <SelectValue placeholder="Filter metrics" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/30">
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="precipitation">Precipitation</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapStyle('standard')}
                className={`flex-1 ${mapStyle === 'standard' ? 'bg-cyan-500/20 border-cyan-500' : 'bg-black/30 border-cyan-500/30'}`}
              >
                <Map className="w-4 h-4 mr-1" /> Standard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapStyle('satellite')}
                className={`flex-1 ${mapStyle === 'satellite' ? 'bg-cyan-500/20 border-cyan-500' : 'bg-black/30 border-cyan-500/30'}`}
              >
                <Satellite className="w-4 h-4 mr-1" /> Satellite
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapStyle('dark')}
                className={`flex-1 ${mapStyle === 'dark' ? 'bg-cyan-500/20 border-cyan-500' : 'bg-black/30 border-cyan-500/30'}`}
              >
                <Eye className="w-4 h-4 mr-1" /> Dark
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Controls;