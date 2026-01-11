import Image from "next/image";
import SectionHeader from "./SectionHeader";
import whyUs from "@/assets/why-us.png";
import WhyUsCard from "./WhyUsCard";
import { ShieldCheck, Zap, TrendingUp } from "lucide-react";

export default function WhyUs() {
  return (
    <SectionHeader
      title="Why Choose"
      highlightedWord="Quantum?"
      subtitle="Join thousands of satisfied customers who trust us for their digital needs"
      className="bg-muted"
      id="why-us"
    >
      <div className="mt-16 max-w-[1200px] mx-auto md:flex md:gap-8 justify-between items-center">
        <div className="grow max-w-[500px] mx-auto">
          <Image
            src={whyUs}
            alt="Why Us"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-20 md:mt-0 space-y-12 md:max-w-[400px] lg:max-w-[600px]">
          <WhyUsCard
            Icon={ShieldCheck}
            title="120% Legit"
            description="Every transaction is secure and verified. We've built our reputation on trust and transparency with thousands of satisfied customers."
          />
          <WhyUsCard
            Icon={Zap}
            title="Instant Funding"
            description="Get your funds in under 5 minutes. No delays, no excuses. We process transactions lightning-fast, 24/7."
          />
          <WhyUsCard
            Icon={TrendingUp}
            title="Sweet Rates"
            description="We offer the most competitive rates in Nigeria. Compare our prices, you won't find better value anywhere else."
          />
        </div>
      </div>
    </SectionHeader>
  );
}
