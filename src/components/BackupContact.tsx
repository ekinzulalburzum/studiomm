"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Phone, MessageSquare, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ContactInfo {
  name: string;
  phone: string;
  customMessage?: string;
}

interface BackupContactProps {
  contact: ContactInfo;
  onUpdate: (contact: ContactInfo) => void;
}

export function BackupContact({ contact, onUpdate }: BackupContactProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactInfo>(contact);

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "Yapılandırma Hatası",
        description: "Lütfen hem isim hem de telefon numarası giriniz.",
        variant: "destructive"
      });
      return;
    }
    onUpdate(formData);
    toast({
      title: "Koruyucu Yapılandırıldı",
      description: "Yedek iletişim bilgileri güvenli bir şekilde kaydedildi.",
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Sadece rakam ve + işaretine izin ver, maksimum 15 karakter
    const cleaned = value.replace(/[^0-9+]/g, "").slice(0, 15);
    setFormData({ ...formData, phone: cleaned });
  };

  return (
    <Card className="bg-white border-black/5 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-bold">Acil Durum Koruyucusu</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="contact-name" className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <User className="w-3 h-3" /> Koruyucu Adı
            </Label>
            <Input
              id="contact-name"
              placeholder="örn. Ahmet Yılmaz"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              placeholder="+905550000000"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={15}
              className="bg-muted/30 border-border h-11 rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="custom-msg" className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Özel Uyarı Notu (İsteğe Bağlı)
            </Label>
            <Input
              id="custom-msg"
              placeholder="Bugün uyanmakta zorluk çekiyorum..."
              value={formData.customMessage}
              onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
              className="bg-muted/30 border-border h-11 rounded-xl"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-sm"
        >
          Yapılandırmayı Kaydet
        </Button>
      </CardContent>
    </Card>
  );
}
