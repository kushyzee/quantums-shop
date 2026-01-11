import { orbitron } from "@/app/layout";
import { Badge } from "./ui/badge";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";
import Stat from "./Stat";
import Link from "next/link";
import { getWhatsappUrl } from "@/lib/utils";

export default function Hero() {
  const whatsappUrl = getWhatsappUrl("");

  return (
    <div className="relative z-20 bg-linear-to-b from-gradient to-surface-base px-5 sm:px-6 py-20">
      <div className="md:max-w-3xl mx-auto max-w-xl sm:flex flex-col justify-center">
        <div className="flex justify-center">
          <Badge className="bg-muted">
            <Zap className="text-accent-green" />
            <p className="text-muted-foreground">
              Trusted by 1000+ Nigerian Gamers
            </p>
          </Badge>
        </div>
        <div className="mt-7 text-center">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold ${orbitron.className}`}
          >
            Level Up Your <span className="text-primary">Game</span>. Trade Your{" "}
            <span className="text-primary">Asset</span>
          </h1>
          <p className="text-muted-foreground mt-5 md:text-lg lg:text-xl">
            The fastest way to Top-up PUBG & CODM, trade digital assets, and
            receive online payments in Nigeria. Instant funding at sweet rates
          </p>
          <div className="flex flex-col gap-3 mt-10 sm:flex-row sm:gap-5 sm:justify-center">
            <a target="_blank" href={whatsappUrl}>
              <Button size="lg" className="w-full">
                Get Started <ArrowRight />
              </Button>
            </a>

            <Link href="#our-services">
              <Button variant="outline" size="lg" className="w-full">
                View Services
              </Button>
            </Link>
          </div>
          <div className="mt-16 flex justify-between items-center max-w-xl mx-auto">
            <Stat title="5K+" value="Transactions" />
            <Stat title="24/7" value="Support" />
            <Stat title="2Min" value="Avg. Time" />
          </div>
        </div>
      </div>
    </div>
  );
}
