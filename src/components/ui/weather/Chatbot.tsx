import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Loader2 } from 'lucide-react';
import boticon from '@/assets/bot.jpg';

//API Key for Google Generative AI
const API_KEY = "AIzaSyBJdvpUbhkg9sysqVXwo8ce6rmpJfAswCM";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// --- Interfaces ---
interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface WeatherData {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  icon: JSX.Element;
  description: string;
  actualValue?: number;
  unit?: string;
}

interface ForecastDay {
  date: Date;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
}

interface ChatbotProps {
  location: string;
  selectedDate: Date | undefined;
  weatherData: WeatherData[];
  forecastData: ForecastDay[];
}

// --- Helper Function (from chat.ts) ---
function createWeatherContext(location: string, selectedDate: Date | undefined, weatherData: any[], forecastData: any[]): string {
  if (!location) return 'No location selected yet.';

  const currentDate = selectedDate ? new Date(selectedDate).toLocaleDateString() : 'the current date';
  
  let context = `Location: ${location}, Date: ${currentDate}. `;
  
  if (weatherData && weatherData.length > 0) {
    context += "Current weather conditions: ";
    weatherData.forEach(item => {
      context += `${item.condition}: ${item.probability}% probability${item.actualValue ? `, value: ${item.actualValue}${item.unit || ''}` : ''}. `;
    });
  }
  
  if (forecastData && forecastData.length > 0) {
    context += "7-day forecast: ";
    forecastData.forEach(day => {
      context += `${new Date(day.date).toLocaleDateString()}: max ${day.maxTemp}°C, min ${day.minTemp}°C, precipitation ${day.precipitation}mm, wind ${day.windSpeed}km/h. `;
    });
  }
  
  return context;
}


// --- Main Chatbot Component ---
const Chatbot: React.FC<ChatbotProps> = ({ location, selectedDate, weatherData, forecastData }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentChatInput = chatInput;
    setChatInput('');
    setIsLoading(true);

    try {
      const weatherContext = createWeatherContext(location, selectedDate, weatherData, forecastData);
      
      const prompt = `You are a helpful weather assistant. Use the following weather context to answer questions accurately and conversationally. 
If the user asks about something outside of weather, politely redirect the conversation back to weather topics.

---
Weather Context: ${weatherContext}
---
User Question: ${currentChatInput}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botResponseText = response.text();

      const botMessage: ChatMessage = {
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat API error:', error);
      
      const errorMessage: ChatMessage = {
        sender: 'bot',
        text: "I'm having trouble connecting to the AI service. Please check the API key and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  return (
    <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
      <DialogTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <span className="text-white text-sm font-semibold p-2 px-4 rounded-full bg-cyan-500/20 backdrop-blur-sm hidden md:block transition-all duration-300 group-hover:bg-cyan-500/30">
            Ask me anything
          </span>
          <Button
            className="rounded-full h-12 w-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110"
            size="icon"
          >
            <img src={boticon} alt="Chatbot Icon" className="w-15 h-15 rounded-full" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-md border-cyan-500/30 text-white max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-cyan-300 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Weather Assistant
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="text-xs bg-transparent border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/20"
            >
              Clear Chat
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 p-4 bg-gray-900/50 rounded-lg border border-cyan-500/20 mb-4"
        >
          {chatMessages.length === 0 ? (
            <div className="text-center text-cyan-200/70 h-full flex flex-col items-center justify-center">
              <Bot className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-semibold">Hello! I'm your weather assistant.</p>
              <p className="text-sm mt-2">Ask me about the weather in {location || 'your location'}!</p>
              <div className="mt-4 text-xs text-cyan-200/50">
                <p>Try asking:</p>
                <p>"What's the weather like today?"</p>
                <p>"Will it rain tomorrow?"</p>
                <p>"Tell me about the forecast"</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        msg.sender === 'user'
                          ? 'bg-cyan-500/20 text-cyan-200'
                          : 'bg-purple-500/20 text-purple-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p className="text-xs text-cyan-200/50 mt-1">{msg.timestamp}</p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-purple-500/20 text-purple-200 rounded-lg p-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about the weather..."
            className="bg-black/50 border-cyan-500/30 text-white placeholder-cyan-200/50 flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleChatSubmit}
            disabled={isLoading || !chatInput.trim()}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Chatbot;