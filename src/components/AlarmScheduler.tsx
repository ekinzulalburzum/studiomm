"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
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
    <div className="space-y-6 p-2">
      <div className="space-y-4">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">
          Haftalık Plan
        </Label>
        <div className="flex justify-between gap-1">
          {DAYS.map((day) => (
            <button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={cn(
                "w-10 h-10 rounded-xl text-[10px] font-black transition-all border-2",
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

      <div className="grid gap-4">
        <Label htmlFor="alarm-time" className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">
          Dijital Saat
        </Label>
        <div className="relative group">
          <Input
            id="alarm-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-white/5 border-white/10 text-3xl font-black h-20 rounded-2xl text-center focus:bg-white/10 focus:border-primary/50 transition-all cursor-pointer"
          />
          <Clock className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/30 group-hover:text-primary transition-colors" />
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button 
          onClick={() => onSetAlarm(time, selectedDays)}
          className="w-full h-14 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 text-background shadow-xl shadow-primary/10 transition-transform active:scale-[0.98]"
        >
          {activeAlarm ? "GÜNCELLE" : "KORUMAYI AKTİF ET"}
        </Button>
        {activeAlarm && (
          <Button 
            variant="ghost" 
            onClick={onClearAlarm}
            className="w-full h-12 rounded-2xl font-bold text-destructive hover:bg-destructive/10"
          >
            SİSTEMİ KAPAT
          </Button>
        )}
      </div>
    </div>
  );
}