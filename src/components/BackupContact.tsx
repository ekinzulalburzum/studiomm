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

  return (
    <Card className="bg-card/50 border-white/5 backdrop-blur-md overflow-hidden neon-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg font-bold">Acil Durum Koruyucusu</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="contact-name" className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" /> Koruyucu Adı
            </Label>
            <Input
              id="contact-name"
              placeholder="örn. Ahmet Yılmaz"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background/50 border-white/10"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contact-phone" className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-3 h-3" /> Telefon Numarası
            </Label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="+90 (555) 000 00 00"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-background/50 border-white/10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="custom-msg" className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Özel Uyarı Notu (İsteğe Bağlı)
            </Label>
            <Input
              id="custom-msg"
              placeholder="Bugün uyanmakta zorluk çekiyorum..."
              value={formData.customMessage}
              onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
              className="bg-background/50 border-white/10"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          variant="secondary" 
          className="w-full bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 font-bold"
        >
          Yapılandırmayı Kaydet
        </Button>
      </CardContent>
    </Card>
  );
}
