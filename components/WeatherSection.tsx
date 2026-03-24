import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CloudSun,
  Wind,
  Droplets,
  Sun,
  ArrowLeft,
  MapPin,
  RefreshCw,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
} from 'lucide-react';

interface WeatherSectionProps {
  onBack: () => void;
}

const WeatherSection: React.FC<WeatherSectionProps> = ({ onBack }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchWeather = async () => {
    setLoading(true);
    if (!apiKey) {
      setWeatherData(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${apiKey}&units=metric&lang=kr`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [apiKey]);

  const getWeatherIcon = (main: string, size = 24) => {
    switch (main) {
      case 'Clear':
        return <Sun size={size} className="text-amber-500" />;
      case 'Clouds':
        return <CloudSun size={size} className="text-sage-300" />;
      case 'Rain':
        return <CloudRain size={size} className="text-blue-400" />;
      case 'Drizzle':
        return <CloudRain size={size} className="text-blue-300" />;
      case 'Thunderstorm':
        return <CloudLightning size={size} className="text-purple-400" />;
      case 'Snow':
        return <Snowflake size={size} className="text-blue-100" />;
      default:
        return <Cloud size={size} className="text-sage-200" />;
    }
  };

  const forecast = [
    { time: '09:00', temp: 18, icon: <Sun className="text-amber-400" size={20} />, wind: '2m/s' },
    { time: '12:00', temp: 22, icon: <Sun className="text-amber-500" size={20} />, wind: '3m/s' },
    { time: '15:00', temp: 24, icon: <CloudSun className="text-sage-300" size={20} />, wind: '4m/s' },
    { time: '18:00', temp: 20, icon: <CloudSun className="text-sage-400" size={20} />, wind: '2m/s' },
  ];

  const caddysTip =
    weatherData?.main?.temp < 5
      ? 'Cold air and stiffer hands today. Start conservatively and keep a wind layer nearby.'
      : 'Comfortable conditions for a round. Keep your tempo stable and let the course come to you.';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-[0.22em] text-sage-400 transition-colors hover:text-sage-600 sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>Back to Dashboard</span>
      </button>

      <div className="mb-10 flex flex-col gap-4 sm:mb-16 md:flex-row md:items-end md:justify-between md:gap-6">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage-400 sm:text-xs">
            Real-time Conditions
          </span>
          <h2 className="mt-3 font-serif text-3xl italic text-sage-600 sm:text-5xl">Today&apos;s Golf Weather</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-sage-400">
          <MapPin size={16} />
          <span>Seoul, South Korea</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[320px] flex-col justify-between rounded-[2rem] border border-champagne-100 bg-white p-5 shadow-sm sm:min-h-[400px] sm:rounded-[3rem] sm:p-10 lg:col-span-2"
        >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <RefreshCw className="animate-spin text-sage-300" size={40} />
            </div>
          ) : !apiKey ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-sage-600">Weather API key is not configured.</p>
              <p className="mt-2 text-xs text-sage-400">Add `VITE_OPENWEATHER_API_KEY` to `.env.local`.</p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage-400">Currently in Seoul</p>
                  <div className="mt-4 flex items-end gap-3 sm:items-baseline sm:gap-4">
                    <h3 className="font-serif text-6xl italic text-sage-600 sm:text-8xl">
                      {Math.round(weatherData?.main?.temp)}°
                    </h3>
                    <span className="pb-2 text-base font-light capitalize text-sage-400 sm:text-2xl">
                      {weatherData?.weather[0]?.description}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-sage-100">
                  {getWeatherIcon(weatherData?.weather[0]?.main, 88)}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-champagne-50 pt-6 sm:grid-cols-3 sm:gap-8 sm:pt-10">
                <div className="flex items-center space-x-4">
                  <div className="rounded-2xl bg-sage-50 p-3 text-sage-400">
                    <Wind size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-sage-300">Wind</p>
                    <p className="text-sm font-semibold text-sage-600">{weatherData?.wind?.speed} m/s</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-2xl bg-sage-50 p-3 text-sage-400">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-sage-300">Humidity</p>
                    <p className="text-sm font-semibold text-sage-600">{weatherData?.main?.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-2xl bg-sage-50 p-3 text-sage-400">
                    <Sun size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-sage-300">Feels Like</p>
                    <p className="text-sm font-semibold text-sage-600">{Math.round(weatherData?.main?.feels_like)}°</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col rounded-[2rem] bg-sage-400 p-5 text-white sm:rounded-[3rem] sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between sm:mb-10">
            <h4 className="text-lg font-serif italic sm:text-xl">Hourly Forecast</h4>
            <RefreshCw
              size={16}
              className={`cursor-pointer transition-opacity hover:opacity-100 ${loading ? 'animate-spin opacity-100' : 'opacity-60'}`}
              onClick={fetchWeather}
            />
          </div>

          <div className="flex-grow space-y-4 sm:space-y-8">
            {forecast.map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="w-12 text-xs opacity-60">{f.time}</span>
                <div className="flex items-center space-x-2">
                  {f.icon}
                  <span className="font-serif text-lg italic">{f.temp}°</span>
                </div>
                <span className="w-12 text-right text-[10px] opacity-60">{f.wind}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 sm:mt-10">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Caddy&apos;s Tip</p>
            <p className="mt-2 text-xs italic leading-relaxed">{caddysTip}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WeatherSection;
