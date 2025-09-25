import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Target,
  Zap,
  Calendar,
  Thermometer,
  CloudRain,
  Wind,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface WeatherData {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  actualValue?: number;
  unit?: string;
}

interface WeatherStatisticsProps {
  weatherData: WeatherData[];
  location: string;
  selectedDate: Date | undefined;
}

const WeatherStatistics: React.FC<WeatherStatisticsProps> = ({
  weatherData,
  location,
  selectedDate
}) => {

  // Calculate comprehensive statistics
  const calculateStatistics = () => {
    if (weatherData.length === 0) return null;

    const stats = {
      totalConditions: weatherData.length,
      averageProbability: weatherData.reduce((sum, d) => sum + d.probability, 0) / weatherData.length,
      highRiskCount: weatherData.filter(d => d.severity === 'high').length,
      mediumRiskCount: weatherData.filter(d => d.severity === 'medium').length,
      lowRiskCount: weatherData.filter(d => d.severity === 'low').length,
      maxProbability: Math.max(...weatherData.map(d => d.probability)),
      minProbability: Math.min(...weatherData.map(d => d.probability)),
      riskDistribution: {
        high: (weatherData.filter(d => d.severity === 'high').length / weatherData.length) * 100,
        medium: (weatherData.filter(d => d.severity === 'medium').length / weatherData.length) * 100,
        low: (weatherData.filter(d => d.severity === 'low').length / weatherData.length) * 100,
      },
      dominantCondition: weatherData.reduce((max, current) => 
        current.probability > max.probability ? current : max
      ),
      weatherIndex: 0,
      riskScore: 0
    };

    // Calculate Weather Variability Index (0-100)
    const probabilities = weatherData.map(d => d.probability);
    const variance = probabilities.reduce((acc, val) => {
      return acc + Math.pow(val - stats.averageProbability, 2);
    }, 0) / probabilities.length;
    stats.weatherIndex = Math.min(100, Math.sqrt(variance) * 2);

    // Calculate Risk Score (0-100)
    stats.riskScore = (stats.averageProbability * 0.6) + 
                      (stats.highRiskCount * 15) + 
                      (stats.mediumRiskCount * 5) +
                      (stats.weatherIndex * 0.2);
    stats.riskScore = Math.min(100, stats.riskScore);

    return stats;
  };

  const stats = calculateStatistics();

  // Seasonal and temporal analysis
  const getSeasonalContext = () => {
    if (!selectedDate) return null;
    
    const month = selectedDate.getMonth();
    const season = month < 3 || month > 10 ? 'Winter' : 
                   month < 6 ? 'Spring' : 
                   month < 9 ? 'Summer' : 'Autumn';
    
    const seasonalTrends = {
      Winter: { typical: ['Cold', 'Wind'], description: 'Lower temperatures and increased wind patterns' },
      Spring: { typical: ['Rainy', 'Wind'], description: 'Transitional weather with increased precipitation' },
      Summer: { typical: ['Sunny', 'Uncomfortable'], description: 'Higher temperatures and heat-related conditions' },
      Autumn: { typical: ['Wind', 'Rainy'], description: 'Cooling temperatures with variable conditions' }
    };

    return {
      season,
      trends: seasonalTrends[season as keyof typeof seasonalTrends],
      isTypicalForSeason: weatherData.some(d => 
        seasonalTrends[season as keyof typeof seasonalTrends].typical.includes(d.condition) && d.probability > 50
      )
    };
  };

  const seasonalContext = getSeasonalContext();

  if (!stats) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Weather Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-cyan-200/70">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Load weather data to see comprehensive statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    unit, 
    description, 
    color = 'cyan' 
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    unit?: string;
    description: string;
    color?: string;
  }) => (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 rounded-lg p-4 border border-gray-600/30">
      <div className="flex items-center justify-between mb-2">
        <div className={`text-${color}-400`}>{icon}</div>
        <span className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toFixed(1) : value}{unit}
        </span>
      </div>
      <div className="text-sm font-medium text-white mb-1">{title}</div>
      <div className="text-xs text-cyan-200/70">{description}</div>
    </div>
  );

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Weather Statistics
          <Badge variant="outline" className="ml-auto bg-purple-500/10 text-purple-300 border-purple-500/30">
            Advanced
          </Badge>
        </CardTitle>
        {location && selectedDate && (
          <p className="text-sm text-cyan-200/70">
            Analysis for {location} on {format(selectedDate, 'PPP')}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/60 border border-cyan-500/20 mb-4">
            <TabsTrigger value="overview" className="text-cyan-200 data-[state=active]:bg-cyan-500/30 data-[state=active]:text-white text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="risk" className="text-cyan-200 data-[state=active]:bg-cyan-500/30 data-[state=active]:text-white text-xs">
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="seasonal" className="text-cyan-200 data-[state=active]:bg-cyan-500/30 data-[state=active]:text-white text-xs">
              Seasonal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<Activity className="w-5 h-5" />}
                title="Average Probability"
                value={stats.averageProbability}
                unit="%"
                description="Mean likelihood across all conditions"
                color="cyan"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                title="Weather Variability"
                value={stats.weatherIndex}
                unit="/100"
                description="Measure of condition variation"
                color="purple"
              />
              <StatCard
                icon={<Target className="w-5 h-5" />}
                title="Dominant Condition"
                value={stats.dominantCondition.condition}
                description={`${stats.dominantCondition.probability}% probability`}
                color="green"
              />
              <StatCard
                icon={<Zap className="w-5 h-5" />}
                title="Risk Score"
                value={stats.riskScore}
                unit="/100"
                description="Composite weather risk assessment"
                color="orange"
              />
            </div>

            <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30">
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Probability Distribution
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white">Highest Risk:</span>
                  <span className="text-red-400 font-semibold">{stats.maxProbability}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white">Lowest Risk:</span>
                  <span className="text-green-400 font-semibold">{stats.minProbability}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white">Range:</span>
                  <span className="text-cyan-400 font-semibold">{stats.maxProbability - stats.minProbability}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">{stats.highRiskCount}</div>
                <div className="text-xs text-red-300">High Risk</div>
                <div className="text-xs text-red-200/70 mt-1">
                  {stats.riskDistribution.high.toFixed(0)}%
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.mediumRiskCount}</div>
                <div className="text-xs text-yellow-300">Medium Risk</div>
                <div className="text-xs text-yellow-200/70 mt-1">
                  {stats.riskDistribution.medium.toFixed(0)}%
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{stats.lowRiskCount}</div>
                <div className="text-xs text-green-300">Low Risk</div>
                <div className="text-xs text-green-200/70 mt-1">
                  {stats.riskDistribution.low.toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-cyan-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Risk Distribution
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-red-300">High Risk</span>
                  <span className="text-red-300">{stats.riskDistribution.high.toFixed(1)}%</span>
                </div>
                <Progress value={stats.riskDistribution.high} className="h-2" />
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-yellow-300">Medium Risk</span>
                  <span className="text-yellow-300">{stats.riskDistribution.medium.toFixed(1)}%</span>
                </div>
                <Progress value={stats.riskDistribution.medium} className="h-2" />
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-300">Low Risk</span>
                  <span className="text-green-300">{stats.riskDistribution.low.toFixed(1)}%</span>
                </div>
                <Progress value={stats.riskDistribution.low} className="h-2" />
              </div>
            </div>

            <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30">
              <h5 className="font-medium text-white mb-2">Risk Assessment Summary</h5>
              <p className="text-sm text-cyan-200/80">
                {stats.riskScore >= 70 
                  ? "⚠️ High overall risk conditions detected. Exercise caution and monitor weather closely."
                  : stats.riskScore >= 40
                  ? "⚡ Moderate risk conditions. Stay informed and prepared for changing weather."
                  : "✅ Low risk conditions. Weather appears relatively stable for planned activities."
                }
              </p>
            </div>
          </TabsContent>

          <TabsContent value="seasonal" className="mt-4 space-y-4">
            {seasonalContext && (
              <>
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white">Seasonal Context: {seasonalContext.season}</h4>
                  </div>
                  <p className="text-sm text-cyan-200/80 mb-3">{seasonalContext.trends.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={seasonalContext.isTypicalForSeason 
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      }
                    >
                      {seasonalContext.isTypicalForSeason ? 'Typical for Season' : 'Unusual Pattern'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-cyan-300 text-sm">Expected Conditions</h5>
                    <div className="space-y-1">
                      {seasonalContext.trends.typical.map((condition, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {condition === 'Cold' && <Thermometer className="w-3 h-3 text-blue-400" />}
                          {condition === 'Sunny' && <Thermometer className="w-3 h-3 text-red-400" />}
                          {condition === 'Rainy' && <CloudRain className="w-3 h-3 text-blue-300" />}
                          {condition === 'Wind' && <Wind className="w-3 h-3 text-gray-400" />}
                          <span className="text-cyan-200/80">{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-cyan-300 text-sm">Seasonal Factors</h5>
                    <div className="text-xs text-cyan-200/70 space-y-1">
                      <p>• Historical weather patterns</p>
                      <p>• Regional climate characteristics</p>
                      <p>• Typical seasonal variations</p>
                      <p>• Long-term climate trends</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherStatistics;