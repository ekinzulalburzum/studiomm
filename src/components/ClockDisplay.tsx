"use client";

import { useState, useEffect } from "react";

export function ClockDisplay() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="h-32" />;

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-8 select-none">
      <div className="relative">
        <div className="text-7xl md:text-9xl font-bold tracking-tighter neon-text-primary flex items-baseline">
          <span>{hours}</span>
          <span className="animate-pulse mx-1 opacity-50">:</span>
          <span>{minutes}</span>
          <span className="text-2xl md:text-4xl ml-2 opacity-60 font-medium">
            {seconds}
          </span>
        </div>
      </div>
      <div className="text-sm md:text-base font-medium text-muted-foreground tracking-widest uppercase">
        {time.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
