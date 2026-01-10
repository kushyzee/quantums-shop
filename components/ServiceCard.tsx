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
import { orbitron } from "@/app/layout";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface ServiceCardProps {
  image: StaticImageData;
  title: string;
  description: string;
  subServices: string[];
}

export default function ServiceCard({
  image,
  title,
  description,
  subServices,
}: ServiceCardProps) {
  return (
    <Card className="ring-primary pt-0">
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
            className={cn(orbitron.className, "text-xl text-white font-bold")}
          >
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
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
        <a className="w-full text-primary" href="#">
          <Button size="lg" variant="outline" className="w-full">
            Trade Now <ArrowUpRight />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
