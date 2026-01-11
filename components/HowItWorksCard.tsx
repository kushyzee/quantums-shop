import { orbitron } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HowItWorksCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const lastCardTitle = "Instant Delivery";

export default function HowItWorksCard({
  Icon,
  title,
  description,
}: HowItWorksCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 mx-auto">
      <div className="p-3 rounded-md bg-accent-green relative">
        {title !== lastCardTitle && (
          <div className="hidden lg:block absolute top-1/2 left-full h-1 w-28 bg-linear-to-r from-accent-green to-background"></div>
        )}
        <Icon className="h-12 w-12 lg:h-16 lg:w-16 text-white" />
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
