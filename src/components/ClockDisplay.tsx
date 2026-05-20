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
        "flex flex-col items-center justify-center p-6 md:p-8 select-none transition-all duration-700 rounded-[3rem] w-full max-w-sm",
        isActive ? "clock-card scale-100" : "bg-transparent"
      )}
    >
      <div className="relative flex flex-col items-center">
        <div className="text-[5rem] sm:text-[6rem] md:text-[8rem] font-black tracking-tighter neon-text-primary flex items-baseline leading-none text-white text-center">
          <span>{hours}</span>
          <span className="animate-pulse mx-1 opacity-20">:</span>
          <span>{minutes}</span>
        </div>
        <div className="text-xl md:text-2xl opacity-30 font-black tabular-nums tracking-widest mt-1 text-white">
          {seconds}
        </div>
      </div>
      <div className="text-[10px] md:text-xs font-black text-primary/50 tracking-[0.5em] uppercase text-center mt-6">
        {time.toLocaleDateString('tr-TR', {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>
      {isActive && (
        <div className="mt-6 flex items-center gap-3 px-5 py-2 bg-primary/10 rounded-full border border-primary/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <span className="text-[9px] font-black text-primary tracking-[0.3em] uppercase">VIGIL NÖBETTE</span>
        </div>
      )}
    </div>
  );
}
