'use client';

import {useState, useEffect, useRef} from 'react';
import {ClockDisplay} from './ClockDisplay';
import {AlarmStatus, SystemState} from './AlarmStatus';
import {AlarmScheduler} from './AlarmScheduler';
import {BackupContact, ContactInfo} from './BackupContact';
import {TriggerOverlay} from './TriggerOverlay';
import {generateEmergencyCallMessage} from '@/ai/flows/generate-emergency-call-message';
import {useToast} from '@/hooks/use-toast';
import {Shield, Bell} from 'lucide-react';

const ALARM_SOUNDS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3"
];

export function GuardianWakeApp() {
  const {toast} = useToast();
  const [systemState, setSystemState] = useState<SystemState>("standby");
  const [alarmTime, setAlarmTime] = useState<string | null>(null);
  const [alarmDays, setAlarmDays] = useState<number[]>([]);
  const [contact, setContact] = useState<ContactInfo>({
    name: "Acil Durum Kişisi",
    phone: "",
    customMessage: "",
  });
  const [countdown, setCountdown] = useState(300);
  const [aiMessage, setAiMessage] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const alarmCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmCheckInterval.current = setInterval(() => {
      if (systemState === "active" && alarmTime && alarmDays.length > 0) {
        const now = new Date();
        const currentDay = now.getDay();
        const [hours, minutes] = alarmTime.split(":").map(Number);
        
        if (
          alarmDays.includes(currentDay) &&
          now.getHours() === hours && 
          now.getMinutes() === minutes &&
          now.getSeconds() < 15
        ) {
          triggerGracePeriod();
        }
      }
    }, 10000);

    return () => {
      if (alarmCheckInterval.current) clearInterval(alarmCheckInterval.current);
    };
  }, [systemState, alarmTime, alarmDays]);

  const triggerGracePeriod = () => {
    if (systemState === "countdown") return;

    setSystemState("countdown");
    setCountdown(300);
    
    const today = new Date().getDate();
    const soundUrl = ALARM_SOUNDS[today % ALARM_SOUNDS.length];
    
    if (audioRef.current) {
      audioRef.current.src = soundUrl;
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.log("Ses engellendi", e));
    }

    toast({
      title: "Uyanış Kontrolü",
      description: "Lütfen 5 dakika içinde güvende olduğunuzu onaylayın.",
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
      setAiMessage(`Merhaba ${contact.name}, VIGIL kullanıcısı sabah alarmına yanıt vermedi. Lütfen kendisini kontrol edin.`);
    }
  };

  const handleDismiss = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    setSystemState("active");
    setCountdown(300);
    setIsCalling(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setAlarm = (time: string, days: number[]) => {
    if (!contact.phone) {
      toast({
        title: "Numara Gerekli",
        description: "Lütfen önce aranacak bir kişi ve numara belirleyin.",
        variant: "destructive",
      });
      return;
    }
    setAlarmTime(time);
    setAlarmDays(days);
    setSystemState("active");
    toast({
      title: "Nöbet Başladı",
      description: `Belirlenen günlerde saat ${time} için koruma aktif.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <audio ref={audioRef} hidden />
      
      <header className="container mx-auto py-8 px-6 flex items-center justify-between border-b border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">VIGIL</h1>
        </div>
        <AlarmStatus state={systemState} countdown={countdown} />
      </header>

      <main className="container mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 px-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-12">
          <ClockDisplay />
          
          {systemState === 'countdown' && (
            <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center gap-2 text-primary animate-pulse">
                <Bell className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Alarm Çalıyor - Onay Bekleniyor</span>
              </div>
              <button
                onClick={handleDismiss}
                className="w-64 h-64 rounded-full bg-primary text-white text-2xl font-black shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center border-8 border-white/20"
              >
                GÜVENDENİM
                <span className="text-xs font-normal opacity-70 mt-2">Aramayı İptal Et</span>
              </button>
            </div>
          )}

          {systemState === 'active' && (
            <div className="flex items-center gap-3 bg-muted/20 px-6 py-2 rounded-full border border-border/50">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">VIGIL Nöbette: Kesintisiz Koruma</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <AlarmScheduler 
            activeAlarm={alarmTime} 
            activeDays={alarmDays}
            onSetAlarm={setAlarm}
            onClearAlarm={() => {
              setAlarmTime(null);
              setAlarmDays([]);
              setSystemState("standby");
            }} 
          />
          <BackupContact 
            contact={contact} 
            onUpdate={setContact} 
          />
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
    </div>
  );
}
