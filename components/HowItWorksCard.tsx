import { orbitron } from "@/app/layout";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HowItWorksCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export default function HowItWorksCard({
  Icon,
  title,
  description,
}: HowItWorksCardProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-2 rounded-md bg-accent-green">
        <Icon className="h-12 w-12 text-white" />
      </div>
      <div className="text-center">
        <h3 className={cn("text-lg font-semibold", orbitron.className)}>
          {title}
        </h3>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
    </div>
  );
}
