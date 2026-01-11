"use client";

import SectionHeader from "./SectionHeader";
import ServiceCard from "./ServiceCard";
import paypal from "@/assets/paypal.jpg";
import usdt from "@/assets/usdt.jpg";
import codm from "@/assets/codm.jpg";
import psn from "@/assets/psn.jpg";
import { motion } from "motion/react";

const serviceItems = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

export default function OurServices() {
  return (
    <SectionHeader
      id="our-services"
      title="Our"
      highlightedWord="Services"
      subtitle="From gaming top-ups to crypto trades, we've got everything you need at unbeatable rates"
      className="bg-surface-base"
    >
      <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 max-w-[1200px] mx-auto">
        <motion.div
          variants={serviceItems}
          initial="initial"
          whileInView="animate"
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.35 }}
        >
          <ServiceCard
            image={paypal}
            title="Payment methods"
            description="Buy & sell digital wallet balances"
            subServices={["PayPal", "Zelle", "Cash App", "Skrill & More"]}
            message="Hello Quantum, I want to receive funds"
          />
        </motion.div>

        <motion.div
          variants={serviceItems}
          initial="initial"
          whileInView="animate"
          viewport={{ amount: 0.3 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            bounce: 0.35,
          }}
        >
          <ServiceCard
            image={usdt}
            title="Crypto Exchange"
            description="Trade cryptocurrency at the best rates"
            subServices={[
              "USDT",
              "Bitcoin (BTC)",
              "Ethereum (ETH)",
              "Other Altcoins",
            ]}
            message="Hello Quantum, I want to trade crypto"
          />
        </motion.div>
        <motion.div
          variants={serviceItems}
          initial="initial"
          whileInView="animate"
          viewport={{ amount: 0.3 }}
          transition={{
            duration: 0.5,
            delay: 0.4,
            type: "spring",
            bounce: 0.35,
          }}
        >
          <ServiceCard
            image={codm}
            title="Gaming Top-Ups"
            description="Top-up your favorite mobile games instantly"
            subServices={[
              "CODM CP",
              "PUBGM UC",
              "Mobile Legends",
              "Free Fire Diamonds",
            ]}
            message="Hello Quantum, I want to top-up my game"
          />
        </motion.div>
        <motion.div
          variants={serviceItems}
          initial="initial"
          whileInView="animate"
          viewport={{ amount: 0.3 }}
          transition={{
            duration: 0.5,
            delay: 0.6,
            type: "spring",
            bounce: 0.35,
          }}
        >
          <ServiceCard
            image={psn}
            title="Gift Cards"
            description="Premium gift cards at competitive rates"
            subServices={[
              "PlayStation (PSN)",
              "iTunes",
              "Steam",
              "Google Play",
            ]}
            message="Hello Quantum, I want to buy gift cards"
          />
        </motion.div>
      </motion.div>
    </SectionHeader>
  );
}
