import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface AdminPeriodFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const periods = [
  { value: "today", label: "Hoje" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "this_month", label: "Este Mês" },
  { value: "last_month", label: "Mês Passado" },
];

const AdminPeriodFilter = ({ selectedPeriod, onPeriodChange }: AdminPeriodFilterProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Período:</span>
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={selectedPeriod === period.value ? "premium" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(period.value)}
          className="text-xs"
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};

export default AdminPeriodFilter;
