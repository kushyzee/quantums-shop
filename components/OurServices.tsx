"use client";

import SectionHeader from "./SectionHeader";
import ServiceCard from "./ServiceCard";
import paypal from "@/assets/paypal.jpg";
import usdt from "@/assets/usdt.jpg";
import codm from "@/assets/codm.jpg";
import psn from "@/assets/psn.jpg";

export default function OurServices() {
  return (
    <SectionHeader
      id="our-services"
      title="Our"
      highlightedWord="Services"
      subtitle="From gaming top-ups to crypto trades, we've got everything you need at unbeatable rates"
      className="bg-surface-base"
    >
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 max-w-[1200px] mx-auto">
        <ServiceCard
          image={paypal}
          title="Payment methods"
          description="Buy & sell digital wallet balances"
          subServices={["PayPal", "Zelle", "Cash App", "Skrill & More"]}
          message="Hello Quantum, I want to receive funds"
          delay={0}
        />
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
          delay={0.1}
        />
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
          delay={0.2}
        />
        <ServiceCard
          image={psn}
          title="Gift Cards"
          description="Premium gift cards at competitive rates"
          subServices={["PlayStation (PSN)", "iTunes", "Steam", "Google Play"]}
          message="Hello Quantum, I want to buy gift cards"
          delay={0.3}
        />
      </div>
    </SectionHeader>
  );
}
