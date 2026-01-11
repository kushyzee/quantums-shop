import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { orbitron } from "@/app/layout";
import WhatsappButton from "./WhatsappButton";

export default function Cta() {
  return (
    <Card className="mt-20 ring-primary/30 py-5 md:py-8 lg:py-12 hover:ring-primary/50 transition-all duration-200">
      <CardHeader>
        <CardTitle
          className={cn(
            "text-center text-white text-2xl lg:text-3xl font-bold",
            orbitron.className
          )}
        >
          Ready to Get Started?
        </CardTitle>
      </CardHeader>
      <CardContent className="max-w-[640px] mx-auto">
        <p className="text-center text-muted-foreground text-base">
          Join hundreds of satisfied customers who trust Quantum&apos;s Shop for
          their digital trading needs.
        </p>
      </CardContent>
      <CardFooter className="border-none pb-5 md:mx-auto">
        <WhatsappButton isFull={true} />
      </CardFooter>
    </Card>
  );
}
