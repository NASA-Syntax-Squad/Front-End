import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CloudRain, Wind, Thermometer, Bell } from 'lucide-react';

interface WeatherData {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  actualValue?: number;
  unit?: string;
}

interface WeatherAlertsProps {
  weatherData: WeatherData[];
  location: string;
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ weatherData, location }) => {
  const generateAlerts = () => {
    const alerts: Array<{
      level: 'info' | 'warning' | 'danger';
      icon: React.ReactNode;
      title: string;
      message: string;
      probability: number;
    }> = [];

    weatherData.forEach(data => {
      if (data.probability >= 70 && data.severity === 'high') {
        let icon = <AlertTriangle className="w-4 h-4" />;
        let level: 'info' | 'warning' | 'danger' = 'danger';
        let title = '';
        let message = '';

        switch (data.condition) {
          case 'Sunny':
            icon = <Thermometer className="w-4 h-4" />;
            title = 'Extreme Heat Warning';
            message = `High probability of extreme heat (${data.actualValue}°C) in ${location}. Stay hydrated and avoid prolonged sun exposure.`;
            break;
          case 'Cold':
            icon = <Thermometer className="w-4 h-4" />;
            title = 'Cold Weather Alert';
            message = `Very cold conditions expected (${data.actualValue}°C). Dress warmly and be aware of potential frost.`;
            break;
          case 'Rainy':
            icon = <CloudRain className="w-4 h-4" />;
            title = 'Heavy Precipitation Warning';
            message = `Heavy rainfall expected (${data.actualValue}mm). Potential for flooding in low-lying areas.`;
            break;
          case 'Wind':
            icon = <Wind className="w-4 h-4" />;
            title = 'High Wind Advisory';
            message = `Strong winds expected (${data.actualValue} km/h). Secure loose objects and be cautious when driving.`;
            break;
          default:
            title = 'Weather Advisory';
            message = `${data.condition} conditions with ${data.probability}% probability.`;
        }

        alerts.push({ level, icon, title, message, probability: data.probability });
      } else if (data.probability >= 50 && data.severity === 'medium') {
        alerts.push({
          level: 'warning',
          icon: <Bell className="w-4 h-4" />,
          title: `Moderate ${data.condition} Conditions`,
          message: `${data.probability}% chance of ${data.condition.toLowerCase()} conditions. Monitor conditions closely.`,
          probability: data.probability
        });
      }
    });

    // Add pattern recognition alerts
    const highRiskConditions = weatherData.filter(d => d.probability >= 60).length;
    if (highRiskConditions >= 3) {
      alerts.push({
        level: 'warning',
        icon: <AlertTriangle className="w-4 h-4" />,
        title: 'Multiple Weather Risks',
        message: `${highRiskConditions} weather conditions show elevated risk levels. Plan activities accordingly.`,
        probability: 75
      });
    }

    return alerts.sort((a, b) => b.probability - a.probability);
  };

  const alerts = generateAlerts();

  const getAlertStyles = (level: 'info' | 'warning' | 'danger') => {
    switch (level) {
      case 'danger':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getAlertIconColor = (level: 'info' | 'warning' | 'danger') => {
    switch (level) {
      case 'danger':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Weather Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-green-300 font-medium">No Active Alerts</p>
            <p className="text-cyan-200/70 text-sm mt-1">Weather conditions are within normal ranges</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Weather Alerts
          <Badge variant="outline" className="ml-auto bg-red-500/10 text-red-300 border-red-500/30">
            {alerts.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.slice(0, 4).map((alert, index) => (
          <Alert key={index} className={`${getAlertStyles(alert.level)} border backdrop-blur-sm`}>
            <div className={`${getAlertIconColor(alert.level)} flex-shrink-0`}>
              {alert.icon}
            </div>
            <AlertDescription>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{alert.title}</h4>
                  <p className="text-cyan-200/80 text-sm">{alert.message}</p>
                </div>
                <Badge variant="outline" className="ml-2 text-xs bg-white/10 text-white border-white/20">
                  {alert.probability}%
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        ))}
        {alerts.length > 4 && (
          <div className="text-center pt-2">
            <p className="text-cyan-200/70 text-sm">+{alerts.length - 4} more alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherAlerts;