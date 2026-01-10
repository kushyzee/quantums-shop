import { orbitron } from "@/app/layout";
import logo from "@/assets/logo.svg";
import Image from "next/image";
import WhatsappButton from "./WhatsappButton";

export default function Footer() {
  return (
    <footer className="bg-surface-header pt-28 px-5 pb-5">
      <div className="flex mb-16">
        <div>
          <div className="flex gap-2 items-center mb-1.5">
            <Image
              className="w-8 h-auto"
              src={logo}
              alt="quantum's shop logo"
              width={32}
            />
            <p className={`font-bold ${orbitron.className}`}>Quantums Shop</p>
          </div>
          <p className="text-muted-foreground mb-7">
            Your trusted partner for gaming top-ups, gift cards, and crypto
            trading in Nigeria.
          </p>
          <WhatsappButton />
        </div>

        <div></div>

        <div></div>
      </div>

      <div className="pt-10 border-t border-primary/35">
        <p className="text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Quantums Shop. All rights reserved.{" "}
        </p>
      </div>
    </footer>
  );
}
