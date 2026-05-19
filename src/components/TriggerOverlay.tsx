"use client";

import { AlertCircle, Phone, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TriggerOverlayProps {
  onDismiss: () => void;
  message?: string;
  isCalling: boolean;
  contactName: string;
}

export function TriggerOverlay({ onDismiss, message, isCalling, contactName }: TriggerOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      <Card className="w-full max-w-2xl bg-card border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-destructive/10 p-8 border-b border-destructive/20 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center animate-bounce">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-destructive">WAKE UP ALERT</h2>
            <p className="text-muted-foreground">The 5-minute response window has elapsed.</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Telephony Status</h3>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
                <span className="text-sm font-bold text-destructive uppercase">Line Active</span>
              </div>
            </div>

            <div className="bg-background/50 rounded-xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <p className="font-bold">Calling {contactName}...</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">AI Synthesized Message</p>
                <div className="p-4 bg-muted/30 rounded-lg italic text-sm border-l-2 border-accent">
                  {message || "Synthesizing emergency alert..."}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              size="lg" 
              className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(130,120,242,0.4)]"
              onClick={onDismiss}
            >
              <Check className="w-6 h-6 mr-2" />
              I AM AWAKE NOW
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Dismissing this will end the emergency call and reset the system.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
