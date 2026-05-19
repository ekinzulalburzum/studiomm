import { GuardianWakeApp } from "@/components/GuardianWakeApp";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="min-h-screen font-body">
      <GuardianWakeApp />
      <Toaster />
    </div>
  );
}
