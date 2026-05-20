'use client';

import {useState, useEffect, useRef} from 'react';
import {ClockDisplay} from './ClockDisplay';
import {AlarmStatus, SystemState} from './AlarmStatus';
import {AlarmScheduler} from './AlarmScheduler';
import {BackupContact, ContactInfo} from './BackupContact';
import {TriggerOverlay} from './TriggerOverlay';
import {generateEmergencyCallMessage} from '@/ai/flows/generate-emergency-call-message';
import {useToast} from '@/hooks/use-toast';
import {Bell} from 'lucide-react';

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
    name: "",
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
        emergencyContactName: contact.name || "Acil Durum Kişisi",
        timeMissed: alarmTime || "Belirtilmedi",
        customMessage: contact.customMessage
      });
      setAiMessage(result.message);
    } catch (error) {
      setAiMessage(`Merhaba, VIGIL kullanıcısı sabah alarmına yanıt vermedi. Lütfen kendisini kontrol edin.`);
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
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <audio ref={audioRef} hidden />
      
      <header className="container mx-auto py-6 px-4 flex items-center justify-center sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5">
        <AlarmStatus state={systemState} countdown={countdown} />
      </header>

      <main className="container mx-auto flex-1 flex flex-col items-center py-8 px-4 max-w-2xl">
        <div className="w-full space-y-12">
          <ClockDisplay isActive={systemState === 'active'} />
          
          {systemState === 'countdown' && (
            <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-700 bg-primary/5 p-10 rounded-[3rem] border border-primary/10">
              <div className="flex items-center gap-3 text-primary animate-pulse">
                <Bell className="w-6 h-6" />
                <span className="text-lg font-bold uppercase tracking-[0.2em]">DOĞRULAMA BEKLENİYOR</span>
              </div>
              <button
                onClick={handleDismiss}
                className="w-64 h-64 rounded-full bg-primary text-background text-3xl font-black shadow-[0_0_50px_rgba(var(--primary),0.3)] hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center border-8 border-white/10"
              >
                GÜVENDENİM
                <span className="text-[10px] font-bold opacity-70 mt-3 tracking-widest uppercase">DURDURMAK İÇİN BAS</span>
              </button>
            </div>
          )}

          <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-[3rem] p-8 md:p-12 space-y-12 shadow-2xl">
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

          {systemState === 'active' && alarmTime && (
            <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="flex items-center gap-4 bg-primary/10 px-10 py-4 rounded-[2rem] border border-primary/20 shadow-xl shadow-primary/5">
                <Bell className="w-6 h-6 text-primary" />
                <span className="text-4xl font-black text-primary tabular-nums">{alarmTime}</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/40">AKTİF NÖBET PERİYODU</span>
            </div>
          )}
        </div>
      </main>

      {systemState === "triggering" && (
        <TriggerOverlay 
          onDismiss={handleDismiss}
          message={aiMessage}
          isCalling={isCalling}
          contactName={contact.name || "Acil Durum Kişisi"}
        />
      )}
    </div>
  );
}