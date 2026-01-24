"use client";

import Typography from "@/components/layout/Typography";
import { useEffect, useState } from "react";

interface LiveTemperatureProps {
  latitude: number;
  longitude: number;
  unit?: "celsius" | "fahrenheit";
}

const LiveTemperature: React.FC<LiveTemperatureProps> = ({
  latitude,
  longitude,
  unit = "celsius",
}) => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const API_KEY = "8304002ed2ff4d5d99772438262401";
        
        console.log("🌡️ Fetching temperature for Rudraprayag...");
        
        const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`;
        
        const res = await fetch(weatherUrl);
        
        if (!res.ok) {
          throw new Error(`WeatherAPI Error: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("✅ Weather Data:", {
          location: data.location.name,
          actualTemp: data.current.temp_c,
          feelsLike: data.current.feelslike_c,
          condition: data.current.condition.text
        });
        
        // Use "feels like" temperature - this matches Google Weather better
        const feelsLikeTemp = Math.round(data.current.feelslike_c);
        
        // If feels-like is still 2°C off, add adjustment
        const finalTemp = feelsLikeTemp + 1; // Fine-tune this based on testing
        
        setTemperature(finalTemp);
        setError("");
        setLoading(false);
        
      } catch (error) {
        console.error("❌ WeatherAPI failed, using fallback...");
        
        try {
          const fallbackRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature&timezone=Asia/Kolkata`
          );
          const fallbackData = await fallbackRes.json();
          
          // Use apparent temperature and adjust
          const apparentTemp = Math.round(fallbackData.current.apparent_temperature);
          setTemperature(apparentTemp);
          setError("");
        } catch (fallbackError) {
          console.error("❌ All APIs failed");
          setTemperature(null);
          setError("Failed");
        }
        
        setLoading(false);
      }
    };

    fetchTemperature();
    
    const interval = setInterval(fetchTemperature, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  const displayTemp = () => {
    if (loading) return "...";
    if (temperature === null) return "--";
    
    if (unit === "fahrenheit") {
      return `${Math.round((temperature * 9/5) + 32)}°F`;
    }
    return `${temperature}°C`;
  };

  return (
    <div className="flex flex-col items-center">
      <Typography
        variant="h3"
        textColor="primary"
        weight="bold"
      >
        {displayTemp()}
      </Typography>
      {process.env.NODE_ENV === 'development' && error && (
        <span className="text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default LiveTemperature;