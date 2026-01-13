
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Wind, Droplets, Sun, ArrowLeft, MapPin, RefreshCw, Cloud, CloudRain, CloudLightning, Snowflake } from 'lucide-react';

interface WeatherSectionProps {
  onBack: () => void;
}

const WeatherSection: React.FC<WeatherSectionProps> = ({ onBack }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = "159b185ea21f75acd5303c2ad0c8f547";

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${API_KEY}&units=metric&lang=kr`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Weather fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (main: string, size: number = 24) => {
    switch (main) {
      case 'Clear': return <Sun size={size} className="text-amber-500" />;
      case 'Clouds': return <CloudSun size={size} className="text-sage-300" />;
      case 'Rain': return <CloudRain size={size} className="text-blue-400" />;
      case 'Drizzle': return <CloudRain size={size} className="text-blue-300" />;
      case 'Thunderstorm': return <CloudLightning size={size} className="text-purple-400" />;
      case 'Snow': return <Snowflake size={size} className="text-blue-100" />;
      default: return <Cloud size={size} className="text-sage-200" />;
    }
  };

  const forecast = [
    { time: '09:00', temp: 18, icon: <Sun className="text-amber-400" size={20} />, wind: '2m/s' },
    { time: '12:00', temp: 22, icon: <Sun className="text-amber-500" size={20} />, wind: '3m/s' },
    { time: '15:00', temp: 24, icon: <CloudSun className="text-sage-300" size={20} />, wind: '4m/s' },
    { time: '18:00', temp: 20, icon: <CloudSun className="text-sage-400" size={20} />, wind: '2m/s' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sage-400 hover:text-sage-600 transition-colors text-xs uppercase tracking-widest font-medium mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <span className="text-sage-400 font-medium tracking-widest uppercase text-xs">Real-time Conditions</span>
          <h2 className="text-5xl font-serif mt-4 text-sage-600 italic">Today's Golf Weather</h2>
        </div>
        <div className="flex items-center space-x-2 text-sage-400 text-sm">
          <MapPin size={16} />
          <span>Seoul, South Korea</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Weather Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-10 rounded-[3rem] bg-white border border-champagne-100 shadow-sm flex flex-col justify-between min-h-[400px]"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="animate-spin text-sage-300" size={40} />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sage-400 font-bold">Currently in Seoul</p>
                  <div className="flex items-baseline space-x-4 mt-4">
                    <h3 className="text-8xl font-serif text-sage-600 italic">{Math.round(weatherData?.main?.temp)}°</h3>
                    <span className="text-2xl text-sage-400 font-light capitalize">{weatherData?.weather[0]?.description}</span>
                  </div>
                </div>
                <div className="text-sage-100 -mt-4 -mr-4">
                  {getWeatherIcon(weatherData?.weather[0]?.main, 140)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-10 border-t border-champagne-50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sage-50 rounded-2xl text-sage-400"><Wind size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase text-sage-300">Wind</p>
                    <p className="text-sm font-semibold text-sage-600">{weatherData?.wind?.speed} m/s</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sage-50 rounded-2xl text-sage-400"><Droplets size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase text-sage-300">Humidity</p>
                    <p className="text-sm font-semibold text-sage-600">{weatherData?.main?.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sage-50 rounded-2xl text-sage-400"><Sun size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase text-sage-300">Feels Like</p>
                    <p className="text-sm font-semibold text-sage-600">{Math.round(weatherData?.main?.feels_like)}°</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Forecast Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-10 rounded-[3rem] bg-sage-400 text-white flex flex-col"
        >
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-serif italic">Hourly Forecast</h4>
            <RefreshCw
              size={16}
              className={`opacity-50 hover:opacity-100 transition-opacity cursor-pointer ${loading ? 'animate-spin' : ''}`}
              onClick={fetchWeather}
            />
          </div>

          <div className="space-y-8 flex-grow">
            {forecast.map((f, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs opacity-60 w-12">{f.time}</span>
                <div className="flex items-center space-x-2">
                  {f.icon}
                  <span className="text-lg font-serif italic">{f.temp}°</span>
                </div>
                <span className="text-[10px] opacity-60 w-12 text-right">{f.wind}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 bg-white/10 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Caddy's Tip</p>
            <p className="text-xs mt-2 leading-relaxed italic">
              {Math.round(weatherData?.main?.temp) < 5
                ? "\"날씨가 춥습니다. 핫팩과 따뜻한 차를 준비하세요.\""
                : "\"라운딩하기 좋은 날씨입니다. 즐거운 경기 되세요!\""}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WeatherSection;
