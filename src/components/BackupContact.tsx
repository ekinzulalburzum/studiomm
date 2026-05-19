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
        title: "Configuration Error",
        description: "Please provide both a name and a phone number.",
        variant: "destructive"
      });
      return;
    }
    onUpdate(formData);
    toast({
      title: "Guardian Configured",
      description: "Backup contact details have been securely saved.",
    });
  };

  return (
    <Card className="bg-card/50 border-white/5 backdrop-blur-md overflow-hidden neon-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg font-bold">Emergency Guardian</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="contact-name" className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" /> Guardian Name
            </Label>
            <Input
              id="contact-name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background/50 border-white/10"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contact-phone" className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-3 h-3" /> Phone Number
            </Label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-background/50 border-white/10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="custom-msg" className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Custom Alert Note (Optional)
            </Label>
            <Input
              id="custom-msg"
              placeholder="I'm having trouble waking up today..."
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
          Verify & Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}
