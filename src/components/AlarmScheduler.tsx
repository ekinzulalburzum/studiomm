"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [time, setTime] = useState("07:00");
  const [selectedDays, setSelectedDays] = useState<number[]>(activeDays.length > 0 ? activeDays : [1, 2, 3, 4, 5]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <Card className="bg-white border-black/5 shadow-sm overflow-hidden rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-bold">Zamanlayıcı</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Günler
          </Label>
          <div className="flex justify-between gap-1">
            {DAYS.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={cn(
                  "w-9 h-9 rounded-full text-[10px] font-bold transition-all border",
                  selectedDays.includes(day.value)
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="alarm-time" className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Saat
          </Label>
          <div className="flex gap-2">
            <Input
              id="alarm-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-muted/30 border-border text-lg font-bold h-12 rounded-xl"
            />
          </div>
        </div>
        
        {activeAlarm ? (
          <Button 
            variant="destructive" 
            onClick={onClearAlarm}
            className="w-full h-12 rounded-xl font-bold"
          >
            Sistemi Kapat
          </Button>
        ) : (
          <Button 
            onClick={() => onSetAlarm(time, selectedDays)}
            className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          >
            Korumayı Başlat
          </Button>
        )}
      </CardContent>
    </Card>
  );
}