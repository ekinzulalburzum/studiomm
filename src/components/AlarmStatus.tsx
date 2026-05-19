"use client";

import { Shield, Radio, PhoneCall, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SystemState = "standby" | "active" | "countdown" | "triggering";

interface AlarmStatusProps {
  state: SystemState;
  countdown?: number;
}

export function AlarmStatus({ state, countdown }: AlarmStatusProps) {
  const config = {
    standby: {
      icon: Shield,
      text: "Sistem Beklemede",
      color: "text-muted-foreground",
      bg: "bg-muted/10",
      border: "border-muted/20",
    },
    active: {
      icon: CheckCircle2,
      text: "Koruma Aktif",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    countdown: {
      icon: Radio,
      text: `Uyanma Doğrulaması - ${countdown}s`,
      color: "text-accent animate-pulse",
      bg: "bg-accent/10",
      border: "border-accent/40",
    },
    triggering: {
      icon: PhoneCall,
      text: "Acil Durum Araması Başlatıldı",
      color: "text-destructive animate-bounce",
      bg: "bg-destructive/10",
      border: "border-destructive/40",
    },
  };

  const current = config[state];
  const Icon = current.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-500",
        current.bg,
        current.border
      )}
    >
      <Icon className={cn("w-5 h-5", current.color)} />
      <span className={cn("font-bold text-sm tracking-wide uppercase", current.color)}>
        {current.text}
      </span>
    </div>
  );
}
