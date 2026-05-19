"use client";

import { useState, useEffect, useRef } from "react";
import { ClockDisplay } from "./ClockDisplay";
import { AlarmStatus, SystemState } from "./AlarmStatus";
import { AlarmScheduler } from "./AlarmScheduler";
import { BackupContact, ContactInfo } from "./BackupContact";
import { TriggerOverlay } from "./TriggerOverlay";
import { generateEmergencyCallMessage } from "@/ai/flows/generate-emergency-call-message";
import { useToast } from "@/hooks/use-toast";
import { BellRing, Shield, Info } from "lucide-react";

export function GuardianWakeApp() {
  const { toast } = useToast();
  const [systemState, setSystemState] = useState<SystemState>("standby");
  const [alarmTime, setAlarmTime] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactInfo>({
    name: "Emergency Guardian",
    phone: "",
    customMessage: "",
  });
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [aiMessage, setAiMessage] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const alarmCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Alarm Monitoring Logic
  useEffect(() => {
    alarmCheckInterval.current = setInterval(() => {
      if (systemState === "active" && alarmTime) {
        const now = new Date();
        const [hours, minutes] = alarmTime.split(":").map(Number);
        
        if (now.getHours() === hours && now.getMinutes() === minutes) {
          triggerGracePeriod();
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      if (alarmCheckInterval.current) clearInterval(alarmCheckInterval.current);
    };
  }, [systemState, alarmTime]);

  const triggerGracePeriod = () => {
    setSystemState("countdown");
    setCountdown(300);
    toast({
      title: "Wake Up Check",
      description: "Alarm triggered. You have 5 minutes to dismiss before emergency alert.",
      variant: "default",
    });

    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownInterval.current) clearInterval(countdownInterval.current);
          handleTriggerEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTriggerEmergency = async () => {
    setSystemState("triggering");
    setIsCalling(true);
    
    try {
      const result = await generateEmergencyCallMessage({
        userName: "GuardianWake User",
        emergencyContactName: contact.name,
        timeMissed: alarmTime || "Recently",
        customMessage: contact.customMessage
      });
      setAiMessage(result.message);
    } catch (error) {
      console.error("AI Generation failed", error);
      setAiMessage(`Hello ${contact.name}, this is an automated alert. Your contact missed their alarm at ${alarmTime} and has not responded. Please check on them.`);
    }
  };

  const handleDismiss = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    setSystemState("active");
    setCountdown(300);
    setIsCalling(false);
    toast({
      title: "Response Verified",
      description: "GuardianWake protection remains active.",
    });
  };

  const setAlarm = (time: string) => {
    if (!contact.phone) {
      toast({
        title: "Configuration Required",
        description: "Please set a backup contact before activating the alarm.",
        variant: "destructive",
      });
      return;
    }
    setAlarmTime(time);
    setSystemState("active");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" />
      </div>

      {/* Header */}
      <header className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 group">
          <div className="p-3 rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-colors neon-border">
            <Shield className="w-8 h-8 text-primary neon-text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tighter text-foreground font-headline">
              GUARDIAN<span className="text-primary italic">WAKE</span>
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Intelligent Life Support</p>
          </div>
        </div>

        <AlarmStatus state={systemState} countdown={countdown} />
      </header>

      {/* Main Display */}
      <main className="z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 flex-1">
        <div className="lg:col-span-8 flex flex-col justify-center items-center space-y-12">
          <div className="relative w-full max-w-xl aspect-square flex items-center justify-center">
            {/* Pulsating background for countdown */}
            {systemState === 'countdown' && (
              <div className="absolute inset-0 bg-accent/5 rounded-full border border-accent/20 animate-pulse-glow scale-125 pointer-events-none" />
            )}
            
            <div className="relative z-10 text-center space-y-4">
              <ClockDisplay />
              
              {systemState === 'countdown' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center space-y-6">
                  <div className="px-6 py-2 rounded-full border border-accent/40 bg-accent/10 text-accent font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                    5-Minute Response Window
                  </div>
                  
                  <button
                    onClick={handleDismiss}
                    className="w-64 h-64 rounded-full bg-primary text-primary-foreground text-3xl font-black uppercase tracking-tighter shadow-[0_0_50px_rgba(130,120,242,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-center px-4 leading-none"
                  >
                    I AM<br/>AWAKE
                  </button>
                </div>
              )}

              {systemState === 'active' && (
                <div className="flex flex-col items-center space-y-2 opacity-50">
                  <BellRing className="w-8 h-8 animate-pulse text-primary" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting scheduled alarm</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <AlarmScheduler 
            activeAlarm={alarmTime} 
            onSetAlarm={setAlarm}
            onClearAlarm={() => {
              setAlarmTime(null);
              setSystemState("standby");
            }} 
          />
          <BackupContact 
            contact={contact} 
            onUpdate={setContact} 
          />
          
          <div className="p-4 bg-muted/10 border border-white/5 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>GuardianWake Logic:</strong> If you don't dismiss your alarm within 5 minutes, an AI-synthesized emergency call will be placed to {contact.name || 'your guardian'}.
            </p>
          </div>
        </div>
      </main>

      {/* Overlays */}
      {systemState === "triggering" && (
        <TriggerOverlay 
          onDismiss={handleDismiss}
          message={aiMessage}
          isCalling={isCalling}
          contactName={contact.name}
        />
      )}

      {/* Footer */}
      <footer className="z-10 w-full max-w-5xl flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] pt-8 border-t border-white/5">
        <span>© 2024 GuardianWake Systems</span>
        <span>Secured Telephony Link • AI-09X</span>
      </footer>
    </div>
  );
}
