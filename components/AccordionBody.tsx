import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface AccordionBodyProps {
  question: string;
  answer: string;
  value: string;
}

export default function AccordionBody({
  question,
  answer,
  value,
}: AccordionBodyProps) {
  return (
    <AccordionItem className="border border-muted-foreground" value={value}>
      <AccordionTrigger className="font-semibold">{question}</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}
