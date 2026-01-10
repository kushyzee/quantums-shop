import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWhatsappUrl(message: string) {
  const defaultMessage =
    "Hello quantum, I saw your website and I would like to inquire about your digital asset services and current rates";
  const encodedMessage = encodeURIComponent(
    (message || defaultMessage) + ". - [Sent via Quantum's Shop Web Portal]"
  );

  return `https://wa.me/2348108882679?text=${encodedMessage}`;
}
