import { orbitron } from "@/app/layout";

interface StatProps {
  title: string;
  value: string;
}

export default function Stat({ title, value }: StatProps) {
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <p
        className={`${orbitron.className} text-2xl lg:text-3xl font-bold text-primary`}
      >
        {title}
      </p>
      <p className="text-muted-foreground text-sm lg:text-base">{value}</p>
    </div>
  );
}
