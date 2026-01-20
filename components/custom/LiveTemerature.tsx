"use client";

import { useEffect, useState } from "react";
import Typography from "../Typography";

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

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await res.json();
        setTemperature(data.current_weather.temperature);
      } catch (error) {
        console.error("Temperature fetch failed", error);
      }
    };

    fetchTemperature();
  }, [latitude, longitude]);

  return (
    <Typography
      variant="h3"
      textColor="primary"
      weight="bold"
      className="mb-2"
    >
      {temperature !== null ? `${temperature}°C` : "--"}
    </Typography>
  );
};

export default LiveTemperature;
