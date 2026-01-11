"use client";

import { orbitron } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  highlightedWord: string;
  subtitle: string;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export default function SectionHeader({
  title,
  highlightedWord,
  subtitle,
  className,
  id,
  children,
}: SectionHeaderProps) {
  return (
    <section className={cn("py-20 lg:py-36 md:px-6 px-5", className)} id={id}>
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ margin: "-150px 0px" }}
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold",
            orbitron.className
          )}
        >
          {title} <span className="text-primary">{highlightedWord}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          viewport={{ margin: "-150px 0px" }}
          className="text-muted-foreground mt-1.5 lg:text-lg"
        >
          {subtitle}
        </motion.p>
      </div>
      {children}
    </section>
  );
}
