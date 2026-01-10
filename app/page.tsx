import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import OurServices from "@/components/OurServices";
import RatesCarousel from "@/components/RatesCarousel";
import WhyUs from "@/components/WhyUs";

export default function Page() {
  return (
    <div>
      <Hero />
      <RatesCarousel />
      <OurServices />
      <WhyUs />
      <HowItWorks />
      <Faq />
    </div>
  );
}
