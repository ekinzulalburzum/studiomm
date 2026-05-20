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
    <div className="space-y-8 w-full flex flex-col items-center max-w-full">
      <div className="flex flex-col items-center space-y-4 w-full text-center">
        <Label className="text-[10px] text-primary/60 uppercase tracking-[0.5em] font-black">
          Uyanış Zamanı
        </Label>
        
        <div className="relative w-full flex justify-center">
          <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full opacity-10 pointer-events-none" />
          <div className="relative w-full max-w-[260px] flex flex-col items-center">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-6xl font-black h-32 rounded-[2.5rem] text-center focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer appearance-none selection:bg-primary/20 text-white shadow-inner"
            />
            <div className="mt-4 bg-white/5 text-muted-foreground text-[8px] px-5 py-2 rounded-full font-black tracking-widest border border-white/5 uppercase">
              Dijital Saat Ayarı
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 w-full flex justify-center px-2">
        <div className="flex flex-wrap justify-center gap-1.5 max-w-[300px]">
          {DAYS.map((day) => (
            <button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={cn(
                "w-10 h-10 rounded-xl text-[9px] font-black transition-all border-2",
                selectedDays.includes(day.value)
                  ? "bg-primary text-background border-primary shadow-lg shadow-primary/10"
                  : "bg-white/5 text-muted-foreground border-transparent hover:bg-white/10"
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-3 w-full max-w-[280px]">
        <Button 
          onClick={() => onSetAlarm(time, selectedDays)}
          className="w-full h-14 rounded-2xl font-black text-sm bg-primary hover:bg-primary/90 text-background shadow-xl shadow-primary/20 transition-transform active:scale-[0.98] tracking-widest"
        >
          {activeAlarm ? "GÜNCELLE" : "KORUMAYI BAŞLAT"}
        </Button>
        {activeAlarm && (
          <Button 
            variant="ghost" 
            onClick={onClearAlarm}
            className="w-full h-12 rounded-2xl font-bold text-destructive hover:bg-destructive/10 text-[10px] tracking-tight"
          >
            SİSTEMİ DEVRE DIŞI BIRAK
          </Button>
        )}
      </div>
    </div>
  );
}
