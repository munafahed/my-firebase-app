import type { DailyCard as DailyCardType } from "@/lib/types";
import { Header } from "@/components/dose-wise/header";
import { DailyCard } from "@/components/dose-wise/daily-card";

interface DailyDoseViewProps {
  card: DailyCardType;
}

export function DailyDoseView({ card }: DailyDoseViewProps) {
  return (
    <div className="w-full">
      <Header />
      <DailyCard card={card} />
    </div>
  );
}
