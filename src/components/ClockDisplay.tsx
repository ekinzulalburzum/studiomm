"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ClockDisplayProps {
  onClick?: () => void;
  isActive?: boolean;
}

export function ClockDisplay({ onClick, isActive }: ClockDisplayProps) {
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
    <div 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center space-y-2 p-12 select-none cursor-pointer group transition-all duration-500 rounded-3xl",
        isActive ? "clock-card" : "hover:bg-white/5"
      )}
    >
      <div className="relative">
        <div className="text-8xl md:text-[10rem] font-bold tracking-tighter neon-text-primary flex items-baseline leading-none">
          <span className="group-hover:text-primary transition-colors">{hours}</span>
          <span className="animate-pulse mx-1 opacity-40">:</span>
          <span className="group-hover:text-primary transition-colors">{minutes}</span>
          <span className="text-2xl md:text-4xl ml-4 opacity-40 font-medium tabular-nums">
            {seconds}
          </span>
        </div>
      </div>
      <div className="text-sm md:text-base font-bold text-muted-foreground tracking-[0.3em] uppercase opacity-60">
        {time.toLocaleDateString('tr-TR', {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className="mt-4 text-[10px] font-bold text-primary/50 uppercase tracking-widest animate-pulse opacity-0 group-hover:opacity-100 transition-opacity">
        Alarm Kurmak İçin Dokun
      </div>
    </div>
  );
}