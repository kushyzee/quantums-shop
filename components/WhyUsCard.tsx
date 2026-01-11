"use client";

import { orbitron } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { whyUsTransition } from "./WhyUs";

interface WhyUsCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const whyUsCardItem = {
  initial: {
    opacity: 0,
    x: 10,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
};

export default function WhyUsCard({
  Icon,
  title,
  description,
  delay,
}: WhyUsCardProps) {
  return (
    <motion.div
      variants={whyUsCardItem}
      initial="initial"
      whileInView="animate"
      viewport={{ amount: 0.4, once: true }}
      transition={{ ...whyUsTransition, delay }}
      className="flex items-start gap-4"
    >
      <div className="p-2 rounded-md bg-accent-green/20">
        <Icon className="h-9 w-9 text-accent-green" />
      </div>
      <div>
        <h3 className={cn("text-lg font-semibold", orbitron.className)}>
          {title}
        </h3>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
    </motion.div>
  );
}
