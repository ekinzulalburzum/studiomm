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

  if (!time) return <div className="h-48 md:h-56" />;

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center space-y-4 p-8 md:p-12 select-none transition-all duration-700 rounded-[3.5rem] w-full",
        isActive ? "clock-card scale-100 md:scale-105" : "bg-white/[0.01]"
      )}
    >
      <div className="relative flex flex-col items-center">
        <div className="text-[6.5rem] sm:text-[8rem] md:text-[11rem] font-black tracking-tighter neon-text-primary flex items-baseline leading-none text-white text-center">
          <span>{hours}</span>
          <span className="animate-pulse mx-2 opacity-10">:</span>
          <span>{minutes}</span>
        </div>
        <div className="text-3xl md:text-5xl opacity-20 font-black tabular-nums tracking-widest mt-2">
          {seconds}
        </div>
      </div>
      <div className="text-xs md:text-sm font-black text-primary/40 tracking-[0.6em] uppercase text-center mt-4">
        {time.toLocaleDateString('tr-TR', {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>
      {isActive && (
        <div className="mt-8 flex items-center gap-3 px-6 py-2.5 bg-primary/10 rounded-full border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-[10px] font-black text-primary tracking-[0.3em] uppercase">VIGIL NÖBETTE</span>
        </div>
      )}
    </div>
  );
}