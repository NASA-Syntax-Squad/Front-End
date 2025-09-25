import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Radar, Layers, Zap } from 'lucide-react';

interface WeatherRadarProps {
  location: string;
  coords: { lat: number; lon: number } | null;
}

const WeatherRadar: React.FC<WeatherRadarProps> = ({ location, coords }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLayer, setCurrentLayer] = useState('precipitation');
  const [intensity, setIntensity] = useState([50]);
  const [radarData, setRadarData] = useState({
    precipitation: Math.random() * 100,
    cloudCover: Math.random() * 100,
    windSpeed: Math.random() * 50,
    temperature: 15 + Math.random() * 20
  });

  useEffect(() => {
    if (coords) {
      // Simulate radar data based on coordinates
      const latFactor = (coords.lat + 90) / 180;
      const lonFactor = (coords.lon + 180) / 360;
      
      setRadarData({
        precipitation: (latFactor * lonFactor * 100) + (Math.random() * 20 - 10),
        cloudCover: ((1 - latFactor) * 100) + (Math.random() * 15 - 7.5),
        windSpeed: (latFactor * 30 + lonFactor * 20) + (Math.random() * 10 - 5),
        temperature: (25 - Math.abs(coords.lat - 25) / 2) + (Math.random() * 8 - 4)
      });
    }
  }, [coords]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setRadarData(prev => ({
          precipitation: Math.max(0, Math.min(100, prev.precipitation + (Math.random() * 10 - 5))),
          cloudCover: Math.max(0, Math.min(100, prev.cloudCover + (Math.random() * 8 - 4))),
          windSpeed: Math.max(0, Math.min(60, prev.windSpeed + (Math.random() * 6 - 3))),
          temperature: Math.max(-20, Math.min(50, prev.temperature + (Math.random() * 2 - 1)))
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const getIntensityColor = (value: number) => {
    if (value < 20) return 'hsl(240, 100%, 70%)'; // Blue
    if (value < 40) return 'hsl(180, 100%, 50%)'; // Cyan
    if (value < 60) return 'hsl(120, 100%, 50%)'; // Green
    if (value < 80) return 'hsl(60, 100%, 50%)';  // Yellow
    return 'hsl(0, 100%, 60%)'; // Red
  };

  const RadarDisplay = ({ type, value }: { type: string; value: number }) => {
    const size = 200;
    const center = size / 2;
    const maxRadius = 80;
    const rings = 4;

    const generateDataPoints = (count: number) => {
      return Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 2 * Math.PI;
        const radius = Math.random() * maxRadius * (value / 100);
        const intensity = Math.random() * value;
        return {
          x: center + Math.cos(angle) * radius,
          y: center + Math.sin(angle) * radius,
          intensity: intensity,
          size: Math.random() * 8 + 2
        };
      });
    };

    const dataPoints = generateDataPoints(50);

    return (
      <div className="relative">
        <svg width={size} height={size} className="mx-auto">
          {/* Background */}
          <rect width={size} height={size} fill="rgba(0, 0, 0, 0.8)" rx="8" />
          
          {/* Concentric circles */}
          {Array.from({ length: rings }).map((_, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={(maxRadius / rings) * (i + 1)}
              fill="none"
              stroke="rgba(6, 182, 212, 0.3)"
              strokeWidth="1"
            />
          ))}
          
          {/* Cross lines */}
          <line x1="20" y1={center} x2={size - 20} y2={center} stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
          <line x1={center} y1="20" x2={center} y2={size - 20} stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
          
          {/* Data points */}
          {dataPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={point.size}
              fill={getIntensityColor(point.intensity)}
              opacity={0.7}
              className={isAnimating ? 'animate-pulse' : ''}
            />
          ))}
          
          {/* Rotating sweep line */}
          {isAnimating && (
            <line
              x1={center}
              y1={center}
              x2={center + maxRadius}
              y2={center}
              stroke="rgba(6, 182, 212, 0.8)"
              strokeWidth="2"
              className="animate-spin origin-center"
              style={{ transformOrigin: `${center}px ${center}px` }}
            />
          )}
          
          {/* Center dot */}
          <circle cx={center} cy={center} r="3" fill="#06b6d4" />
        </svg>
        
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs text-cyan-300">{type.toUpperCase()}</span>
        </div>
        
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs text-white">{value.toFixed(1)}{type === 'temperature' ? '°C' : '%'}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
            <Radar className="w-5 h-5" />
            Weather Radar
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAnimating(!isAnimating)}
              className="bg-transparent border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAnimating(false);
                // Reset radar data
                setRadarData(prev => ({
                  ...prev,
                  precipitation: Math.random() * 100,
                  cloudCover: Math.random() * 100
                }));
              }}
              className="bg-transparent border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {location && (
          <p className="text-sm text-cyan-200/70">Simulated radar data for {location}</p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={currentLayer} onValueChange={setCurrentLayer}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/60 border border-cyan-500/20">
            <TabsTrigger value="precipitation" className="text-cyan-200 data-[state=active]:bg-cyan-500/30 data-[state=active]:text-white text-xs">
              <Layers className="w-3 h-3 mr-1" />
              Rain
            </TabsTrigger>
            <TabsTrigger value="cloudCover" className="text-cyan-200 data-[state=active]:bg-cyan-500/30 data-[state=active]:text-white text-xs">
              <Layers className="w-3 h-3 mr-1" />
              Clouds
            </TabsTrigger>
            <TabsTrigger value="lightning" className="text-cyan-200 data-[state=active]:bg-cyan-500/30 data-[state=active]:text-white text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Lightning
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="precipitation" className="mt-0">
              <RadarDisplay type="precipitation" value={radarData.precipitation} />
            </TabsContent>
            <TabsContent value="cloudCover" className="mt-0">
              <RadarDisplay type="cloudCover" value={radarData.cloudCover} />
            </TabsContent>
            <TabsContent value="lightning" className="mt-0">
              <RadarDisplay type="lightning" value={radarData.windSpeed} />
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-cyan-200">Radar Sensitivity</span>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs">
              {intensity[0]}%
            </Badge>
          </div>
          <Slider
            value={intensity}
            onValueChange={setIntensity}
            max={100}
            step={1}
            className="w-full"
          />
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded p-2 text-center">
              <div className="text-xs text-cyan-200/70">Wind Speed</div>
              <div className="text-sm font-semibold text-white">{radarData.windSpeed.toFixed(1)} km/h</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded p-2 text-center">
              <div className="text-xs text-cyan-200/70">Temperature</div>
              <div className="text-sm font-semibold text-white">{radarData.temperature.toFixed(1)}°C</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherRadar;