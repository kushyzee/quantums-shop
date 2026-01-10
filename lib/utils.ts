import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWhatsappUrl(message: string) {
  const defaultMessage = "Hello quantum, I want to buy...";
  const encodedMessage = encodeURIComponent(message || defaultMessage);

  return `https://wa.me/2348108882679?text=${encodedMessage}`;
}
