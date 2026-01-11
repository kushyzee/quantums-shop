import Image from "next/image";
import AccordionBody from "./AccordionBody";
import SectionHeader from "./SectionHeader";
import { Accordion } from "./ui/accordion";
import faq from "@/assets/faq.svg";

export default function Faq() {
  return (
    <SectionHeader
      title="Trade With"
      highlightedWord="Confidence"
      subtitle="Everything you need to know before topping up or trading with Quantum’s Shop."
      className="bg-muted"
    >
      <div className="max-w-[1200px] mx-auto md:flex items-center justify-between gap-8 mt-10 lg:mt-16">
        <div className="md:w-1/2">
          <Accordion defaultValue={["item-1"]}>
            <AccordionBody
              question="How does Quantum’s Shop work?"
              answer="Simply choose a service on the website and click “Trade Now.” You’ll be redirected to WhatsApp with a pre-filled message, and our team will handle the transaction from there."
              value="item-1"
            />
            <AccordionBody
              question="Is Quantum’s Shop legit and secure?"
              answer="Yes. All transactions are handled manually to ensure accuracy and security, and we’ve successfully completed numerous trades for gamers and digital asset users."
              value="item-2"
            />
            <AccordionBody
              question="How fast are transactions completed?"
              answer="Most transactions are completed within minutes after payment is confirmed. Speed depends on network conditions and the service requested."
              value="item-3"
            />
            <AccordionBody
              question="What services do you offer?"
              answer="We offer gaming top-ups, gift cards, crypto trading, and PayPal/online wallet fund receiving. If you don’t see a service listed, you can always ask us on WhatsApp."
              value="item-4"
            />
            <AccordionBody
              question="How do I know the exact amount I will receive?"
              answer="Before any transaction is completed, we confirm the current rate and final amount with you on WhatsApp. Nothing is processed until you’re satisfied and give the go-ahead."
              value="item-5"
            />
          </Accordion>
        </div>
        <div className="mt-12 max-w-xl mx-auto md:mt-0 grow md:max-w-[516px]">
          <Image className="w-full" src={faq} alt="faq" />
        </div>
      </div>
    </SectionHeader>
  );
}
