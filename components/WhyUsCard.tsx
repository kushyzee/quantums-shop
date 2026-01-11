import { orbitron } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
interface WhyUsCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}
export default function WhyUsCard({
  Icon,
  title,
  description,
}: WhyUsCardProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-md bg-accent-green/20">
        <Icon className="h-9 w-9 text-accent-green" />
      </div>
      <div>
        <h3 className={cn("text-lg font-semibold", orbitron.className)}>
          {title}
        </h3>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
    </div>
  );
}
