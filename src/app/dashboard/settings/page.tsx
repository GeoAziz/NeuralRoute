"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, CheckCircle2, RotateCw, Trash2, Key } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [testing, setTesting] = useState<string | null>(null);

  const testConnection = (provider: string) => {
    setTesting(provider);
    setTimeout(() => {
      setTesting(null);
      toast({
        title: "Connection Successful",
        description: `Successfully authenticated with ${provider}.`,
      });
    }, 1500);
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* API Config */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-headline font-bold">API Configuration</h3>
            <p className="text-sm text-text-secondary">Configure your provider credentials for routing.</p>
          </div>
          
          <Card className="p-6 bg-surface border-border space-y-6">
            {[
              { id: 'groq', name: 'Groq API Key', placeholder: 'gsk_...' },
              { id: 'nvidia', name: 'NVIDIA NIM Key', placeholder: 'nv_...' },
              { id: 'gemini', name: 'Gemini API Key', placeholder: 'ai_...' }
            ].map(api => (
              <div key={api.id} className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-text-muted">{api.name}</Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input type="password" placeholder={api.placeholder} className="pl-10 bg-white/5 border-border" />
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-border bg-white/5 text-xs h-10"
                    onClick={() => testConnection(api.name)}
                    disabled={testing === api.name}
                  >
                    {testing === api.name ? <RotateCw className="w-3 h-3 animate-spin" /> : "Test"}
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </section>

        {/* Routing Preferences */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-headline font-bold">Routing Preferences</h3>
            <p className="text-sm text-text-secondary">Fine-tune how NeuralRoute selects providers.</p>
          </div>
          
          <Card className="bg-surface border-border divide-y divide-border-subtle">
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-bold">Enable fallback routing</Label>
                <p className="text-xs text-text-secondary">Automatically retry failed requests on a secondary provider.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-bold">Use classification cache</Label>
                <p className="text-xs text-text-secondary">Cache prompt classifications to reduce routing latency.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-bold">Cache TTL</Label>
                <p className="text-xs text-text-secondary">How long to store classification results.</p>
              </div>
              <Select defaultValue="1h">
                <SelectTrigger className="w-[180px] bg-white/5 border-border">
                  <SelectValue placeholder="Select TTL" />
                </SelectTrigger>
                <SelectContent className="bg-elevated border-border">
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </section>

        {/* Danger Zone */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-headline font-bold text-danger">Danger Zone</h3>
            <p className="text-sm text-text-secondary">Destructive actions for system data.</p>
          </div>
          
          <Card className="p-6 bg-danger/5 border border-danger/20 rounded-xl space-y-6">
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-danger shrink-0 mt-1" />
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Reset system state</p>
                  <p className="text-xs text-danger/80">This will permanently delete all request logs and clear benchmark caches.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-danger/20 hover:bg-danger/10 text-danger text-xs h-9">
                    Clear Logs
                  </Button>
                  <Button variant="outline" className="border-danger/20 hover:bg-danger/10 text-danger text-xs h-9">
                    Reset Benchmarks
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <footer className="pt-8 border-t border-border-subtle flex justify-end gap-3">
           <Button variant="ghost" className="text-text-secondary hover:text-white">Cancel</Button>
           <Button className="bg-primary text-bg font-bold shadow-glow-blue">Save Changes</Button>
        </footer>
      </div>
    </DashboardLayout>
  );
}