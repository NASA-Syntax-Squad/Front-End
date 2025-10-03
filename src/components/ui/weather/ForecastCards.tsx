import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Wind, Calendar as CalendarIcon, Thermometer } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';

interface ForecastDay {
  date: Date;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
}

interface ForecastCardsProps {
  forecastData: ForecastDay[];
}

const ForecastCards: React.FC<ForecastCardsProps> = ({ forecastData }) => {
  const getDateBadge = (date: Date) => {
    if (isToday(date)) return <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs px-1.5 py-0">Today</Badge>;
    if (isTomorrow(date)) return <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs px-1.5 py-0">Tmr</Badge>;
    return null;
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-cyan-300 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          7-Day Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {forecastData.map((day, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-cyan-500/15 to-purple-500/10 border-cyan-500/30 backdrop-blur-sm hover:from-cyan-500/20 hover:to-purple-500/15 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/10 hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <div className="font-semibold text-cyan-200 mb-1 text-sm">
                    {format(day.date, 'EEE')}
                  </div>
                  <div className="text-xs text-cyan-200/70 mb-2 flex items-center gap-1">
                    {format(day.date, 'MMM dd')}
                    {getDateBadge(day.date)}
                  </div>
                  
                  {/* Temperature Section */}
                  <div className="flex items-center justify-center gap-2 my-2">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <div className="text-center">
                      <div className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {Math.round(day.maxTemp)}°
                      </div>
                      <div className="text-sm text-cyan-200/70 -mt-1">
                        {Math.round(day.minTemp)}°
                      </div>
                    </div>
                  </div>
                  
                  {/* Weather Stats */}
                  <div className="flex flex-col gap-1.5 mt-2 w-full">
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Droplets className="w-3 h-3 text-blue-400" />
                      <span className="text-cyan-200/80">{day.precipitation}mm</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Wind className="w-3 h-3 text-gray-400" />
                      <span className="text-cyan-200/80">{Math.round(day.windSpeed)}km/h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCards;