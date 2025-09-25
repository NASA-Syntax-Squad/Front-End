import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Cloud } from 'lucide-react';
import { format } from 'date-fns';

interface WeatherData {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  icon: JSX.Element;
  description: string;
  actualValue?: number;
  unit?: string;
}

interface WeatherGridProps {
  weatherData: WeatherData[];
  selectedMetric: string;
  selectedDate: Date | undefined;
}

const WeatherGrid: React.FC<WeatherGridProps> = ({ weatherData, selectedMetric, selectedDate }) => {
  function getSeverityBadge(severity: string) {
    const variants = {
      low: 'bg-green-500/20 text-green-300 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      high: 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return variants[severity as keyof typeof variants] || variants.medium;
  }

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Weather Condition Probabilities
          {selectedDate && (
            <Badge variant="outline" className="ml-auto bg-purple-500/10 text-purple-300 border-purple-500/30">
              {format(selectedDate, 'MMM dd, yyyy')}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {weatherData.length > 0 ? (
            weatherData
              .filter(
                (item) =>
                  selectedMetric === 'all' ||
                  item.condition.toLowerCase().includes(selectedMetric) ||
                  (selectedMetric === 'temperature' && (item.condition.includes('Hot') || item.condition.includes('Cold'))) ||
                  (selectedMetric === 'precipitation' && item.condition.includes('Wet')) ||
                  (selectedMetric === 'wind' && item.condition.includes('Windy'))
              )
              .map((item) => (
                <Card
                  key={item.condition}
                  className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/20 backdrop-blur-sm hover:shadow-cyan-500/20 hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <h3 className="font-semibold text-cyan-200">{item.condition}</h3>
                      </div>
                      <Badge variant="outline" className={getSeverityBadge(item.severity)}>
                        {item.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {item.probability}%
                      </div>
                      <div className="flex-1">
                        <Progress value={item.probability} className="h-2 bg-gray-700">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${item.probability}%` }}
                          />
                        </Progress>
                      </div>
                    </div>
                    <div className="text-xs text-cyan-200/70 mt-2">
                      {item.description}
                      {item.actualValue !== undefined && (
                        <span className="font-mono ml-1 text-cyan-300">
                          {item.actualValue} {item.unit}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="col-span-full text-center py-8 text-cyan-200/70">
              <Cloud className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Search for a location and select a date to see weather probabilities</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherGrid;