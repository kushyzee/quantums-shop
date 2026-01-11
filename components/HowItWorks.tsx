import { CircleDollarSign, MessageCircle, Rocket } from "lucide-react";
import HowItWorksCard from "./HowItWorksCard";
import SectionHeader from "./SectionHeader";
import Cta from "./Cta";

export default function HowItWorks() {
  return (
    <SectionHeader
      title="How It"
      highlightedWord="Works"
      subtitle="Trading with Quantum's Shop is simple, fast, and secure. Get started in 3 easy steps."
      id="how-it-works"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-14 max-w-[1200px] mx-auto">
        <HowItWorksCard
          Icon={MessageCircle}
          title="Contact Us"
          description='Click any "Trade Now" button to open WhatsApp and tell us what you need; Funds pickup, gaming top-up, crypto, or gift cards.'
        />
        <HowItWorksCard
          Icon={CircleDollarSign}
          title="Get Your Rate"
          description="We'll respond instantly with our best rate. Compare and confirm; our prices are always competitive."
        />
        <HowItWorksCard
          Icon={Rocket}
          title="Instant Delivery"
          description="Complete the transaction and receive your funds or top-up instantly. Simple, fast, trusted."
        />
      </div>
      <Cta />
    </SectionHeader>
  );
}
