'use client';

import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {User, Phone, MessageSquare, PhoneCall} from 'lucide-react';
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
      description: "Acil durumda bu numara otomatik olarak aranacaktır.",
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^0-9+]/g, "").slice(0, 15);
    setFormData({...formData, phone: cleaned});
  };

  return (
    <Card className="bg-white border-black/5 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-bold">Acil Durum Hattı</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="contact-name" className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <User className="w-3 h-3" /> Aranacak Kişi
            </Label>
            <Input
              id="contact-name"
              placeholder="örn. Anneniz veya Eşiniz"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-muted/30 border-border h-11 rounded-xl"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contact-phone" className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <Phone className="w-3 h-3" /> Telefon Numarası
            </Label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="+90..."
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={15}
              className="bg-muted/30 border-border h-11 rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="custom-msg" className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Sesli Not (İsteğe Bağlı)
            </Label>
            <Input
              id="custom-msg"
              placeholder="Asistan bu notu sesli olarak okuyacaktır..."
              value={formData.customMessage}
              onChange={(e) => setFormData({...formData, customMessage: e.target.value})}
              className="bg-muted/30 border-border h-11 rounded-xl"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-sm"
        >
          Numarayı Onayla
        </Button>
      </CardContent>
    </Card>
  );
}
