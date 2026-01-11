import { orbitron } from "@/lib/fonts";
import { motion } from "motion/react";

interface StatProps {
  title: string;
  value: string;
}

export default function Stat({ title, value }: StatProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ margin: "-150px 0px", once: true }}
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
