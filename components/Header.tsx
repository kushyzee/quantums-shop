import Image from "next/image";
import logo from "@/assets/logo.svg";
import Link from "next/link";
import WhatsappButton from "./WhatsappButton";
import { orbitron } from "@/app/layout";

export default function Header() {
  return (
    <header className="bg-surface-header fixed top-0 left-0 right-0 z-50 py-4 px-5">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto">
        <Link className=" sm:flex gap-2 items-center" href="/">
          <Image
            className="w-10 h-full object-contain"
            src={logo}
            alt="Quantum's Shop Logo"
          />
          <p
            className={`text-white sr-only sm:not-sr-only font-bold ${orbitron.className}`}
          >
            Quantums Shop
          </p>
        </Link>
        <WhatsappButton text="WhatsApp" />
      </div>
    </header>
  );
}
