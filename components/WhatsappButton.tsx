import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { getWhatsappUrl } from "@/lib/utils";

interface WhatsappButtonProps {
  text?: string;
  isFull?: boolean;
}

export default function WhatsappButton({ text, isFull }: WhatsappButtonProps) {
  const whatsappUrl = getWhatsappUrl("");

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={isFull ? "w-full" : ""}
    >
      <Button size="lg" className={isFull ? "w-full" : ""}>
        <MessageCircle /> {text || "Chat With Us Now"}
      </Button>
    </a>
  );
}
