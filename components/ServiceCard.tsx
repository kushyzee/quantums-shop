import Image, { StaticImageData } from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArrowUpRight, CheckCheck } from "lucide-react";
import { orbitron } from "@/lib/fonts";
import { cn, getWhatsappUrl } from "@/lib/utils";
import { Button } from "./ui/button";
import { motion, Transition } from "motion/react";

interface ServiceCardProps {
  image: StaticImageData;
  title: string;
  description: string;
  subServices: string[];
  message: string;
  delay: number;
}

const serviceItems = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const transition: Transition = {
  duration: 0.4,
  type: "spring",
  stiffness: 400,
  damping: 20,
};

const viewport = { amount: 0.3, once: true };

export default function ServiceCard({
  image,
  title,
  description,
  subServices,
  message,
  delay,
}: ServiceCardProps) {
  const whatsappUrl = getWhatsappUrl(message);

  return (
    <motion.div
      variants={serviceItems}
      initial="initial"
      whileInView="animate"
      viewport={viewport}
      transition={{ ...transition, delay }}
    >
      <Card className="ring-primary/30 pt-0 hover:shadow-lg card-glow transition-all duration-200">
        <CardHeader className="px-0">
          <div className="h-[295px] w-full">
            <Image
              className="h-full w-full object-cover"
              src={image}
              alt={title}
            />
          </div>
          <div className="px-4 pt-4">
            <CardTitle
              className={cn(orbitron.className, "text-lg text-white font-bold")}
            >
              {title}
            </CardTitle>
            <CardDescription className="md:mt-1.5">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ul>
            {subServices.map((subService, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCheck className="text-primary w-5 h-5" />
                <p className="text-muted-foreground">{subService}</p>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="border-none">
          <a
            className="w-full text-primary"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full border-primary/30 hover:border-primary/50 hover:bg-muted transition-all duration-200"
            >
              Trade Now <ArrowUpRight />
            </Button>
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
