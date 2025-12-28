import Image from "next/image";
import logo from "@/assets/logo.svg";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-surface-header p-5">
      <div className="flex justify-between items-center">
        <Link className="w-10 h-auto aspect-auto" href="/">
          <Image
            className="w-full h-full object-contain"
            src={logo}
            alt="Quantum's Shop Logo"
          />
        </Link>
        <Button size="lg">WhatsApp</Button>
      </div>
    </header>
  );
}
