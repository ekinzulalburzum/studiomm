"use client";

import { useState, useEffect, useRef } from "react";
import { ClockDisplay } from "./ClockDisplay";
import { AlarmStatus, SystemState } from "./AlarmStatus";
import { AlarmScheduler } from "./AlarmScheduler";
import { BackupContact, ContactInfo } from "./BackupContact";
import { TriggerOverlay } from "./TriggerOverlay";
import { generateEmergencyCallMessage } from "@/ai/flows/generate-emergency-call-message";
import { useToast } from "@/hooks/use-toast";
import { 
  BellRing as BellRingIcon, 
  Shield as ShieldIcon, 
  Info as InfoIcon, 
  Music as MusicIcon 
} from "lucide-react";

const ALARM_SOUNDS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
];

export function GuardianWakeApp() {
  const { toast } = useToast();
  const [systemState, setSystemState] = useState<SystemState>("standby");
  const [alarmTime, setAlarmTime] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactInfo>({
    name: "Acil Durum Kişisi",
    phone: "",
    customMessage: "",
  });
  const [countdown, setCountdown] = useState(300); // 5 dakika
  const [aiMessage, setAiMessage] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [currentSound, setCurrentSound] = useState("");

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const alarmCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmCheckInterval.current = setInterval(() => {
      if (systemState === "active" && alarmTime) {
        const now = new Date();
        const [hours, minutes] = alarmTime.split(":").map(Number);
        
        if (now.getHours() === hours && now.getMinutes() === minutes) {
          triggerGracePeriod();
        }
      }
    }, 10000);

    return () => {
      if (alarmCheckInterval.current) clearInterval(alarmCheckInterval.current);
    };
  }, [systemState, alarmTime]);

  useEffect(() => {
    if (systemState === "countdown") {
      const randomIdx = Math.floor(Math.random() * ALARM_SOUNDS.length);
      const soundUrl = ALARM_SOUNDS[randomIdx];
      setCurrentSound(soundUrl);
      
      if (audioRef.current) {
        audioRef.current.src = soundUrl;
        audioRef.current.loop = true;
        audioRef.current.play().catch(e => console.log("Ses çalma engellendi", e));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [systemState]);

  const triggerGracePeriod = () => {
    setSystemState("countdown");
    setCountdown(300);
    toast({
      title: "Uyanma Kontrolü",
      description: "Alarm çaldı. Acil durum uyarısı öncesi 5 dakikanız var.",
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
        userName: "VIGIL Kullanıcısı",
        emergencyContactName: contact.name,
        timeMissed: alarmTime || "Belirtilmedi",
        customMessage: contact.customMessage
      });
      setAiMessage(result.message);
    } catch (error) {
      setAiMessage(`Merhaba ${contact.name}, bu otomatik bir uyarıdır. Yakınınız ${alarmTime} saatindeki alarmını kaçırdı ve yanıt vermedi. Lütfen kendisini kontrol edin.`);
    }
  };

  const handleDismiss = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    setSystemState("active");
    setCountdown(300);
    setIsCalling(false);
    toast({
      title: "Yanıt Doğrulandı",
      description: "VIGIL koruması aktif kalmaya devam ediyor.",
    });
  };

  const setAlarm = (time: string) => {
    if (!contact.phone) {
      toast({
        title: "Yapılandırma Gerekli",
        description: "Alarmı etkinleştirmeden önce bir acil durum kişisi ayarlayın.",
        variant: "destructive",
      });
      return;
    }
    setAlarmTime(time);
    setSystemState("active");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden">
      <audio ref={audioRef} hidden />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" />
      </div>

      <header className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 group">
          <div className="p-3 rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-colors neon-border">
            <ShieldIcon className="w-8 h-8 text-primary neon-text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tighter text-foreground font-headline uppercase">
              VI<span className="text-primary italic">GIL</span>
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Kesintisiz Güvenlik</p>
          </div>
        </div>

        <AlarmStatus state={systemState} countdown={countdown} />
      </header>

      <main className="z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 flex-1">
        <div className="lg:col-span-8 flex flex-col justify-center items-center space-y-12">
          <div className="relative w-full max-w-xl aspect-square flex items-center justify-center">
            {systemState === 'countdown' && (
              <div className="absolute inset-0 bg-accent/5 rounded-full border border-accent/20 animate-pulse-glow scale-125 pointer-events-none" />
            )}
            
            <div className="relative z-10 text-center space-y-4">
              <ClockDisplay />
              
              {systemState === 'countdown' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center space-y-6">
                  <div className="px-6 py-2 rounded-full border border-accent/40 bg-accent/10 text-accent font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    <MusicIcon className="w-4 h-4 animate-bounce" />
                    Rastgele Melodi Çalıyor
                  </div>
                  
                  <button
                    onClick={handleDismiss}
                    className="w-64 h-64 rounded-full bg-primary text-primary-foreground text-3xl font-black uppercase tracking-tighter shadow-[0_0_50px_rgba(130,120,242,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-center px-4 leading-none"
                  >
                    BURADAYIM
                  </button>
                </div>
              )}

              {systemState === 'active' && (
                <div className="flex flex-col items-center space-y-2 opacity-50">
                  <BellRingIcon className="w-8 h-8 animate-pulse text-primary" />
                  <p className="text-sm font-bold uppercase tracking-widest">Planlı alarm bekleniyor</p>
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
            <InfoIcon className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Nasıl Çalışır?</strong> Eğer alarmınızı 5 dakika içinde kapatmazsanız, {contact.name || 'belirlediğiniz kişiye'} yapay zeka tarafından hazırlanan bir acil durum uyarısı iletilecektir.
            </p>
          </div>
        </div>
      </main>

      {systemState === "triggering" && (
        <TriggerOverlay 
          onDismiss={handleDismiss}
          message={aiMessage}
          isCalling={isCalling}
          contactName={contact.name}
        />
      )}

      <footer className="z-10 w-full max-w-5xl flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] pt-8 border-t border-white/5">
        <span>© 2024 VIGIL Güvenlik Sistemleri</span>
        <span>Yapay Zeka Destekli Koruma</span>
      </footer>
    </div>
  );
}
