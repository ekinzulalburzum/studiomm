'use client';

import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {User, Phone, MessageSquare} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';

export interface ContactInfo {
  name: string;
  phone: string;
  customMessage?: string;
}

interface BackupContactProps {
  contact: ContactInfo;
  onUpdate: (contact: ContactInfo) => void;
}

export function BackupContact({contact, onUpdate}: BackupContactProps) {
  const {toast} = useToast();
  const [formData, setFormData] = useState<ContactInfo>(contact);

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen aranacak kişinin adını ve numarasını girin.",
        variant: "destructive"
      });
      return;
    }
    onUpdate(formData);
    toast({
      title: "Koruyucu Kaydedildi",
      description: "Ayarlar başarıyla güncellendi.",
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^0-9+]/g, "").slice(0, 15);
    setFormData({...formData, phone: cleaned});
  };

  return (
    <div className="space-y-4 p-2 border-t border-white/10 pt-6">
      <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">
        Acil Durum Hattı
      </Label>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 px-4 h-12 bg-white/5 rounded-xl border border-white/5 focus-within:border-primary/30 transition-all">
            <User className="w-4 h-4 text-primary/40" />
            <input
              placeholder="Aranacak Kişi"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <div className="flex items-center gap-2 px-4 h-12 bg-white/5 rounded-xl border border-white/5 focus-within:border-primary/30 transition-all">
            <Phone className="w-4 h-4 text-primary/40" />
            <input
              type="tel"
              placeholder="+90 Telefon Numarası"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={15}
              className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-2 px-4 h-12 bg-white/5 rounded-xl border border-white/5 focus-within:border-primary/30 transition-all">
            <MessageSquare className="w-4 h-4 text-primary/40" />
            <input
              placeholder="Özel Sesli Not (İsteğe Bağlı)"
              value={formData.customMessage}
              onChange={(e) => setFormData({...formData, customMessage: e.target.value})}
              className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        variant="secondary"
        className="w-full h-12 rounded-xl font-bold border border-white/5 hover:bg-white/10 transition-all"
      >
        NUMARAYI KAYDET
      </Button>
    </div>
  );
}