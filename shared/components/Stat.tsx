import { orbitron } from "@/lib/fonts";
import { motion } from "motion/react";

interface StatProps {
  title: string;
  value: string;
  delay: number;
}

export default function Stat({ title, value, delay }: StatProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ amount: 0.5, once: true }}
      className="flex flex-col gap-0.5 items-center"
    >
      <p
        className={`${orbitron.className} text-2xl lg:text-3xl font-bold text-primary`}
      >
        {title}
      </p>
      <p className="text-muted-foreground text-sm lg:text-base">{value}</p>
    </motion.div>
  );
}
