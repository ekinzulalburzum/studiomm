"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ClockDisplayProps {
  isActive?: boolean;
}

export function ClockDisplay({ isActive }: ClockDisplayProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="h-40 md:h-48" />;

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center space-y-2 p-6 md:p-8 py-10 md:py-12 select-none transition-all duration-700 rounded-[2.5rem] md:rounded-[3rem] w-full",
        isActive ? "clock-card scale-100 md:scale-105" : "bg-white/[0.02]"
      )}
    >
      <div className="relative">
        <div className="text-[5.5rem] sm:text-[7rem] md:text-[10rem] font-black tracking-tighter neon-text-primary flex items-baseline leading-none text-white">
          <span>{hours}</span>
          <span className="animate-pulse mx-1 opacity-20">:</span>
          <span>{minutes}</span>
          <span className="text-2xl md:text-4xl ml-2 md:ml-4 opacity-20 font-medium tabular-nums">
            {seconds}
          </span>
        </div>
      </div>
      <div className="text-xs md:text-base font-bold text-muted-foreground tracking-[0.4em] uppercase opacity-40 text-center">
        {time.toLocaleDateString('tr-TR', {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>
      {isActive && (
        <div className="mt-4 flex items-center gap-2 px-5 py-2 bg-primary/10 rounded-full border border-primary/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <span className="text-[9px] font-black text-primary tracking-[0.2em] uppercase">SİSTEM NÖBETTE</span>
        </div>
      )}
    </div>
  );
}