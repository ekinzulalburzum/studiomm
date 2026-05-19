"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const DAYS = [
  { label: "Pzt", value: 1 },
  { label: "Sal", value: 2 },
  { label: "Çar", value: 3 },
  { label: "Per", value: 4 },
  { label: "Cum", value: 5 },
  { label: "Cmt", value: 6 },
  { label: "Paz", value: 0 },
];

interface AlarmSchedulerProps {
  onSetAlarm: (time: string, days: number[]) => void;
  activeAlarm: string | null;
  activeDays: number[];
  onClearAlarm: () => void;
}

export function AlarmScheduler({ onSetAlarm, activeAlarm, activeDays, onClearAlarm }: AlarmSchedulerProps) {
  const [time, setTime] = useState(activeAlarm || "07:00");
  const [selectedDays, setSelectedDays] = useState<number[]>(activeDays.length > 0 ? activeDays : [1, 2, 3, 4, 5]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-10 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-6 w-full">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black opacity-60">
          Uyanış Zamanı
        </Label>
        
        <div className="relative group w-full flex justify-center">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />
          <div className="relative w-full max-w-[280px]">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-black/40 border border-white/5 text-5xl md:text-6xl font-black h-28 md:h-32 rounded-[2rem] text-center focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none selection:bg-primary/20"
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary/20 text-primary text-[9px] px-4 py-1.5 rounded-full font-black tracking-widest border border-primary/30 whitespace-nowrap">
              DİJİTAL SAAT AYARI
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap justify-center gap-2">
          {DAYS.map((day) => (
            <button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={cn(
                "w-11 h-11 md:w-12 md:h-12 rounded-2xl text-[10px] font-black transition-all border-2",
                selectedDays.includes(day.value)
                  ? "bg-primary text-background border-primary shadow-lg shadow-primary/20"
                  : "bg-white/5 text-muted-foreground border-transparent hover:bg-white/10"
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          onClick={() => onSetAlarm(time, selectedDays)}
          className="w-full h-16 rounded-[1.8rem] font-black text-lg bg-primary hover:bg-primary/90 text-background shadow-xl shadow-primary/20 transition-transform active:scale-[0.98]"
        >
          {activeAlarm ? "PROGRAMI GÜNCELLE" : "KORUMAYI BAŞLAT"}
        </Button>
        {activeAlarm && (
          <Button 
            variant="ghost" 
            onClick={onClearAlarm}
            className="w-full h-14 rounded-[1.5rem] font-bold text-destructive hover:bg-destructive/10"
          >
            SİSTEMİ DEVRE DIŞI BIRAK
          </Button>
        )}
      </div>
    </div>
  );
}