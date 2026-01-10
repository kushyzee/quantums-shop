import Image from "next/image";
import logo from "@/assets/logo.svg";
import Link from "next/link";
import WhatsappButton from "./WhatsappButton";

export default function Header() {
  return (
    <header className="bg-surface-header py-4 px-5">
      <div className="flex justify-between items-center">
        <Link className="w-10 h-auto aspect-auto" href="/">
          <Image
            className="w-full h-full object-contain"
            src={logo}
            alt="Quantum's Shop Logo"
          />
        </Link>
        <WhatsappButton text="WhatsApp" />
      </div>
    </header>
  );
}
