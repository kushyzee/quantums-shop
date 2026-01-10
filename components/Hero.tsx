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
    <div className="relative z-20 bg-linear-to-b from-gradient to-surface-base px-5 py-20">
      <div className="flex justify-center">
        <Badge className="bg-muted">
          <Zap className="text-accent-green" />
          <p className="text-muted-foreground">
            Trusted by 1000+ Nigerian Gamers
          </p>
        </Badge>
      </div>
      <div className="mt-7">
        <h1 className={`text-4xl font-bold ${orbitron.className}`}>
          Level Up Your <span className="text-primary">Game</span>. Trade Your{" "}
          <span className="text-primary">Asset</span>
        </h1>
        <p className="text-muted-foreground mt-5">
          The fastest way to Top-up PUBG & CODM, trade digital assets, and
          receive online payments in Nigeria. Instant funding at sweet rates
        </p>
        <div className="flex flex-col gap-3 mt-10">
          <a target="_blank" href={whatsappUrl}>
            <Button size="lg" className="w-full">
              Get Started <ArrowRight />
            </Button>
          </a>

          <Link href="#our-services">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-primary text-primary"
            >
              View Services
            </Button>
          </Link>
        </div>
        <div className="mt-16 flex justify-between items-center">
          <Stat title="5K+" value="Transactions" />
          <Stat title="24/7" value="Support" />
          <Stat title="2Min" value="Avg. Time" />
        </div>
      </div>
    </div>
  );
}
