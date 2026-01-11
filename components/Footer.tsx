import { orbitron } from "@/app/layout";
import logo from "@/assets/logo.svg";
import Image from "next/image";
import WhatsappButton from "./WhatsappButton";
import Link from "next/link";
import { Badge } from "./ui/badge";

const quickLinks = [
  {
    link: "#our-services",
    name: "Our Services",
  },
  {
    link: "#why-us",
    name: "Why Us",
  },
  {
    link: "#how-it-works",
    name: "How It Works",
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-header pt-28 px-5 pb-5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:justify-between mb-16 gap-16 lg:gap-8">
        <div className="md:col-span-2">
          <div className="flex gap-2 items-center mb-3">
            <Image
              className="w-10 h-auto"
              src={logo}
              alt="quantum's shop logo"
              width={40}
            />
            <p className={`font-bold ${orbitron.className} text-lg`}>
              Quantums Shop
            </p>
          </div>
          <p className="text-muted-foreground mb-7 md:max-w-sm lg:max-w-md">
            Your trusted partner for gaming top-ups, gift cards, and crypto
            trading in Nigeria.
          </p>
          <WhatsappButton />
        </div>

        <div>
          <p className={`${orbitron.className} text-lg font-bold`}>
            Quick Links
          </p>
          <ul className="space-y-4 mt-5">
            {quickLinks.map((item) => (
              <li key={item.name} className="text-muted-foreground">
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={`${orbitron.className} text-lg font-bold`}>
            We Accept/Trade
          </p>
          <ul className="mt-5 flex gap-4 items-center">
            <li>
              <Badge className="bg-footer-badge text-muted-foreground">
                Bitcoin
              </Badge>
            </li>
            <li>
              <Badge className="bg-footer-badge text-muted-foreground">
                Bank
              </Badge>
            </li>
            <li>
              <Badge className="bg-footer-badge text-muted-foreground">
                E-wallet
              </Badge>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-10 border-t border-primary/20">
        <p className="text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Quantums Shop. All rights reserved.{" "}
        </p>
      </div>
    </footer>
  );
}
