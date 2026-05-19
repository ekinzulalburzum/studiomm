'use client';

import {AlertCircle, Phone, Check, PhoneOff} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {useEffect, useState} from 'react';

interface TriggerOverlayProps {
  onDismiss: () => void;
  message?: string;
  isCalling: boolean;
  contactName: string;
}

export function TriggerOverlay({onDismiss, message, isCalling, contactName}: TriggerOverlayProps) {
  const [callStatus, setCallStatus] = useState('Bağlanıyor...');

  useEffect(() => {
    if (isCalling) {
      const timer = setTimeout(() => {
        setCallStatus('Arama Yapılıyor...');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCalling]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-2xl p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-destructive/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      <Card className="w-full max-w-2xl bg-card border-destructive/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-destructive/10 p-10 border-b border-destructive/20 flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center animate-ping absolute inset-0 opacity-40" />
            <div className="w-24 h-24 rounded-full bg-destructive/30 flex items-center justify-center relative">
              <Phone className="w-10 h-10 text-destructive animate-bounce" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter text-destructive uppercase">ACİL DURUM ARAMASI</h2>
            <p className="text-muted-foreground font-medium">Uyanış onayı alınamadı. {contactName} aranıyor.</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Hat Durumu</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-destructive uppercase">{callStatus}</span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <p className="font-bold text-sm">Sesli Asistan Konuşuyor...</p>
              </div>
              
              <div className="space-y-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Oynatılan Ses Kaydı (AI)</p>
                <div className="p-5 bg-background rounded-xl italic text-sm border-l-4 border-destructive leading-relaxed text-foreground/80 shadow-sm">
                  "{message || "Sistem uyanış raporunu hazırlıyor ve aktarıyor..."}"
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              size="lg" 
              className="w-full h-20 text-xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={onDismiss}
            >
              <Check className="w-8 h-8 mr-3" />
              BURADAYIM, ARAMAYI SONLANDIR
            </Button>
            <p className="text-center text-xs text-muted-foreground font-medium px-8">
              Butona bastığınızda acil durum protokolü iptal edilecek ve koruyucunuza güvende olduğunuz bildirilecektir.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
