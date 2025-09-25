import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, RadarIcon, Calendar } from 'lucide-react';

interface ChartData {
  name: string;
  probability: number;
  fill: string;
  actualValue?: number;
}

interface ForecastChartData {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
}

interface DataChartsProps {
  chartData: ChartData[];
  forecastChartData: ForecastChartData[];
  viewMode: 'current' | 'forecast';
}

const DataCharts: React.FC<DataChartsProps> = ({ chartData, forecastChartData }) => {
  const colors = {
    primary: '#06b6d4',
    secondary: '#ec4899',
    accent: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    grid: 'rgba(6, 182, 212, 0.1)',
    tooltipBg: 'rgba(8, 16, 32, 0.95)',
    axis: '#67e8f9',
    gradientStart: 'rgba(6, 182, 212, 0.3)',
    gradientEnd: 'rgba(139, 92, 246, 0.3)',
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3 shadow-2xl">
          <p className="text-cyan-300 font-semibold text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-cyan-200 text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}{entry.dataKey === 'probability' ? '%' : '°C'}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Tabs defaultValue="bar" className="w-full">
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl text-cyan-300 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Advanced Analytics
            </CardTitle>
            <TabsList className="bg-gray-800/60 border border-cyan-500/20 backdrop-blur-sm">
              <TabsTrigger 
                value="bar" 
                className="text-cyan-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white text-xs px-3 py-1.5"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Bar
              </TabsTrigger>
              <TabsTrigger 
                value="line" 
                className="text-cyan-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white text-xs px-3 py-1.5"
              >
                <LineChartIcon className="w-3 h-3 mr-1" />
                Line
              </TabsTrigger>
              <TabsTrigger 
                value="radar" 
                className="text-cyan-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white text-xs px-3 py-1.5"
              >
                <RadarIcon className="w-3 h-3 mr-1" />
                Radar
              </TabsTrigger>
              <TabsTrigger 
                value="forecast" 
                className="text-cyan-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white text-xs px-3 py-1.5"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Forecast
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="bar" className="mt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis 
                    dataKey="name" 
                    stroke={colors.axis} 
                    fontSize={12}
                    tick={{ fill: '#67e8f9' }}
                  />
                  <YAxis 
                    stroke={colors.axis} 
                    fontSize={12}
                    tick={{ fill: '#67e8f9' }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="probability" radius={[6, 6, 0, 0]} barSize={80}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                        stroke={colors.primary}
                        strokeWidth={1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="line" className="mt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis 
                    dataKey="name" 
                    stroke={colors.axis} 
                    fontSize={12}
                    tick={{ fill: '#67e8f9' }}
                  />
                  <YAxis 
                    stroke={colors.axis} 
                    fontSize={12}
                    tick={{ fill: '#67e8f9' }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="probability"
                    stroke={`url(#lineGradient)`}
                    strokeWidth={3}
                    dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: colors.secondary, stroke: colors.primary }}
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={colors.primary} />
                      <stop offset="100%" stopColor={colors.secondary} />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="radar" className="mt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <PolarGrid stroke={colors.grid} />
                  <PolarAngleAxis 
                    dataKey="name" 
                    stroke={colors.axis} 
                    fontSize={12}
                    tick={{ fill: '#67e8f9' }}
                  />
                  <PolarRadiusAxis 
                    stroke={colors.axis} 
                    fontSize={10}
                    tick={{ fill: '#67e8f9' }}
                  />
                  <Radar 
                    name="Probability" 
                    dataKey="probability" 
                    stroke={colors.primary}
                    fill={colors.primary}
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="mt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastChartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis 
                    dataKey="date" 
                    stroke={colors.axis} 
                    fontSize={12}
                    tick={{ fill: '#67e8f9' }}
                  />
                  <YAxis 
                    stroke={colors.axis} 
                    fontSize={12}
                    tick={{ fill: '#67e8f9' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="maxTempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={colors.secondary} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="minTempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="maxTemp"
                    stroke={colors.secondary}
                    fill="url(#maxTempGradient)"
                    strokeWidth={2}
                    name="Max Temp (°C)"
                  />
                  <Area
                    type="monotone"
                    dataKey="minTemp"
                    stroke={colors.primary}
                    fill="url(#minTempGradient)"
                    strokeWidth={2}
                    name="Min Temp (°C)"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default DataCharts;