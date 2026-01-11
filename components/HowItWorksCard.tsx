import { orbitron } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion, Transition } from "motion/react";

interface HowItWorksCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const lastCardTitle = "Instant Delivery";

const transition: Transition = {
  duration: 0.4,
  type: "spring",
  stiffness: 400,
  damping: 25,
};

export default function HowItWorksCard({
  Icon,
  title,
  description,
  delay,
}: HowItWorksCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ ...transition, delay }}
      viewport={{ amount: 0.5, once: true }}
      className="flex flex-col items-center gap-4 mx-auto"
    >
      <div className="p-3 rounded-md bg-accent-green relative">
        {title !== lastCardTitle && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 112, opacity: 1 }}
            transition={{ ...transition, delay: 1 }}
            viewport={{ amount: "all", once: true }}
            className="hidden lg:block absolute top-1/2 left-full h-1 w-28 bg-linear-to-r from-accent-green to-background"
          ></motion.div>
        )}
        <Icon className="h-12 w-12 lg:h-16 lg:w-16 text-white" />
      </div>
      <div className="text-center">
        <h3 className={cn("text-lg font-semibold", orbitron.className)}>
          {title}
        </h3>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
    </motion.div>
  );
}
