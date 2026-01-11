"use client";

import { orbitron } from "@/lib/fonts";
import { Badge } from "./ui/badge";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";
import Stat from "./Stat";
import { getWhatsappUrl } from "@/lib/utils";
import { motion, stagger } from "motion/react";

const heroParent = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.2, { startDelay: 0.3 }),
      duration: 0.4,
    },
  },
};

const heroItem = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const heroButtonParent = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.2, { startDelay: 0.1 }),
      duration: 0.4,
    },
  },
};

const heroButton = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
};

export default function Hero() {
  const whatsappUrl = getWhatsappUrl("");

  return (
    <motion.div
      className="relative z-20 bg-linear-to-b from-gradient to-surface-base px-5 sm:px-6 py-20"
      variants={heroParent}
      initial="initial"
      animate="animate"
    >
      <div className="md:max-w-3xl mx-auto max-w-xl sm:flex flex-col justify-center">
        <motion.div className="flex justify-center" variants={heroItem}>
          <Badge className="bg-muted">
            <Zap className="text-accent-green" />
            <p className="text-muted-foreground">
              Trusted by 1000+ Nigerian Gamers
            </p>
          </Badge>
        </motion.div>
        <div className="mt-7 text-center">
          <motion.h1
            variants={heroItem}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold ${orbitron.className}`}
          >
            Level Up Your <span className="text-primary">Game</span>. Trade Your{" "}
            <span className="text-primary">Asset</span>
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="text-muted-foreground mt-5 md:text-lg lg:text-xl"
          >
            The fastest way to Top-up PUBG & CODM, trade digital assets, and
            receive online payments in Nigeria. Instant funding at sweet rates
          </motion.p>
          <motion.div
            variants={heroButtonParent}
            className="flex flex-col gap-3 mt-10 sm:flex-row sm:gap-5 sm:justify-center"
          >
            <motion.a variants={heroButton} target="_blank" href={whatsappUrl}>
              <Button size="lg" className="w-full">
                Get Started <ArrowRight />
              </Button>
            </motion.a>

            <motion.a variants={heroButton} href="#our-services">
              <Button variant="outline" size="lg" className="w-full">
                View Services
              </Button>
            </motion.a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 flex justify-between items-center max-w-xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ margin: "-150px 0px", once: true }}
            >
              <Stat title="5K+" value="Transactions" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ margin: "-150px 0px", once: true }}
            >
              <Stat title="24/7" value="Support" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ margin: "-150px 0px", once: true }}
            >
              <Stat title="2Min" value="Avg. Time" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
