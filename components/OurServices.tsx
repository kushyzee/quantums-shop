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
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ServiceCard
          image={paypal}
          title="Payment Methods"
          description="Buy & sell digital wallet balances"
          subServices={["PayPal", "Zelle", "Cash App", "Skrill & More"]}
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
        />
        <ServiceCard
          image={psn}
          title="Gift Cards"
          description="Premium gift cards at competitive rates"
          subServices={["PlayStation (PSN)", "iTunes", "Steam", "Google Play"]}
        />
      </div>
    </SectionHeader>
  );
}
