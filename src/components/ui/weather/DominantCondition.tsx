import React from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';

interface WeatherData {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  icon: JSX.Element;
  description: string;
  actualValue?: number;
  unit?: string;
}

interface DominantConditionProps {
  weatherData: WeatherData[];
}

const DominantCondition: React.FC<DominantConditionProps> = ({ weatherData }) => {
  const getEmoji = () => {
    if (weatherData.length === 0) return '👽';
    const sorted = [...weatherData].sort((a, b) => b.probability - a.probability);
    const top = sorted[0];
    switch (top.condition) {
      case 'Sunny':
        return '🥵';
      case 'Cold':
        return '🥶';
      case 'cloudy':
        return '☁️';
      case 'Wind':
        return '💨';
      case 'Rainy':
        return '⛈️';
      case 'Uncomfortable':
        return '😵';
      default:
        return '👽';
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-lg text-cyan-300">Dominant Condition</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-8xl mb-4 animate-pulse">{getEmoji()}</div>
        {weatherData.length > 0 && (
          <>
            <div className="text-2xl font-bold text-cyan-300 mb-2">
              {weatherData.sort((a, b) => b.probability - a.probability)[0].condition.replace('Very ', '')}
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {weatherData.sort((a, b) => b.probability - a.probability)[0].probability}%
            </div>
           
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DominantCondition;