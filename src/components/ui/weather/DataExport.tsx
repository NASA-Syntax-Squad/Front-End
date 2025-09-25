import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';
import { format } from 'date-fns';

interface DataExportProps {
  weatherData: any[];
  location: string;
  selectedDate: Date | undefined;
  downloadData: (format: 'csv' | 'json') => void;
}

const DataExport: React.FC<DataExportProps> = ({ weatherData, downloadData }) => {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-cyan-300">
          <Database className="w-5 h-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Button
            onClick={() => downloadData('csv')}
            variant="outline"
            className="flex-1 bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
            disabled={weatherData.length === 0}
          >
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button
            onClick={() => downloadData('json')}
            variant="outline"
            className="flex-1 bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            disabled={weatherData.length === 0}
          >
            <Download className="w-4 h-4 mr-2" /> JSON
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExport;