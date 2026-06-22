"use client";

import { FileSearch, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { useAnalyzeStore } from "@/store/analyzeStore";
import { useAskStore } from "@/store/askStore";
import { Card, CardContent } from "@/components/ui/card";

export function QuickStats() {
  const { history: analyses } = useAnalyzeStore();
  const { history: questions } = useAskStore();

  const supported = analyses.filter((a) => a.result.supported).length;
  const denied = analyses.filter((a) => !a.result.supported).length;

  const stats = [
    { label: "Encounters Analyzed", value: analyses.length, icon: FileSearch, color: "text-primary-400" },
    { label: "Questions Asked", value: questions.length, icon: MessageSquare, color: "text-text-accent" },
    { label: "Codes Supported", value: supported, icon: CheckCircle2, color: "text-status-supported" },
    { label: "Codes Denied", value: denied, icon: XCircle, color: "text-status-denied" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                <p className="text-xs text-text-secondary mt-1 leading-tight">{label}</p>
              </div>
              <Icon className={`w-5 h-5 ${color} opacity-80`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
