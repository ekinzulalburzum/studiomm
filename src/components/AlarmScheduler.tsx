"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Clock } from "lucide-react";

interface AlarmSchedulerProps {
  onSetAlarm: (time: string) => void;
  activeAlarm: string | null;
  onClearAlarm: () => void;
}

export function AlarmScheduler({ onSetAlarm, activeAlarm, onClearAlarm }: AlarmSchedulerProps) {
  const [time, setTime] = useState("07:00");

  return (
    <Card className="bg-card/50 border-white/5 backdrop-blur-md overflow-hidden neon-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-bold">Alarm Scheduler</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="alarm-time" className="text-xs text-muted-foreground uppercase tracking-widest">
            Primary Wake-up Time
          </Label>
          <div className="flex gap-2">
            <Input
              id="alarm-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-background/50 border-white/10 text-xl font-bold h-12"
            />
            {activeAlarm ? (
              <Button 
                variant="destructive" 
                onClick={onClearAlarm}
                className="h-12 px-6"
              >
                Cancel
              </Button>
            ) : (
              <Button 
                onClick={() => onSetAlarm(time)}
                className="h-12 px-6 font-bold shadow-[0_0_15px_rgba(130,120,242,0.4)]"
              >
                Set Alarm
              </Button>
            )}
          </div>
        </div>
        
        {activeAlarm && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">
              Next protection cycle scheduled for <span className="text-primary font-bold">{activeAlarm}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
